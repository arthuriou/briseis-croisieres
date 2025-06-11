// Script pour vérifier les données importées pour la Martinique
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
    
    // Vérifier si les données pour la Martinique existent
    if (!data.france || !data.france['martinique']) {
      console.log('Aucune donnée trouvée pour la Martinique.');
      return;
    }
    
    const martiniqueData = data.france['martinique'];
    
    // Afficher le nombre d'hébergements par type
    console.log('Données pour la Martinique :');
    console.log(`- Appartements : ${martiniqueData.appartements ? martiniqueData.appartements.length : 0}`);
    console.log(`- Villas : ${martiniqueData.villas ? martiniqueData.villas.length : 0}`);
    console.log(`- Hôtels : ${martiniqueData.hotels ? martiniqueData.hotels.length : 0}`);
    console.log(`- Total : ${(martiniqueData.appartements?.length || 0) + (martiniqueData.villas?.length || 0) + (martiniqueData.hotels?.length || 0)}`);
    
    // Afficher quelques exemples d'hébergements
    if (martiniqueData.appartements && martiniqueData.appartements.length > 0) {
      console.log('\n=== EXEMPLE D\'APPARTEMENT ===');
      const appartement = martiniqueData.appartements[0];
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
    
    if (martiniqueData.villas && martiniqueData.villas.length > 0) {
      console.log('\n=== EXEMPLE DE VILLA ===');
      const villa = martiniqueData.villas[0];
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
    
    if (martiniqueData.hotels && martiniqueData.hotels.length > 0) {
      console.log('\n=== EXEMPLE D\'HÔTEL ===');
      const hotel = martiniqueData.hotels[0];
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
    martiniqueData.appartements?.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name} (${item.price !== null ? item.price + '€/nuit' : 'Prix sur demande'}, ${item.images?.length || 0} images)`);
    });
    
    console.log('\nVILLAS :');
    martiniqueData.villas?.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name} (${item.price !== null ? item.price + '€/nuit' : 'Prix sur demande'}, ${item.images?.length || 0} images)`);
    });
    
    console.log('\nHÔTELS :');
    martiniqueData.hotels?.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name} (${item.price !== null ? item.price + '€/nuit' : 'Prix sur demande'}, ${item.images?.length || 0} images)`);
    });
    
  } catch (error) {
    console.error('Erreur lors de la vérification des données :', error);
  }
}

main(); 