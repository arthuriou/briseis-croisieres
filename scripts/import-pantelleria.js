// Script pour importer les données d'hébergement de Pantelleria depuis Apify
const fs = require('fs');
const path = require('path');
const https = require('https');

// URL de l'API Apify pour Pantelleria
const APIFY_URL = 'https://api.apify.com/v2/datasets/KZstATGyNeHGcz0K0/items?token=apify_api_SSILb5pMEFd7M4ON7t0ViHjgvRPOjb0tOj6c';

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
  } else if (type.includes('villa') || type.includes('home') || type.includes('house') || type.includes('guest_house') || type.includes('holiday_home')) {
    return 'villas';
  } else if (type.includes('hotel') || type.includes('bed_and_breakfast') || type.includes('relais')) {
    return 'hotels';
  }
  
  // Par défaut, on classe en fonction des mots clés dans le nom ou la description
  const text = `${item.name || ''} ${item.description || ''}`.toLowerCase();
  
  if (text.includes('apartament') || text.includes('studio') || text.includes('apartment') || text.includes('loft')) {
    return 'appartements';
  } else if (text.includes('villa') || text.includes('casa') || text.includes('house') || text.includes('dammuso')) {
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
  
  // Caractéristiques par défaut pour Pantelleria
  if (features.length === 0) {
    features.push("WiFi gratuit");
    features.push("Vue panoramique");
    features.push("Climatisation");
    features.push("Architecture traditionnelle");
    features.push("Terrasse ensoleillée");
    features.push("Proche des sources thermales");
  }
  
  return features;
}

// Fonction pour traduire la description de l'anglais au français
function translateDescription(description) {
  if (!description) return "Magnifique hébergement sur l'île volcanique de Pantelleria avec vue panoramique sur la Méditerranée. Profitez d'un séjour unique entre mer et montagne, dans un cadre naturel préservé entre la Sicile et l'Afrique.";
  
  // Nettoyer la description
  let cleanDesc = description
    .replace(/\\n/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/You might be eligible for a Genius discount.*?available deals\./gs, '')
    .replace(/About this property/g, 'À propos de cet hébergement')
    .replace(/Reliable info:.*?very accurate\./gs, 'Information fiable : Les clients confirment que les photos et la description correspondent à la réalité.')
    .replace(/Infos fiables :Selon les clients.*?reflètent vraiment la réalité./gs, 'Information fiable : Les clients confirment que les photos et la description correspondent à la réalité.');

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
    { en: "Pantelleria", fr: "Pantelleria" },
    { en: "Specchio di Venere", fr: "Miroir de Vénus" },
    { en: "Lago di Venere", fr: "Lac de Vénus" },
    { en: "Montagna Grande", fr: "Grande Montagne" },
    { en: "Punta Spadillo", fr: "Pointe Spadillo" },
    { en: "Cala Levante", fr: "Cala Levante" },
    { en: "Cala Tramontana", fr: "Cala Tramontana" },
    { en: "Arco dell'Elefante", fr: "Arc de l'Éléphant" },
    { en: "Balata dei Turchi", fr: "Balata dei Turchi" },
    { en: "Dammuso", fr: "Dammuso" },
    { en: "Dammusi", fr: "Dammusi" },
    { en: "Mediterranean", fr: "Méditerranée" },
    { en: "Sicily", fr: "Sicile" },
    { en: "Africa", fr: "Afrique" },
    { en: "Tunisia", fr: "Tunisie" },
    { en: "Sicilian Channel", fr: "Canal de Sicile" },
    { en: "hot springs", fr: "sources thermales" },
    { en: "volcanic", fr: "volcanique" },
    { en: "thermal baths", fr: "bains thermaux" },
    { en: "mud baths", fr: "bains de boue" },
    { en: "volcanic stone", fr: "pierre volcanique" },
    { en: "archaeological sites", fr: "sites archéologiques" },
    { en: "Sesi", fr: "Sesi" },
    { en: "capers", fr: "câpres" },
    { en: "Passito", fr: "Passito" },
    { en: "Zibibbo", fr: "Zibibbo" },
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
    { en: "shuttle", fr: "navette" }
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

  // Ajouter un message de bienvenue personnalisé pour Pantelleria
  cleanDesc += " Bienvenue à Pantelleria, perle volcanique entre la Sicile et l'Afrique. Cette île mystérieuse, surnommée 'la fille noire de la Méditerranée' en raison de ses roches de lave noire, offre un paysage unique façonné par les forces telluriques. Séjournez dans des 'dammusi', habitations traditionnelles en pierre de lave aux toits en dôme blanc, conçues pour résister aux vents et collecter l'eau de pluie. Découvrez le Specchio di Venere (Miroir de Vénus), un lac volcanique aux eaux turquoise riches en soufre et boues thérapeutiques, ainsi que les nombreuses sources thermales naturelles. L'île est également célèbre pour ses vignobles de Zibibbo en terrasses (patrimoine UNESCO) qui produisent le délicieux vin Passito, et pour ses câpres sauvages considérées parmi les meilleures du monde. Entre baignades dans les calanques aux eaux cristallines, randonnées dans la réserve naturelle et dégustation de produits locaux, Pantelleria offre une expérience authentique loin du tourisme de masse.";
  
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
        id: item.hotelId || (8900000 + index),
        name: item.name || `Hébergement à Pantelleria ${index + 1}`,
        type: type,
        description: translatedDescription,
        features: features,
        price: null, // Prix sur demande
        images: item.images || [],
        location: item.address?.full || 'Pantelleria, Italie'
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
    console.log('Téléchargement des données depuis Apify pour Pantelleria...');
    const apifyData = await fetchApifyData();
    console.log(`${apifyData.length} hébergements trouvés dans le dataset Apify.`);
    
    console.log('Transformation des données...');
    const pantelleriaData = transformData(apifyData);
    console.log(`Données transformées: ${pantelleriaData.appartements.length} appartements, ${pantelleriaData.villas.length} villas, ${pantelleriaData.hotels.length} hôtels.`);
    
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
    existingData.italie['pantelleria'] = pantelleriaData;
    
    console.log('Écriture des données...');
    fs.writeFileSync(DATA_PATH, JSON.stringify(existingData, null, 2), 'utf8');
    
    console.log('Importation terminée avec succès!');
  } catch (error) {
    console.error('Erreur lors de l\'importation:', error);
  }
}

main(); 