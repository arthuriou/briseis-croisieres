// Script pour importer les données d'hébergement de la Guadeloupe depuis Apify
const fs = require('fs');
const path = require('path');
const https = require('https');

// URL de l'API Apify pour la Guadeloupe
const APIFY_URL = 'https://api.apify.com/v2/datasets/8daoizoiqOvup5GBI/items?token=apify_api_SSILb5pMEFd7M4ON7t0ViHjgvRPOjb0tOj6c';

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

// Fonction pour extraire les caractéristiques de l'hébergement de manière plus robuste
function extractFeatures(item) {
  const features = [];
  
  // Extraire depuis facilitiesGroups si disponible
  if (item.facilitiesGroups && Array.isArray(item.facilitiesGroups)) {
    item.facilitiesGroups.forEach(group => {
      if (group.facilities && Array.isArray(group.facilities)) {
        group.facilities.forEach(facility => {
          if (facility.name) {
            // Éviter les doublons
            if (!features.includes(facility.name)) {
              features.push(facility.name);
            }
          }
        });
      }
    });
  }
  
  // Extractions directes de caractéristiques communes si pas trouvées
  const commonFeatures = [
    { en: "Free WiFi", fr: "WiFi gratuit" },
    { en: "Non-smoking", fr: "Non-fumeur" },
    { en: "Air conditioning", fr: "Climatisation" },
    { en: "Terrace", fr: "Terrasse" },
    { en: "Garden", fr: "Jardin" },
    { en: "Kitchen", fr: "Cuisine équipée" },
    { en: "Washing machine", fr: "Machine à laver" },
    { en: "Dishwasher", fr: "Lave-vaisselle" },
    { en: "Balcony", fr: "Balcon" },
    { en: "Sea view", fr: "Vue sur mer" },
    { en: "Free parking", fr: "Parking gratuit" },
    { en: "Swimming pool", fr: "Piscine" },
    { en: "Hot tub", fr: "Jacuzzi" },
    { en: "Beach access", fr: "Accès plage" },
    { en: "Saltwater pool", fr: "Piscine d'eau salée" }
  ];
  
  // Rechercher des mots-clés dans la description pour extraire des caractéristiques
  if (item.description) {
    commonFeatures.forEach(feature => {
      // Si la description contient la caractéristique en anglais et qu'elle n'est pas déjà présente
      if (
        item.description.toLowerCase().includes(feature.en.toLowerCase()) && 
        !features.includes(feature.fr) &&
        !features.includes(feature.en)
      ) {
        features.push(feature.fr);
      }
    });
  }
  
  // Si aucune caractéristique n'a été trouvée, ajouter des caractéristiques par défaut
  if (features.length === 0) {
    features.push("WiFi gratuit");
    features.push("Hébergement de qualité");
    features.push("Climatisation");
    features.push("Cadre tropical");
    features.push("Proche des plages");
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
    { en: "Guests can relax", fr: "Les clients peuvent se détendre" },
    { en: "outdoor seating area", fr: "espace extérieur" },
    { en: "garden views", fr: "vue sur le jardin" },
    { en: "The holiday home features", fr: "Cette résidence dispose de" },
    { en: "The apartment features", fr: "Cet appartement dispose de" },
    { en: "The villa features", fr: "Cette villa dispose de" },
    { en: "The hotel features", fr: "Cet hôtel dispose de" },
    { en: "bedrooms", fr: "chambres" },
    { en: "bathrooms", fr: "salles de bain" },
    { en: "living room", fr: "salon" },
    { en: "fully equipped kitchen", fr: "cuisine entièrement équipée" },
    { en: "Amenities include", fr: "Les commodités comprennent" },
    { en: "washing machine", fr: "lave-linge" },
    { en: "dishwasher", fr: "lave-vaisselle" },
    { en: "private entrance", fr: "entrée privée" },
    { en: "Free WiFi is available", fr: "WiFi gratuit disponible" },
    { en: "Additional facilities", fr: "Équipements supplémentaires" },
    { en: "bicycle parking", fr: "parking à vélos" },
    { en: "barbecue facilities", fr: "équipements pour barbecue" },
    { en: "outdoor dining areas", fr: "espaces de repas en plein air" },
    { en: "Nearby Attractions", fr: "Attractions à proximité" },
    { en: "away", fr: "de distance" },
    { en: "providing easy access", fr: "offrant un accès facile" },
    { en: "Distance in property description is calculated using", fr: "La distance indiquée est calculée à l'aide de" },
    { en: "local activities", fr: "activités locales" },
    { en: "Swimming pool", fr: "Piscine" },
    { en: "saltwater swimming pool", fr: "piscine d'eau salée" },
    { en: "spacious living room", fr: "spacieux salon" },
    { en: "hot tub", fr: "jacuzzi" },
    { en: "stunning views", fr: "vue imprenable" },
    { en: "Modern Amenities", fr: "Équipements modernes" },
    { en: "indoor swimming pool", fr: "piscine intérieure" },
    { en: "lush garden", fr: "jardin luxuriant" },
    { en: "Elegant Accommodation", fr: "Hébergement élégant" },
    { en: "Convenient Location", fr: "Emplacement pratique" },
    { en: "electric vehicle charging station", fr: "borne de recharge pour véhicules électriques" }
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

  // Ajouter un message de bienvenue personnalisé à la Guadeloupe
  cleanDesc += "\n\nBienvenue en Guadeloupe, archipel aux mille facettes. Cet hébergement vous permettra de profiter pleinement des merveilles de l'île : plages de sable blanc bordées de cocotiers, eaux turquoise, forêt tropicale luxuriante et ambiance créole chaleureuse. Découvrez l'art de vivre antillais dans un cadre paradisiaque.";
  
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
    
    // Extraire le prix s'il existe
    let price = null;
    if (item.price) {
      price = parseFloat(item.price.replace(/[^\d.,]/g, '').replace(',', '.'));
    }
    
    const transformedItem = {
      id: item.hotelId || index + 3000000, // Utiliser l'ID de l'hôtel ou générer un ID unique
      name: item.name,
      type: type,
      description: translatedDescription,
      features: features,
      price: price,
      images: item.images || [],
      location: item.address?.full || 'Guadeloupe, France'
    };
    
    transformedData[type].push(transformedItem);
  });
  
  return transformedData;
}

// Fonction principale
async function main() {
  try {
    console.log('Téléchargement des données depuis Apify pour la Guadeloupe...');
    const apifyData = await fetchApifyData();
    console.log(`${apifyData.length} hébergements trouvés dans le dataset Apify.`);
    
    console.log('Transformation des données...');
    const guadeloupeData = transformData(apifyData);
    console.log(`Données transformées: ${guadeloupeData.appartements.length} appartements, ${guadeloupeData.villas.length} villas, ${guadeloupeData.hotels.length} hôtels.`);
    
    console.log('Lecture du fichier de données existant...');
    const existingDataRaw = fs.readFileSync(DATA_PATH, 'utf8');
    const existingData = JSON.parse(existingDataRaw);
    
    // S'assurer que la structure existe
    if (!existingData.france) {
      existingData.france = {};
    }
    if (!existingData.france['guadeloupe']) {
      existingData.france['guadeloupe'] = {};
    }
    
    // Ajouter les données
    existingData.france['guadeloupe'] = guadeloupeData;
    
    console.log('Écriture des données...');
    fs.writeFileSync(DATA_PATH, JSON.stringify(existingData, null, 2), 'utf8');
    
    console.log('Importation terminée avec succès!');
  } catch (error) {
    console.error('Erreur lors de l\'importation:', error);
  }
}

main(); 