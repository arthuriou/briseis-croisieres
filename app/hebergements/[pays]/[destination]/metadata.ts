import { Metadata } from 'next';

// Types pour les données de destination
type DestinationInfo = {
  name: string;
  description: string;
};

type DestinationsByCountry = {
  [key: string]: DestinationInfo;
};

type AllDestinations = {
  [country: string]: DestinationsByCountry;
};

// Cette fonction génère les métadonnées dynamiquement en fonction de la destination
export function generateMetadata({ params }: { params: { pays: string, destination: string } }): Metadata {
  // Map des destinations pour obtenir les informations
  const destinations: AllDestinations = {
    france: {
      "ile-de-re": {
        name: "Île de Ré",
        description: "Découvrez nos hébergements de prestige sur l'Île de Ré. Appartements avec vue mer, villas avec piscine et hôtels de luxe pour des vacances d'exception."
      },
      "ile-d-oleron": {
        name: "Île d'Oléron",
        description: "Séjournez dans nos hébergements d'exception sur l'Île d'Oléron, entre océan et pinèdes. Villas, appartements et hôtels haut de gamme pour des vacances inoubliables."
      },
      "porquerolles": {
        name: "Porquerolles",
        description: "Hébergements de luxe sur l'île de Porquerolles, joyau méditerranéen. Appartements, villas et hôtels d'exception pour un séjour paradisiaque."
      },
      "la-reunion": {
        name: "La Réunion",
        description: "Hébergements de prestige sur l'île de La Réunion. Villas, appartements et hôtels d'exception entre plages tropicales et paysages volcaniques."
      },
      "guadeloupe": {
        name: "Guadeloupe",
        description: "Hébergements haut de gamme en Guadeloupe. Villas de luxe, appartements avec vue et hôtels d'exception pour un séjour caribéen inoubliable."
      },
      "martinique": {
        name: "Martinique",
        description: "Hébergements d'exception en Martinique. Villas, appartements et hôtels de luxe pour un séjour paradisiaque dans les Caraïbes."
      },
      "cote-d-azur": {
        name: "Côte d'Azur",
        description: "Hébergements de prestige sur la Côte d'Azur. Appartements avec vue mer, villas avec piscine et hôtels luxueux entre Saint-Tropez et Monaco."
      }
    },
    espagne: {
      "majorque": {
        name: "Majorque",
        description: "Hébergements de luxe à Majorque, perle des Baléares. Villas avec piscine, appartements de charme et hôtels d'exception pour un séjour méditerranéen inoubliable."
      },
      "tenerife": {
        name: "Tenerife",
        description: "Hébergements haut de gamme à Tenerife. Villas, appartements et hôtels de luxe sur la plus grande des îles Canaries."
      },
      "ibiza": {
        name: "Ibiza",
        description: "Hébergements d'exception à Ibiza. Villas avec vue, appartements de luxe et hôtels exclusifs pour profiter pleinement de la perle des Baléares."
      }
    },
    italie: {
      "sicile": {
        name: "Sicile",
        description: "Hébergements de prestige en Sicile. Villas historiques, appartements élégants et hôtels de luxe pour découvrir la plus grande île méditerranéenne."
      },
      "sardaigne": {
        name: "Sardaigne",
        description: "Hébergements d'exception en Sardaigne. Villas avec piscine, appartements de charme et hôtels luxueux au cœur de la Méditerranée."
      },
      "capri": {
        name: "Capri",
        description: "Hébergements d'exception sur l'île de Capri. Villas de luxe, appartements avec vue sur la Méditerranée et hôtels de prestige sur cette île mythique au large de Naples."
      },
      "ischia": {
        name: "Ischia",
        description: "Hébergements haut de gamme sur l'île d'Ischia. Villas, appartements et hôtels de luxe sur cette île thermale volcanique du golfe de Naples."
      },
      "elbe": {
        name: "Elbe",
        description: "Hébergements d'exception sur l'île d'Elbe. Villas, appartements et hôtels de luxe sur la plus grande île de l'archipel toscan, connue pour ses plages et son patrimoine napoléonien."
      },
      "lipari": {
        name: "Lipari / Éoliennes",
        description: "Hébergements de charme aux îles Éoliennes. Villas, appartements et hôtels d'exception sur l'archipel volcanique sicilien offrant des panoramas à couper le souffle."
      },
      "lido-de-venise": {
        name: "Lido de Venise",
        description: "Hébergements luxueux au Lido de Venise. Appartements élégants, villas historiques et hôtels de prestige sur cette île vénitienne célèbre pour sa plage et son festival de cinéma."
      },
      "procida": {
        name: "Procida",
        description: "Hébergements pittoresques à Procida. Villas, appartements et hôtels de charme sur cette petite île colorée du golfe de Naples, préservée du tourisme de masse."
      },
      "lampedusa": {
        name: "Lampedusa",
        description: "Hébergements d'exception à Lampedusa. Villas, appartements et hôtels sur la plus grande des îles Pélages, réputée pour ses plages paradisiaques et ses eaux cristallines."
      },
      "pantelleria": {
        name: "Pantelleria",
        description: "Hébergements de caractère à Pantelleria. Dammusi traditionnels, villas et boutique-hôtels sur cette île volcanique entre Sicile et Tunisie, connue pour ses thermes naturels."
      }
    }
  };

  const { pays, destination } = params;
  
  // Valeurs par défaut
  let name = "Hébergements de luxe";
  let description = "Découvrez notre sélection d'hébergements d'exception";
  
  // Tentative de récupération des informations spécifiques
  if (destinations[pays] && destinations[pays][destination]) {
    const info = destinations[pays][destination];
    name = info.name;
    description = info.description;
  }

  return {
    title: `Hébergements à ${name} | OceanLux Croisières`,
    description: description,
    openGraph: {
      title: `Hébergements de luxe à ${name} | OceanLux Croisières`,
      description: description,
      images: [
        {
          url: '/images/b6ed5cca3ba709c6074cae00910adfe1.jpg',
          width: 1200,
          height: 630,
          alt: `Hébergements à ${name}`,
        },
      ],
    },
  };
} 