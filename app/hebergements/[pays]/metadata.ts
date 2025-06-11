import { Metadata } from 'next';

// Cette fonction génère les métadonnées dynamiquement en fonction du pays
export function generateMetadata({ params }: { params: { pays: string } }): Metadata {
  // Map des pays pour obtenir les informations
  const paysInfo: Record<string, {name: string, description: string}> = {
    france: {
      name: "France",
      description: "Découvrez nos hébergements de luxe en France. Appartements, villas et hôtels sur les plus belles îles et destinations françaises.",
    },
    espagne: {
      name: "Espagne",
      description: "Découvrez nos hébergements d'exception en Espagne. Séjours de prestige sur les plus belles îles des Baléares et des Canaries.",
    },
    italie: {
      name: "Italie",
      description: "Découvrez nos hébergements de luxe en Italie. Séjours d'exception sur les plus belles îles italiennes de la Méditerranée.",
    },
  };

  const pays = params.pays;
  const info = paysInfo[pays] || { 
    name: "Hébergements", 
    description: "Découvrez notre sélection d'hébergements de luxe"
  };

  return {
    title: `Hébergements de luxe en ${info.name} | OceanLux Croisières`,
    description: info.description,
    openGraph: {
      title: `Hébergements de luxe en ${info.name} | OceanLux Croisières`,
      description: info.description,
      images: [
        {
          url: '/images/b6ed5cca3ba709c6074cae00910adfe1.jpg',
          width: 1200,
          height: 630,
          alt: `Hébergements de luxe en ${info.name}`,
        },
      ],
    },
  };
} 