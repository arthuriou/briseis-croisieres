import { getPlaiceholder } from 'plaiceholder';
import fs from 'fs/promises';
import path from 'path';

export async function getImageBlurData(src: string) {
  try {
    let buffer;
    
    // Vérifie si l'image est locale ou distante
    if (src.startsWith('http')) {
      // Image distante
      const res = await fetch(src);
      buffer = Buffer.from(await res.arrayBuffer());
    } else {
      // Image locale
      buffer = await fs.readFile(path.join(process.cwd(), 'public', src));
    }
    
    // Options de basse qualité pour le placeholder seulement, pas pour l'image finale
    const { base64, color } = await getPlaiceholder(buffer, {
      size: 10, // Très petite taille pour le placeholder uniquement
    });
    
    return {
      base64,
      color: color.hex
    };
  } catch (err) {
    console.error("Erreur lors de la génération des données de placeholder:", err);
    return {
      base64: '',
      color: '#164C6A' // Couleur primaire par défaut
    };
  }
} 