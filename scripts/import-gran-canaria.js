// Script pour importer les données d'hébergement de Gran Canaria depuis Apify
const fs = require('fs');
const path = require('path');
const https = require('https');

// URL de l'API Apify pour Gran Canaria
const APIFY_URL = 'https://api.apify.com/v2/datasets/0I5g2e12IZIi1lLuf/items?token=apify_api_SSILb5pMEFd7M4ON7t0ViHjgvRPOjb0tOj6c';

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
  
  if (text.includes('apartament') || text.includes('studio') || text.includes('apartment') || text.includes('loft')) {
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
  
  // Caractéristiques par défaut pour Gran Canaria
  if (features.length === 0) {
    features.push("WiFi gratuit");
    features.push("Climatisation");
    features.push("Vue sur la ville");
    features.push("Terrasse");
    features.push("À proximité des plages");
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
    { en: "city view", fr: "vue sur la ville" },
    { en: "mountain view", fr: "vue sur la montagne" },
    { en: "seating area", fr: "coin salon" },
    { en: "kitchen", fr: "cuisine" },
    { en: "flat-screen TV", fr: "télévision à écran plat" },
    { en: "private bathroom", fr: "salle de bain privée" },
    { en: "shower", fr: "douche" },
    { en: "hair dryer", fr: "sèche-cheveux" },
    { en: "located in", fr: "situé à" },
    { en: "Las Palmas de Gran Canaria", fr: "Las Palmas de Gran Canaria" },
    { en: "Gran Canaria Airport", fr: "Aéroport de Gran Canaria" },
    { en: "Parque de Santa Catalina", fr: "Parc de Santa Catalina" },
    { en: "Calle Triana", fr: "Rue Triana" },
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
    { en: "fitness centre", fr: "salle de fitness" },
    { en: "spa", fr: "spa" },
    { en: "wellness", fr: "bien-être" },
    { en: "terrace", fr: "terrasse" },
    { en: "balcony", fr: "balcon" },
    { en: "patio", fr: "patio" }
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

  // Ajouter un message de bienvenue personnalisé à Gran Canaria
  cleanDesc += "\n\nBienvenue à Gran Canaria, l'île aux mille visages. Profitez de son climat exceptionnel avec du soleil toute l'année, ses paysages contrastés entre dunes de sable, montagnes verdoyantes et falaises impressionnantes. Découvrez Las Palmas, sa capitale animée, et les magnifiques plages du sud. Une destination idéale pour combiner détente, aventure et culture sous le soleil des Canaries.";
  
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
      id: item.hotelId || (9000000 + index), // Utiliser l'ID de l'hôtel ou générer un ID unique
      name: item.name,
      type: type,
      description: translatedDescription,
      features: features,
      price: null, // Prix sur demande
      images: item.images || [],
      location: item.address?.full || 'Gran Canaria, Espagne'
    };
    
    transformedData[type].push(transformedItem);
  });
  
  return transformedData;
}

// Fonction principale
async function main() {
  try {
    console.log('Téléchargement des données depuis Apify pour Gran Canaria...');
    const apifyData = await fetchApifyData();
    console.log(`${apifyData.length} hébergements trouvés dans le dataset Apify.`);
    
    console.log('Transformation des données...');
    const granCanariaData = transformData(apifyData);
    console.log(`Données transformées: ${granCanariaData.appartements.length} appartements, ${granCanariaData.villas.length} villas, ${granCanariaData.hotels.length} hôtels.`);
    
    console.log('Lecture du fichier de données existant...');
    const existingDataRaw = fs.readFileSync(DATA_PATH, 'utf8');
    const existingData = JSON.parse(existingDataRaw);
    
    // S'assurer que la structure existe
    if (!existingData.espagne) {
      existingData.espagne = {};
    }
    if (!existingData.espagne['gran-canaria']) {
      existingData.espagne['gran-canaria'] = {};
    }
    
    // Ajouter les données
    existingData.espagne['gran-canaria'] = granCanariaData;
    
    console.log('Écriture des données...');
    fs.writeFileSync(DATA_PATH, JSON.stringify(existingData, null, 2), 'utf8');
    
    console.log('Importation terminée avec succès!');
  } catch (error) {
    console.error('Erreur lors de l\'importation:', error);
  }
}

main(); 