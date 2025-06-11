// Script pour importer les données d'hébergement de Lampedusa depuis Apify
const fs = require('fs');
const path = require('path');
const https = require('https');

// URL de l'API Apify pour Lampedusa
const APIFY_URL = 'https://api.apify.com/v2/datasets/LFWYbqpIZ3js1Hsxt/items?token=apify_api_SSILb5pMEFd7M4ON7t0ViHjgvRPOjb0tOj6c';

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
  } else if (type.includes('villa') || type.includes('home') || type.includes('house') || type.includes('guest_house')) {
    return 'villas';
  } else if (type.includes('hotel') || type.includes('bed_and_breakfast')) {
    return 'hotels';
  }
  
  // Par défaut, on classe en fonction des mots clés dans le nom ou la description
  const text = `${item.name || ''} ${item.description || ''}`.toLowerCase();
  
  if (text.includes('apartament') || text.includes('studio') || text.includes('apartment') || text.includes('loft')) {
    return 'appartements';
  } else if (text.includes('villa') || text.includes('casa') || text.includes('house') || text.includes('villino')) {
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
  
  // Caractéristiques par défaut pour Lampedusa
  if (features.length === 0) {
    features.push("WiFi gratuit");
    features.push("Vue sur mer");
    features.push("Climatisation");
    features.push("Accès aux plages");
    features.push("Terrasse ensoleillée");
    features.push("Proche des réserves naturelles");
  }
  
  return features;
}

// Fonction pour traduire la description de l'anglais au français
function translateDescription(description) {
  if (!description) return "Magnifique hébergement sur l'île paradisiaque de Lampedusa avec vue sur la mer turquoise. Profitez d'un séjour idyllique entre plages de sable blanc et eaux cristallines, dans un cadre naturel préservé aux portes de l'Afrique.";
  
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
    { en: "Lampedusa", fr: "Lampedusa" },
    { en: "Rabbit Beach", fr: "Plage des Lapins" },
    { en: "Spiaggia dei Conigli", fr: "Plage des Lapins" },
    { en: "Cala Pulcino", fr: "Cala Pulcino" },
    { en: "Cala Croce", fr: "Cala Croce" },
    { en: "Cala Madonna", fr: "Cala Madonna" },
    { en: "Cala Guitgia", fr: "Cala Guitgia" },
    { en: "Cala Francese", fr: "Cala Francese" },
    { en: "Mediterranean", fr: "Méditerranée" },
    { en: "Sicily", fr: "Sicile" },
    { en: "Africa", fr: "Afrique" },
    { en: "Tunisia", fr: "Tunisie" },
    { en: "Pelagie Islands", fr: "Îles Pélages" },
    { en: "marine reserve", fr: "réserve marine" },
    { en: "nature reserve", fr: "réserve naturelle" },
    { en: "port", fr: "port" },
    { en: "harbor", fr: "port" },
    { en: "Isola dei Conigli", fr: "Île des Lapins" },
    { en: "Tabaccara", fr: "Tabaccara" },
    { en: "Albero del Sole", fr: "Albero del Sole" },
    { en: "Guitgia Beach", fr: "Plage de Guitgia" },
    { en: "Linosa", fr: "Linosa" },
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
    { en: "white sand", fr: "sable blanc" },
    { en: "crystal clear water", fr: "eau cristalline" },
    { en: "turquoise water", fr: "eau turquoise" },
    { en: "Sanctuary of Madonna", fr: "Sanctuaire de la Madone" },
    { en: "fishing village", fr: "village de pêcheurs" },
    { en: "turtles", fr: "tortues" }
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

  // Ajouter un message de bienvenue personnalisé pour Lampedusa
  cleanDesc += " Bienvenue à Lampedusa, joyau méditerranéen aux portes de l'Afrique. Cette île italienne, la plus méridionale d'Europe, est un paradis naturel baigné de lumière avec ses plages de sable blanc et ses eaux cristallines aux nuances turquoise. La célèbre Plage des Lapins, régulièrement classée parmi les plus belles plages du monde, est un sanctuaire pour les tortues marines qui viennent y pondre. Entre réserves naturelles protégées, criques secrètes accessibles uniquement par bateau et activités nautiques, Lampedusa vous offre une expérience balnéaire authentique loin du tourisme de masse. Sa culture insulaire unique, mêlant influences italiennes et nord-africaines, se reflète dans sa gastronomie savoureuse et son ambiance décontractée.";
  
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
        id: item.hotelId || (8700000 + index),
        name: item.name || `Hébergement à Lampedusa ${index + 1}`,
        type: type,
        description: translatedDescription,
        features: features,
        price: null, // Prix sur demande
        images: item.images || [],
        location: item.address?.full || 'Lampedusa, Italie'
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
    console.log('Téléchargement des données depuis Apify pour Lampedusa...');
    const apifyData = await fetchApifyData();
    console.log(`${apifyData.length} hébergements trouvés dans le dataset Apify.`);
    
    console.log('Transformation des données...');
    const lampedusaData = transformData(apifyData);
    console.log(`Données transformées: ${lampedusaData.appartements.length} appartements, ${lampedusaData.villas.length} villas, ${lampedusaData.hotels.length} hôtels.`);
    
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
    existingData.italie['lampedusa'] = lampedusaData;
    
    console.log('Écriture des données...');
    fs.writeFileSync(DATA_PATH, JSON.stringify(existingData, null, 2), 'utf8');
    
    console.log('Importation terminée avec succès!');
  } catch (error) {
    console.error('Erreur lors de l\'importation:', error);
  }
}

main(); 