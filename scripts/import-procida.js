// Script pour importer les données d'hébergement de Procida depuis Apify
const fs = require('fs');
const path = require('path');
const https = require('https');

// URL de l'API Apify pour Procida
const APIFY_URL = 'https://api.apify.com/v2/datasets/AD4HqAprdEUpaLda3/items?token=apify_api_SSILb5pMEFd7M4ON7t0ViHjgvRPOjb0tOj6c';

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
  } else if (type.includes('hotel') || type.includes('bed_and_breakfast')) {
    return 'hotels';
  }
  
  // Par défaut, on classe en fonction des mots clés dans le nom ou la description
  const text = `${item.name || ''} ${item.description || ''}`.toLowerCase();
  
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
  
  // Caractéristiques par défaut pour Procida
  if (features.length === 0) {
    features.push("WiFi gratuit");
    features.push("Vue sur mer");
    features.push("Climatisation");
    features.push("Accès aux plages");
    features.push("Architecture locale");
    features.push("Balcon ou terrasse");
  }
  
  return features;
}

// Fonction pour traduire la description de l'anglais au français
function translateDescription(description) {
  if (!description) return "Magnifique hébergement sur l'île colorée de Procida avec vue sur mer. Profitez d'un séjour authentique dans l'un des plus beaux villages d'Italie, entre ruelles pittoresques et plages préservées.";
  
  // Nettoyer la description
  let cleanDesc = description
    .replace(/\\n/g, ' ')
    .replace(/\n/g, ' ')
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
    { en: "ocean view", fr: "vue sur la mer" },
    { en: "city view", fr: "vue sur la ville" },
    { en: "mountain view", fr: "vue sur la montagne" },
    { en: "seating area", fr: "coin salon" },
    { en: "kitchen", fr: "cuisine" },
    { en: "flat-screen TV", fr: "télévision à écran plat" },
    { en: "private bathroom", fr: "salle de bain privée" },
    { en: "shower", fr: "douche" },
    { en: "hair dryer", fr: "sèche-cheveux" },
    { en: "located in", fr: "situé à" },
    { en: "Procida", fr: "Procida" },
    { en: "Naples", fr: "Naples" },
    { en: "Capri", fr: "Capri" },
    { en: "Ischia", fr: "Ischia" },
    { en: "Tyrrhenian Sea", fr: "mer Tyrrhénienne" },
    { en: "Mediterranean", fr: "Méditerranée" },
    { en: "Gulf of Naples", fr: "golfe de Naples" },
    { en: "ferry", fr: "ferry" },
    { en: "boat", fr: "bateau" },
    { en: "port", fr: "port" },
    { en: "Marina Grande", fr: "Marina Grande" },
    { en: "Marina Corricella", fr: "Marina Corricella" },
    { en: "Marina Chiaiolella", fr: "Marina Chiaiolella" },
    { en: "Terra Murata", fr: "Terra Murata" },
    { en: "Abbey of San Michele", fr: "Abbaye de San Michele" },
    { en: "Palazzo d'Avalos", fr: "Palais d'Avalos" },
    { en: "Pozzo Vecchio", fr: "Pozzo Vecchio" },
    { en: "Il Postino", fr: "Le Facteur" },
    { en: "Spiaggia Chiaia", fr: "Plage de Chiaia" },
    { en: "Spiaggia della Chiaiolella", fr: "Plage de Chiaiolella" },
    { en: "the hotel features", fr: "l'hôtel dispose de" },
    { en: "the apartment features", fr: "l'appartement dispose de" },
    { en: "the villa features", fr: "la villa dispose de" },
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
    { en: "patio", fr: "patio" },
    { en: "shuttle", fr: "navette" },
    { en: "colorful houses", fr: "maisons colorées" },
    { en: "fishing village", fr: "village de pêcheurs" },
    { en: "traditional architecture", fr: "architecture traditionnelle" }
  ];
  
  translations.forEach(item => {
    // Remplacer tous les cas en respectant la casse
    const regex = new RegExp(item.en, 'gi');
    cleanDesc = cleanDesc.replace(regex, match => {
      // Conserver la même casse
      if (match === match.toUpperCase()) return item.fr.toUpperCase();
      if (match[0] === match[0].toUpperCase()) return item.fr.charAt(0).toUpperCase() + item.fr.slice(1);
      return item.fr;
    });
  });

  // Ajouter un message de bienvenue personnalisé pour Procida
  cleanDesc += " Bienvenue à Procida, l'île colorée du golfe de Naples. Cette petite perle de la Méditerranée, moins connue que ses voisines Capri et Ischia, vous séduira par son authenticité préservée et ses façades aux couleurs pastel. Élue Plus Beau Village d'Italie en 2021, Procida offre un dédale de ruelles pittoresques, des ports de pêche traditionnels et des plages intimes. Loin du tourisme de masse, vous découvrirez ici la dolce vita à l'italienne, entre charme intemporel et atmosphère paisible. Les amateurs de cinéma reconnaîtront les décors du film 'Le Facteur' (Il Postino) et de 'Le Talentueux Mr. Ripley'.";
  
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
    try {
      const type = determineType(item);
      const features = extractFeatures(item);
      const translatedDescription = translateDescription(item.description);
      
      const transformedItem = {
        id: item.hotelId || (8500000 + index),
        name: item.name || `Hébergement à Procida ${index + 1}`,
        type: type,
        description: translatedDescription,
        features: features,
        price: null, // Prix sur demande
        images: item.images || [],
        location: item.address?.full || 'Procida, Italie'
      };
      
      transformedData[type].push(transformedItem);
    } catch (error) {
      console.error(`Erreur lors de la transformation de l'élément ${index}:`, error);
    }
  });
  
  return transformedData;
}

// Fonction principale
async function main() {
  try {
    console.log('Téléchargement des données depuis Apify pour Procida...');
    const apifyData = await fetchApifyData();
    console.log(`${apifyData.length} hébergements trouvés dans le dataset Apify.`);
    
    console.log('Transformation des données...');
    const procidaData = transformData(apifyData);
    console.log(`Données transformées: ${procidaData.appartements.length} appartements, ${procidaData.villas.length} villas, ${procidaData.hotels.length} hôtels.`);
    
    // Vérifier si le fichier de données existe déjà, sinon le créer
    let existingData = {};
    try {
      const existingDataRaw = fs.readFileSync(DATA_PATH, 'utf8');
      existingData = JSON.parse(existingDataRaw);
    } catch (error) {
      console.log('Création d\'un nouveau fichier de données...');
      existingData = {
        france: {},
        espagne: {},
        italie: {}
      };
    }
    
    // S'assurer que la structure existe
    if (!existingData.italie) {
      existingData.italie = {};
    }
    
    // Ajouter les données
    existingData.italie['procida'] = procidaData;
    
    console.log('Écriture des données...');
    fs.writeFileSync(DATA_PATH, JSON.stringify(existingData, null, 2), 'utf8');
    
    console.log('Importation terminée avec succès!');
  } catch (error) {
    console.error('Erreur lors de l\'importation:', error);
  }
}

main(); 