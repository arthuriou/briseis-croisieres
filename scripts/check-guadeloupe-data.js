// Script pour vérifier les données importées pour la Guadeloupe
const fs = require('fs');
const path = require('path');

// Chemin vers le fichier de données d'hébergements
const DATA_PATH = path.join(__dirname, '../public/data/hebergements.json');

// Fonction principale
function main() {
  try {
    console.log('Lecture du fichier de données...');
    const dataRaw = fs.readFileSync(DATA_PATH, 'utf8');
    const data = JSON.parse(dataRaw);
    
    // Vérifier si les données pour la Guadeloupe existent
    if (!data.france || !data.france['guadeloupe']) {
      console.log('Aucune donnée trouvée pour la Guadeloupe.');
      return;
    }
    
    const guadeloupeData = data.france['guadeloupe'];
    
    // Afficher le nombre d'hébergements par type
    console.log('Données pour la Guadeloupe :');
    console.log(`- Appartements : ${guadeloupeData.appartements ? guadeloupeData.appartements.length : 0}`);
    console.log(`- Villas : ${guadeloupeData.villas ? guadeloupeData.villas.length : 0}`);
    console.log(`- Hôtels : ${guadeloupeData.hotels ? guadeloupeData.hotels.length : 0}`);
    
    // Afficher quelques exemples d'hébergements
    if (guadeloupeData.appartements && guadeloupeData.appartements.length > 0) {
      console.log('\nExemple d\'appartement :');
      const appartement = guadeloupeData.appartements[0];
      console.log(`- Nom : ${appartement.name}`);
      console.log(`- Description : ${appartement.description.substring(0, 100)}...`);
      console.log(`- Caractéristiques : ${appartement.features.join(', ')}`);
      console.log(`- Nombre d'images : ${appartement.images ? appartement.images.length : 0}`);
    }
    
    if (guadeloupeData.villas && guadeloupeData.villas.length > 0) {
      console.log('\nExemple de villa :');
      const villa = guadeloupeData.villas[0];
      console.log(`- Nom : ${villa.name}`);
      console.log(`- Description : ${villa.description.substring(0, 100)}...`);
      console.log(`- Caractéristiques : ${villa.features.join(', ')}`);
      console.log(`- Nombre d'images : ${villa.images ? villa.images.length : 0}`);
    }
    
    if (guadeloupeData.hotels && guadeloupeData.hotels.length > 0) {
      console.log('\nExemple d\'hôtel :');
      const hotel = guadeloupeData.hotels[0];
      console.log(`- Nom : ${hotel.name}`);
      console.log(`- Description : ${hotel.description.substring(0, 100)}...`);
      console.log(`- Caractéristiques : ${hotel.features.join(', ')}`);
      console.log(`- Nombre d'images : ${hotel.images ? hotel.images.length : 0}`);
    }
    
  } catch (error) {
    console.error('Erreur lors de la vérification des données :', error);
  }
}

main(); 