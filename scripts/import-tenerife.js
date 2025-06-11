// Script pour importer les données d'hébergement de Tenerife depuis Apify
const fs = require('fs');
const path = require('path');
const https = require('https');

// URL de l'API Apify pour Tenerife
const APIFY_URL = 'https://api.apify.com/v2/datasets/gnRfD7vLkwXPwqC10/items?token=apify_api_SSILb5pMEFd7M4ON7t0ViHjgvRPOjb0tOj6c';

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
  
  if (text.includes('apartament') || text.includes('studio') || text.includes('apartment')) {
    return 'appartements';
  } else if (text.includes('villa') || text.includes('casa') || text.includes('house')) {
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
  
  // Caractéristiques par défaut pour Tenerife
  if (features.length === 0) {
    features.push("WiFi gratuit");
    features.push("Climatisation");
    features.push("Vue mer");
    features.push("Piscine");
    features.push("Accès direct à la plage");
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
    { en: "Outdoor swimming pool", fr: "Piscine extérieure" },
    { en: "Indoor swimming pool", fr: "Piscine intérieure" },
    { en: "beach", fr: "plage" },
    { en: "outdoor seating area", fr: "espace extérieur" },
    { en: "garden views", fr: "vue sur le jardin" },
    { en: "sea view", fr: "vue sur mer" },
    { en: "ocean view", fr: "vue sur l'océan" },
    { en: "mountain view", fr: "vue sur la montagne" },
    { en: "Teide", fr: "Teide" },
    { en: "marina view", fr: "vue sur le port de plaisance" },
    { en: "The hotel features", fr: "L'hôtel dispose de" },
    { en: "The apartment features", fr: "L'appartement dispose de" },
    { en: "The villa features", fr: "La villa dispose de" },
    { en: "rooms feature", fr: "les chambres disposent de" },
    { en: "bedrooms", fr: "chambres" },
    { en: "bathrooms", fr: "salles de bain" },
    { en: "living room", fr: "salon" },
    { en: "fully equipped kitchen", fr: "cuisine entièrement équipée" },
    { en: "private parking", fr: "parking privé" },
    { en: "free WiFi", fr: "WiFi gratuit" },
    { en: "air conditioning", fr: "climatisation" },
    { en: "heated pool", fr: "piscine chauffée" },
    { en: "buffet breakfast", fr: "petit-déjeuner buffet" },
    { en: "Tenerife", fr: "Tenerife" },
    { en: "Canary Islands", fr: "Îles Canaries" },
    { en: "Playa de las Americas", fr: "Playa de las Americas" },
    { en: "Costa Adeje", fr: "Costa Adeje" },
    { en: "Los Cristianos", fr: "Los Cristianos" },
    { en: "Santa Cruz", fr: "Santa Cruz" },
    { en: "Puerto de la Cruz", fr: "Puerto de la Cruz" },
    { en: "Restaurant", fr: "Restaurant" },
    { en: "fitness centre", fr: "salle de fitness" },
    { en: "spa", fr: "spa" },
    { en: "wellness", fr: "bien-être" }
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

  // Ajouter un message de bienvenue personnalisé à Tenerife
  cleanDesc += "\n\nBienvenue à Tenerife, la plus grande des îles Canaries. Profitez du climat subtropical avec du soleil toute l'année, des plages volcaniques aux eaux turquoise et des paysages spectaculaires dominés par le volcan Teide. Découvrez la richesse naturelle et culturelle de l'île, entre villages authentiques et stations balnéaires animées. Une destination idéale pour combiner détente, aventure et gastronomie locale.";
  
  return cleanDesc;
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
    
    const transformedItem = {
      id: item.hotelId || (7000000 + index), // Utiliser l'ID de l'hôtel ou générer un ID unique
      name: item.name,
      type: type,
      description: translatedDescription,
      features: features,
      price: null, // Prix sur demande
      images: item.images || [],
      location: item.address?.full || 'Tenerife, Espagne'
    };
    
    transformedData[type].push(transformedItem);
  });
  
  return transformedData;
}

// Fonction principale
async function main() {
  try {
    console.log('Téléchargement des données depuis Apify pour Tenerife...');
    const apifyData = await fetchApifyData();
    console.log(`${apifyData.length} hébergements trouvés dans le dataset Apify.`);
    
    console.log('Transformation des données...');
    const tenerifeData = transformData(apifyData);
    console.log(`Données transformées: ${tenerifeData.appartements.length} appartements, ${tenerifeData.villas.length} villas, ${tenerifeData.hotels.length} hôtels.`);
    
    console.log('Lecture du fichier de données existant...');
    const existingDataRaw = fs.readFileSync(DATA_PATH, 'utf8');
    const existingData = JSON.parse(existingDataRaw);
    
    // S'assurer que la structure existe
    if (!existingData.espagne) {
      existingData.espagne = {};
    }
    if (!existingData.espagne['tenerife']) {
      existingData.espagne['tenerife'] = {};
    }
    
    // Ajouter les données
    existingData.espagne['tenerife'] = tenerifeData;
    
    console.log('Écriture des données...');
    fs.writeFileSync(DATA_PATH, JSON.stringify(existingData, null, 2), 'utf8');
    
    console.log('Importation terminée avec succès!');
  } catch (error) {
    console.error('Erreur lors de l\'importation:', error);
  }
}

main(); 