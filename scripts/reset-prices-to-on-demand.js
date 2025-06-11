// Script pour réinitialiser les prix des hébergements à null (prix sur demande)
const fs = require('fs');
const path = require('path');

// Chemin vers le fichier de données d'hébergements
const DATA_PATH = path.join(__dirname, '../public/data/hebergements.json');

// Fonction principale
async function main() {
  try {
    console.log('Lecture du fichier de données...');
    const dataRaw = fs.readFileSync(DATA_PATH, 'utf8');
    const data = JSON.parse(dataRaw);
    
    let totalUpdated = 0;
    
    // Traiter toutes les destinations en France
    if (data.france) {
      // Martinique
      if (data.france['martinique']) {
        const martiniqueData = data.france['martinique'];
        totalUpdated += resetPrices(martiniqueData);
        console.log(`Martinique: prix réinitialisés`);
      }
      
      // Côte d'Azur
      if (data.france['cote-d-azur']) {
        const coteAzurData = data.france['cote-d-azur'];
        totalUpdated += resetPrices(coteAzurData);
        console.log(`Côte d'Azur: prix réinitialisés`);
      }
    }
    
    // Traiter toutes les destinations en Espagne
    if (data.espagne) {
      // Majorque
      if (data.espagne['majorque']) {
        const majorqueData = data.espagne['majorque'];
        totalUpdated += resetPrices(majorqueData);
        console.log(`Majorque: prix réinitialisés`);
      }
      
      // Tenerife
      if (data.espagne['tenerife']) {
        const tenerifeData = data.espagne['tenerife'];
        totalUpdated += resetPrices(tenerifeData);
        console.log(`Tenerife: prix réinitialisés`);
      }
      
      // Ibiza
      if (data.espagne['ibiza']) {
        const ibizaData = data.espagne['ibiza'];
        totalUpdated += resetPrices(ibizaData);
        console.log(`Ibiza: prix réinitialisés`);
      }
      
      // Gran Canaria
      if (data.espagne['gran-canaria']) {
        const granCanariaData = data.espagne['gran-canaria'];
        totalUpdated += resetPrices(granCanariaData);
        console.log(`Gran Canaria: prix réinitialisés`);
      }
      
      // Lanzarote
      if (data.espagne['lanzarote']) {
        const lanzaroteData = data.espagne['lanzarote'];
        totalUpdated += resetPrices(lanzaroteData);
        console.log(`Lanzarote: prix réinitialisés`);
      }
    }
    
    console.log(`Total: ${totalUpdated} prix réinitialisés.`);
    
    console.log('Écriture des données...');
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
    
    console.log('Mise à jour terminée avec succès!');
  } catch (error) {
    console.error('Erreur lors de la mise à jour des prix:', error);
  }
}

// Fonction pour réinitialiser les prix dans une destination
function resetPrices(destinationData) {
  let count = 0;
  
  // Appartements
  if (destinationData.appartements) {
    destinationData.appartements.forEach(item => {
      if (item.price !== null) {
        item.price = null;
        count++;
      }
    });
  }
  
  // Villas
  if (destinationData.villas) {
    destinationData.villas.forEach(item => {
      if (item.price !== null) {
        item.price = null;
        count++;
      }
    });
  }
  
  // Hôtels
  if (destinationData.hotels) {
    destinationData.hotels.forEach(item => {
      if (item.price !== null) {
        item.price = null;
        count++;
      }
    });
  }
  
  return count;
}

main(); 