// Script pour mettre à jour les prix des hébergements de la Martinique
const fs = require('fs');
const path = require('path');

// Chemin vers le fichier de données d'hébergements
const DATA_PATH = path.join(__dirname, '../public/data/hebergements.json');

// Fonction pour générer un prix d'hébergement réaliste
function generatePrice(hebergement) {
  const type = hebergement.type;
  
  // Prix de base selon le type d'hébergement
  let basePrice;
  if (type === 'appartements') {
    basePrice = 85; // Prix de base pour les appartements en Martinique
  } else if (type === 'villas') {
    basePrice = 180; // Prix de base pour les villas en Martinique
  } else {
    basePrice = 130; // Prix de base pour les hôtels en Martinique
  }
  
  // Calculer le prix en fonction de certaines caractéristiques
  let priceMultiplier = 1.0;
  
  // Si la description contient certains mots-clés, augmenter le prix
  const descriptionLower = hebergement.description.toLowerCase();
  if (descriptionLower.includes('luxe') || descriptionLower.includes('luxury')) priceMultiplier += 0.4;
  if (descriptionLower.includes('vue mer') || descriptionLower.includes('sea view')) priceMultiplier += 0.3;
  if (descriptionLower.includes('piscine') || descriptionLower.includes('pool')) priceMultiplier += 0.25;
  if (descriptionLower.includes('jardin') || descriptionLower.includes('garden')) priceMultiplier += 0.15;
  if (descriptionLower.includes('plage') || descriptionLower.includes('beach')) priceMultiplier += 0.2;
  
  // Si certaines caractéristiques sont présentes, augmenter le prix
  const features = hebergement.features.join(' ').toLowerCase();
  if (features.includes('climatisation') || features.includes('air conditioning')) priceMultiplier += 0.1;
  if (features.includes('wifi')) priceMultiplier += 0.05;
  if (features.includes('terrasse') || features.includes('balcon')) priceMultiplier += 0.15;
  if (features.includes('parking')) priceMultiplier += 0.1;
  
  // Ajuster en fonction du nombre d'images (signe de qualité)
  if (hebergement.images && hebergement.images.length > 15) priceMultiplier += 0.15;
  else if (hebergement.images && hebergement.images.length > 10) priceMultiplier += 0.1;
  
  // Ajouter une variation aléatoire de ±10%
  const randomFactor = 0.9 + (Math.random() * 0.2);
  
  // Calculer le prix final
  let price = Math.round(basePrice * priceMultiplier * randomFactor);
  
  // S'assurer que le prix est dans une fourchette raisonnable pour le type d'hébergement
  if (type === 'appartements' && price < 65) price = 65;
  if (type === 'villas' && price < 150) price = 150;
  if (type === 'hotels' && price < 110) price = 110;
  
  return price;
}

// Fonction principale
async function main() {
  try {
    console.log('Lecture du fichier de données...');
    const dataRaw = fs.readFileSync(DATA_PATH, 'utf8');
    const data = JSON.parse(dataRaw);
    
    // Vérifier si les données pour la Martinique existent
    if (!data.france || !data.france['martinique']) {
      console.log('Aucune donnée trouvée pour la Martinique.');
      return;
    }
    
    const martiniqueData = data.france['martinique'];
    let updatedCount = 0;
    
    // Mettre à jour les prix des appartements
    if (martiniqueData.appartements) {
      martiniqueData.appartements.forEach(apt => {
        if (apt.price === null) {
          apt.price = generatePrice(apt);
          updatedCount++;
        }
      });
    }
    
    // Mettre à jour les prix des villas
    if (martiniqueData.villas) {
      martiniqueData.villas.forEach(villa => {
        if (villa.price === null) {
          villa.price = generatePrice(villa);
          updatedCount++;
        }
      });
    }
    
    // Mettre à jour les prix des hôtels
    if (martiniqueData.hotels) {
      martiniqueData.hotels.forEach(hotel => {
        if (hotel.price === null) {
          hotel.price = generatePrice(hotel);
          updatedCount++;
        }
      });
    }
    
    console.log(`${updatedCount} prix mis à jour.`);
    
    console.log('Écriture des données...');
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
    
    console.log('Mise à jour terminée avec succès!');
  } catch (error) {
    console.error('Erreur lors de la mise à jour des prix:', error);
  }
}

main(); 