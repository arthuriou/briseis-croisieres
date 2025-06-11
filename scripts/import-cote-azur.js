// Script pour importer les données d'hébergement de la Côte d'Azur depuis Apify
const fs = require('fs');
const path = require('path');
const https = require('https');

// URL de l'API Apify pour la Côte d'Azur / Provence-Alpes-Côte d'Azur
const APIFY_URL = 'https://api.apify.com/v2/datasets/JLXakbhRtL6RMMNcN/items?token=apify_api_SSILb5pMEFd7M4ON7t0ViHjgvRPOjb0tOj6c';

// Chemin vers le fichier de données d'hébergements
const DATA_PATH = path.join(__dirname, '../public/data/hebergements.json');

// Fonction pour télécharger les données d'Apify
function fetchApifyData() {
  return new Promise((resolve, reject) => {
    https.get(APIFY_URL, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          reject(new Error(`Erreur lors du parsing des données: ${error.message}`));
        }
      });
    }).on('error', (error) => {
      reject(new Error(`Erreur lors de la récupération des données: ${error.message}`));
    });
  });
}

// Fonction pour déterminer le type d'hébergement
function determineType(item) {
  const type = item.type?.toLowerCase() || '';
  
  if (type.includes('apartment') || type.includes('studio')) {
    return 'appartements';
  } else if (type.includes('villa') || type.includes('home') || type.includes('house')) {
    return 'villas';
  } else if (type.includes('hotel')) {
    return 'hotels';
  }
  
  // Par défaut, on classe en fonction des mots clés dans le nom ou la description
  const text = `${item.name} ${item.description}`.toLowerCase();
  
  if (text.includes('appartement') || text.includes('studio') || text.includes('apartment')) {
    return 'appartements';
  } else if (text.includes('villa') || text.includes('maison') || text.includes('house')) {
    return 'villas';
  } else {
    return 'hotels'; // Par défaut
  }
}

// Fonction pour extraire les caractéristiques de l'hébergement
function extractFeatures(item) {
  const features = [];
  
  // Extraire depuis facilitiesGroups si disponible
  if (item.facilitiesGroups && Array.isArray(item.facilitiesGroups)) {
    item.facilitiesGroups.forEach(group => {
      if (group.facilities && Array.isArray(group.facilities)) {
        group.facilities.forEach(facility => {
          if (facility.name && !features.includes(facility.name)) {
            features.push(facility.name);
          }
        });
      }
    });
  }
  
  // Caractéristiques par défaut pour la Côte d'Azur
  if (features.length === 0) {
    features.push("WiFi gratuit");
    features.push("Climatisation");
    features.push("Vue mer/montagne");
    features.push("Terrasse privée");
    features.push("Parking");
  }
  
  return features;
}

// Fonction pour traduire la description de l'anglais au français
function translateDescription(description) {
  if (!description) return "";
  
  // Nettoyer la description
  let cleanDesc = description
    .replace(/\\n/g, '\n')
    .replace(/You might be eligible for a Genius discount.*?available deals\./gs, '')
    .replace(/About this property/g, 'À propos de cet hébergement')
    .replace(/Reliable info:.*?very accurate\./gs, 'Information fiable : Les clients confirment que les photos et la description correspondent à la réalité.');

  // Traduire les termes communs
  const translations = [
    { en: "Sun Terrace", fr: "Terrasse ensoleillée" },
    { en: "Garden", fr: "Jardin" },
    { en: "swimming pool", fr: "piscine" },
    { en: "outdoor seating area", fr: "espace extérieur" },
    { en: "garden views", fr: "vue sur le jardin" },
    { en: "sea view", fr: "vue sur mer" },
    { en: "mountain view", fr: "vue sur montagne" },
    { en: "The holiday home features", fr: "Cette résidence dispose de" },
    { en: "The apartment features", fr: "Cet appartement dispose de" },
    { en: "The villa features", fr: "Cette villa dispose de" },
    { en: "The hotel features", fr: "Cet hôtel dispose de" },
    { en: "bedrooms", fr: "chambres" },
    { en: "bathrooms", fr: "salles de bain" },
    { en: "living room", fr: "salon" },
    { en: "fully equipped kitchen", fr: "cuisine entièrement équipée" },
    { en: "private parking", fr: "parking privé" },
    { en: "free WiFi", fr: "WiFi gratuit" },
    { en: "air conditioning", fr: "climatisation" },
    { en: "heated pool", fr: "piscine chauffée" }
  ];
  
  translations.forEach(item => {
    // Remplacer tous les cas en respectant la casse
    const regex = new RegExp(item.en, 'gi');
    cleanDesc = cleanDesc.replace(regex, match => {
      // Conserver la même casse (tout en majuscules, première lettre en majuscule, ou tout en minuscules)
      if (match === match.toUpperCase()) return item.fr.toUpperCase();
      if (match[0] === match[0].toUpperCase()) return item.fr.charAt(0).toUpperCase() + item.fr.slice(1);
      return item.fr;
    });
  });

  // Ajouter un message de bienvenue personnalisé à la Côte d'Azur
  cleanDesc += "\n\nBienvenue sur la Côte d'Azur, riviera française mondialement célèbre. Profitez d'un climat exceptionnel toute l'année et découvrez ses plages idylliques, ses villages perchés et sa gastronomie méditerranéenne. Entre Saint-Tropez, Cannes, Nice et Monaco, vivez l'art de vivre provençal dans un cadre sophistiqué et élégant.";
  
  return cleanDesc;
}

