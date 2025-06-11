// Script pour importer les données d'hébergement de Sardaigne depuis Apify
const fs = require('fs');
const path = require('path');
const https = require('https');

// URL de l'API Apify pour la Sardaigne
const APIFY_URL = 'https://api.apify.com/v2/datasets/WWBf1hjEvqMhUDf1c/items?token=apify_api_SSILb5pMEFd7M4ON7t0ViHjgvRPOjb0tOj6c';

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
  
  // Caractéristiques par défaut pour la Sardaigne
  if (features.length === 0) {
    features.push("WiFi gratuit");
    features.push("Vue sur la mer");
    features.push("Climatisation");
    features.push("Terrasse");
    features.push("Plages paradisiaques à proximité");
    features.push("Architecture typiquement sarde");
  }
  
  return features;
}

// Fonction pour traduire la description de l'anglais au français
function translateDescription(description) {
  if (!description) return "Magnifique hébergement en Sardaigne avec vue sur la mer et accès aux plus belles plages de l'île.";
  
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
    { en: "Sardinia", fr: "Sardaigne" },
    { en: "Costa Smeralda", fr: "Costa Smeralda" },
    { en: "Porto Cervo", fr: "Porto Cervo" },
    { en: "Cagliari", fr: "Cagliari" },
    { en: "Alghero", fr: "Alghero" },
    { en: "Olbia", fr: "Olbia" },
    { en: "Santa Teresa Gallura", fr: "Santa Teresa Gallura" },
    { en: "Arzachena", fr: "Arzachena" },
    { en: "Baia Sardinia", fr: "Baia Sardinia" },
    { en: "La Maddalena", fr: "La Maddalena" }
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

  // Ajouter un message de bienvenue personnalisé à la Sardaigne
  cleanDesc += " Bienvenue en Sardaigne, île de rêve aux eaux turquoise et aux plages parmi les plus belles de la Méditerranée. Profitez de ses criques sauvages, ses villages pittoresques et sa cuisine délicieuse.";
  
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
        id: item.hotelId || (7200000 + index),
        name: item.name || `Hébergement en Sardaigne ${index + 1}`,
        type: type,
        description: translatedDescription,
        features: features,
        price: null, // Prix sur demande
        images: item.images || [],
        location: item.address?.full || 'Sardaigne, Italie'
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
    console.log('Téléchargement des données depuis Apify pour la Sardaigne...');
    const apifyData = await fetchApifyData();
    console.log(`${apifyData.length} hébergements trouvés dans le dataset Apify.`);
    
    console.log('Transformation des données...');
    const sardaigneData = transformData(apifyData);
    console.log(`Données transformées: ${sardaigneData.appartements.length} appartements, ${sardaigneData.villas.length} villas, ${sardaigneData.hotels.length} hôtels.`);
    
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
    existingData.italie['sardaigne'] = sardaigneData;
    
    console.log('Écriture des données...');
    fs.writeFileSync(DATA_PATH, JSON.stringify(existingData, null, 2), 'utf8');
    
    console.log('Importation terminée avec succès!');
  } catch (error) {
    console.error('Erreur lors de l\'importation:', error);
  }
}

main(); 