// Script pour vérifier les données importées pour Ischia
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
    
    // Vérifier si les données pour Ischia existent
    if (!data.italie || !data.italie['ischia']) {
      console.log('Aucune donnée trouvée pour Ischia.');
      return;
    }
    
    const ischiaData = data.italie['ischia'];
    
    // Afficher le nombre d'hébergements par type
    console.log('Données pour Ischia :');
    console.log(`- Appartements : ${ischiaData.appartements ? ischiaData.appartements.length : 0}`);
    console.log(`- Villas : ${ischiaData.villas ? ischiaData.villas.length : 0}`);
    console.log(`- Hôtels : ${ischiaData.hotels ? ischiaData.hotels.length : 0}`);
    console.log(`- Total : ${(ischiaData.appartements?.length || 0) + (ischiaData.villas?.length || 0) + (ischiaData.hotels?.length || 0)}`);
    
    // Afficher quelques exemples d'hébergements
    if (ischiaData.appartements && ischiaData.appartements.length > 0) {
      console.log('\n=== EXEMPLE D\'APPARTEMENT ===');
      const appartement = ischiaData.appartements[0];
      console.log(`- ID : ${appartement.id}`);
      console.log(`- Nom : ${appartement.name}`);
      console.log(`- Description : ${appartement.description.substring(0, 200)}...`);
      console.log(`- Caractéristiques : ${appartement.features.join(', ')}`);
      console.log(`- Localisation : ${appartement.location}`);
      console.log(`- Prix : ${appartement.price !== null ? appartement.price + '€/nuit' : 'Prix sur demande'}`);
      console.log(`- Nombre d'images : ${appartement.images ? appartement.images.length : 0}`);
      if (appartement.images && appartement.images.length > 0) {
        console.log(`- Première image : ${appartement.images[0]}`);
      }
    }
    
    if (ischiaData.villas && ischiaData.villas.length > 0) {
      console.log('\n=== EXEMPLE DE VILLA ===');
      const villa = ischiaData.villas[0];
      console.log(`- ID : ${villa.id}`);
      console.log(`- Nom : ${villa.name}`);
      console.log(`- Description : ${villa.description.substring(0, 200)}...`);
      console.log(`- Caractéristiques : ${villa.features.join(', ')}`);
      console.log(`- Localisation : ${villa.location}`);
      console.log(`- Prix : ${villa.price !== null ? villa.price + '€/nuit' : 'Prix sur demande'}`);
      console.log(`- Nombre d'images : ${villa.images ? villa.images.length : 0}`);
      if (villa.images && villa.images.length > 0) {
        console.log(`- Première image : ${villa.images[0]}`);
      }
    }
    
    if (ischiaData.hotels && ischiaData.hotels.length > 0) {
      console.log('\n=== EXEMPLE D\'HÔTEL ===');
      const hotel = ischiaData.hotels[0];
      console.log(`- ID : ${hotel.id}`);
      console.log(`- Nom : ${hotel.name}`);
      console.log(`- Description : ${hotel.description.substring(0, 200)}...`);
      console.log(`- Caractéristiques : ${hotel.features.join(', ')}`);
      console.log(`- Localisation : ${hotel.location}`);
      console.log(`- Prix : ${hotel.price !== null ? hotel.price + '€/nuit' : 'Prix sur demande'}`);
      console.log(`- Nombre d'images : ${hotel.images ? hotel.images.length : 0}`);
      if (hotel.images && hotel.images.length > 0) {
        console.log(`- Première image : ${hotel.images[0]}`);
      }
    }
    
    // Afficher la liste complète des hébergements
    console.log('\n=== LISTE COMPLÈTE DES HÉBERGEMENTS ===');
    
    console.log('\nAPPARTEMENTS :');
    ischiaData.appartements?.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name} (${item.price !== null ? item.price + '€/nuit' : 'Prix sur demande'}, ${item.images?.length || 0} images)`);
    });
    
    console.log('\nVILLAS :');
    ischiaData.villas?.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name} (${item.price !== null ? item.price + '€/nuit' : 'Prix sur demande'}, ${item.images?.length || 0} images)`);
    });
    
    console.log('\nHÔTELS :');
    ischiaData.hotels?.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name} (${item.price !== null ? item.price + '€/nuit' : 'Prix sur demande'}, ${item.images?.length || 0} images)`);
    });
    
  } catch (error) {
    console.error('Erreur lors de la vérification des données :', error);
  }
}

main(); 