// Fonction pour générer un prix d'hébergement réaliste
function generatePrice(item) {
  // Base de prix selon le type
  let basePrice;
  const type = determineType(item);
  
  if (type === 'appartements') {
    basePrice = 120; // Prix de base pour les appartements
  } else if (type === 'villas') {
    basePrice = 300; // Prix de base pour les villas
  } else {
    basePrice = 180; // Prix de base pour les hôtels
  }
  
  // Facteurs qui influencent le prix
  const starsFactor = item.stars ? (item.stars / 3) : 1;
  const ratingFactor = item.rating ? (item.rating / 8) : 1;
  
  // Calculer le prix final
  let price = Math.round(basePrice * starsFactor * ratingFactor);
  
  // Ajouter une variation aléatoire de ±10%
  const variation = 0.9 + (Math.random() * 0.2);
  price = Math.round(price * variation);
  
  // S'assurer que le prix est dans une fourchette raisonnable
  if (type === 'appartements' && price < 90) price = 90;
  if (type === 'villas' && price < 250) price = 250;
  if (type === 'hotels' && price < 150) price = 150;
  
  return price;
}

// Fonction pour transformer les données Apify en format compatible
function transformData(apifyData) {
  const transformedData = {
    appartements: [],
    villas: [],
    hotels: []
  };
  
  apifyData.forEach((item, index) => {
    const type = determineType(item);
    const features = extractFeatures(item);
    const translatedDescription = translateDescription(item.description);
    const price = generatePrice(item);
    
    const transformedItem = {
      id: item.hotelId || (5000000 + index), // Utiliser l'ID de l'hôtel ou générer un ID unique
      name: item.name,
      type: type,
      description: translatedDescription,
      features: features,
      price: price,
      images: item.images || [],
      location: item.address?.full || 'Côte d\'Azur, France'
    };
    
    transformedData[type].push(transformedItem);
  });
  
  return transformedData;
}

// Fonction principale
async function main() {
  try {
    console.log('Téléchargement des données depuis Apify pour la Côte d\'Azur...');
    const apifyData = await fetchApifyData();
    console.log(`${apifyData.length} hébergements trouvés dans le dataset Apify.`);
    
    console.log('Transformation des données...');
    const coteAzurData = transformData(apifyData);
    console.log(`Données transformées: ${coteAzurData.appartements.length} appartements, ${coteAzurData.villas.length} villas, ${coteAzurData.hotels.length} hôtels.`);
    
    console.log('Lecture du fichier de données existant...');
    const existingDataRaw = fs.readFileSync(DATA_PATH, 'utf8');
    const existingData = JSON.parse(existingDataRaw);
    
    // S'assurer que la structure existe
    if (!existingData.france) {
      existingData.france = {};
    }
    if (!existingData.france['cote-d-azur']) {
      existingData.france['cote-d-azur'] = {};
    }
    
    // Ajouter les données
    existingData.france['cote-d-azur'] = coteAzurData;
    
    console.log('Écriture des données...');
    fs.writeFileSync(DATA_PATH, JSON.stringify(existingData, null, 2), 'utf8');
    
    console.log('Importation terminée avec succès!');
  } catch (error) {
    console.error('Erreur lors de l\'importation:', error);
  }
}

main(); 