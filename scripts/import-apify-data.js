const fs = require('fs');
const path = require('path');
const https = require('https');

// URL de l'API Apify pour l'Île de Ré
const apifyUrl = 'https://api.apify.com/v2/datasets/Hy2QzGCF7KYrmZlK9/items?token=apify_api_SSILb5pMEFd7M4ON7t0ViHjgvRPOjb0tOj6c';

// Fonction pour déterminer le type d'hébergement
function determinerTypeHebergement(item) {
  const type = item.type ? item.type.toLowerCase() : '';
  
  if (type.includes('hotel') || type.includes('hôtel')) {
    return 'hotels';
  } else if (type.includes('villa') || type.includes('house') || type.includes('maison')) {
    return 'villas';
  } else {
    return 'appartements';
  }
}

// Fonction pour extraire les caractéristiques depuis les facilities
function extraireCaracteristiques(item) {
  const features = [];
  
  // Si nous avons des facilities groupées
  if (item.facilitiesGroups && Array.isArray(item.facilitiesGroups)) {
    item.facilitiesGroups.forEach(group => {
      if (group.facilities && Array.isArray(group.facilities)) {
        group.facilities.forEach(facility => {
          if (facility.name) {
            features.push(facility.name);
          }
        });
      }
    });
  }
  
  // Ne pas limiter le nombre de caractéristiques
  return features;
}

// Fonction pour nettoyer et transformer les descriptions
function transformerDescription(description) {
  if (!description) return 'Aucune description disponible';
  
  // Supprimer la partie "Genius discount" au début
  let cleanDesc = description.replace(/You might be eligible for a Genius discount.*?available deals\.\s*/s, '');
  
  // Supprimer la note de copyright à la fin
  cleanDesc = cleanDesc.replace(/Distance in property description is calculated using © OpenStreetMap/g, '');
  
  // Extraire les sections pertinentes (après "About this property" ou "About this")
  const aboutMatch = cleanDesc.match(/About this(?:\s*property)?(.+)/s);
  if (aboutMatch && aboutMatch[1]) {
    cleanDesc = aboutMatch[1].trim();
  }
  
  // Traduire les termes anglais courants vers le français
  const traductions = {
    'Beachfront Location': 'Emplacement en bord de mer',
    'Comfortable Accommodations': 'Hébergements confortables',
    'Comfortable Amenities': 'Équipements confortables',
    'Comfortable Living Spaces': 'Espaces de vie confortables',
    'Dining Experience': 'Expérience gastronomique',
    'Leisure Activities': 'Activités de loisirs',
    'Local Attractions': 'Attractions locales',
    'Nearby Attractions': 'Attractions à proximité',
    'Prime Location': 'Emplacement privilégié',
    'Convenient Facilities': 'Installations pratiques',
    'Convenient Services': 'Services pratiques',
    'Elegant Accommodation': 'Hébergement élégant',
    'Spacious Accommodation': 'Hébergement spacieux',
    'Historic Charm': 'Charme historique',
    'Modern Amenities': 'Équipements modernes',
    'Guest Satisfaction': 'Satisfaction des clients',
    'Reliable info': 'Information fiable',
    'Delightful Breakfast': 'Petit-déjeuner délicieux',
    'Guests say': 'Les clients disent',
    'the description and photos for this property are very accurate': 'que la description et les photos de cette propriété sont très précises',
    'the description and photos for this property are accurate': 'que la description et les photos de cette propriété sont précises',
    'Guests enjoy': 'Les clients apprécient',
    'Guests can': 'Les clients peuvent',
    'features': 'comprend',
    'Additional amenities': 'Équipements supplémentaires',
    'Free WiFi': 'WiFi gratuit',
    'free WiFi': 'WiFi gratuit',
    'private bathroom': 'salle de bain privée',
    'Free parking': 'Parking gratuit',
    'terrace': 'terrasse',
    'garden': 'jardin',
    'swimming pool': 'piscine',
    'kitchen': 'cuisine',
    'kitchenette': 'kitchenette',
    'air-conditioning': 'climatisation',
    'parking': 'stationnement',
    'airport': 'aéroport',
    'Highly rated': 'Très bien noté',
    'is located': 'est situé',
    'offers': 'propose',
    'include': 'inclut',
    'includes': 'inclut',
    'available': 'disponible',
    'property': 'propriété',
    'minutes': 'minutes',
    'room': 'chambre',
    'rooms': 'chambres'
  };

  // Remplacer les termes anglais par leur équivalent français
  Object.entries(traductions).forEach(([anglais, francais]) => {
    cleanDesc = cleanDesc.replace(new RegExp(anglais, 'gi'), francais);
  });

  // Formater en paragraphes lisibles
  cleanDesc = cleanDesc
    .replace(/\n+/g, '\n')
    .split('\n')
    .filter(line => line.trim() !== '')
    .map(line => line.trim())
    .join('\n\n');
  
  return cleanDesc;
}

// Fonction pour récupérer les données de l'API Apify
function fetchApifyData() {
  return new Promise((resolve, reject) => {
    https.get(apifyUrl, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        try {
          const parsedData = JSON.parse(data);
          resolve(parsedData);
        } catch (error) {
          reject(error);
        }
      });
      
    }).on('error', (error) => {
      reject(error);
    });
  });
}

// Fonction pour transformer toutes les descriptions existantes
function transformerToutesDescriptions() {
  try {
    console.log('Transformation de toutes les descriptions existantes...');
    
    // Charger le fichier JSON existant
    const hebergementsPath = path.join(__dirname, '..', 'public', 'data', 'hebergements.json');
    const hebergementsData = JSON.parse(fs.readFileSync(hebergementsPath, 'utf8'));
    
    let totalTransformed = 0;
    
    // Parcourir tous les pays
    Object.keys(hebergementsData).forEach(pays => {
      // Parcourir toutes les destinations
      Object.keys(hebergementsData[pays]).forEach(destination => {
        // Parcourir tous les types d'hébergements
        ['appartements', 'villas', 'hotels'].forEach(type => {
          const hebergements = hebergementsData[pays][destination][type];
          if (Array.isArray(hebergements)) {
            // Transformer chaque description
            hebergements.forEach(hebergement => {
              if (hebergement.description) {
                hebergement.description = transformerDescription(hebergement.description);
                totalTransformed++;
              }
            });
          }
        });
      });
    });
    
    // Enregistrer le fichier modifié
    fs.writeFileSync(hebergementsPath, JSON.stringify(hebergementsData, null, 2), 'utf8');
    
    console.log(`Transformation terminée avec succès ! ${totalTransformed} descriptions transformées.`);
  } catch (error) {
    console.error('Erreur lors de la transformation des descriptions:', error);
  }
}

// Fonction principale d'importation
async function importerDonnees() {
  try {
    console.log('Récupération des données depuis Apify pour l\'Île de Ré...');
    const apifyData = await fetchApifyData();
    
    console.log(`${apifyData.length} hébergements récupérés`);
    
    // Charger le fichier JSON existant
    const hebergementsPath = path.join(__dirname, '..', 'public', 'data', 'hebergements.json');
    const hebergementsData = JSON.parse(fs.readFileSync(hebergementsPath, 'utf8'));
    
    // Changement de destination: maintenant l'Île de Ré
    const destination = 'ile-de-re';
    const pays = 'france';
    
    // Organiser les hébergements par type
    const appartements = [];
    const villas = [];
    const hotels = [];
    
    apifyData.forEach((item, index) => {
      // Créer un objet au format attendu par notre application
      const hebergement = {
        id: item.hotelId || `apify-${index}`,
        name: item.name || 'Hébergement sans nom',
        type: determinerTypeHebergement(item),
        description: transformerDescription(item.description),
        features: extraireCaracteristiques(item),
        price: item.price || null,
        images: item.images || [],
        location: item.address?.full || 'Île de Ré, France'
      };
      
      // Ajouter au bon tableau selon le type
      if (hebergement.type === 'hotels') {
        hotels.push(hebergement);
      } else if (hebergement.type === 'villas') {
        villas.push(hebergement);
      } else {
        appartements.push(hebergement);
      }
    });
    
    // Ne pas limiter le nombre d'hébergements
    const appartementsFinal = appartements;
    const villasFinal = villas;
    const hotelsFinal = hotels;
    
    // Mettre à jour le fichier JSON
    hebergementsData[pays][destination] = {
      appartements: appartementsFinal,
      villas: villasFinal,
      hotels: hotelsFinal
    };
    
    // Enregistrer le fichier
    fs.writeFileSync(hebergementsPath, JSON.stringify(hebergementsData, null, 2), 'utf8');
    
    console.log('Import terminé avec succès !');
    console.log(`Appartements: ${appartementsFinal.length}`);
    console.log(`Villas: ${villasFinal.length}`);
    console.log(`Hôtels: ${hotelsFinal.length}`);
    
  } catch (error) {
    console.error('Erreur lors de l\'importation des données:', error);
  }
}

// Déterminer quelle fonction exécuter
const args = process.argv.slice(2);
if (args.includes('--transform-all')) {
  // Transformer toutes les descriptions existantes
  transformerToutesDescriptions();
} else {
  // Importer de nouvelles données (comportement par défaut)
  importerDonnees();
} 