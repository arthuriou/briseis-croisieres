"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

// Composant pour gérer les images avec fallback
interface OptimizedImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  suppressHydrationWarning?: boolean;
  unoptimized?: boolean;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({ src, alt, ...props }) => {
  const [imgSrc, setImgSrc] = useState(src);
  
  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={() => {
        setImgSrc("/images/b6ed5cca3ba709c6074cae00910adfe1.jpg"); // Image par défaut en cas d'erreur
      }}
      sizes={props.sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
      suppressHydrationWarning
    />
  );
};

// Structure des destinations pour la navigation
type DestinationDetail = {
  name: string;
  bgImage: string;
  description: string;
};

type PlacesMap = {
  [key: string]: DestinationDetail;
};

type PaysInfo = {
  name: string;
  bgImage: string;
  places: PlacesMap;
};

type DestinationsMap = {
  [key: string]: PaysInfo;
};

const destinations: DestinationsMap = {
  france: {
    name: "France",
    bgImage: "/images/b6ed5cca3ba709c6074cae00910adfe1.jpg",
    places: {
      "ile-de-re": {
        name: "Île de Ré",
        bgImage: "/images/b6ed5cca3ba709c6074cae00910adfe1.jpg",
        description: "Découvrez nos hébergements de prestige sur l'Île de Ré, une destination de charme sur la côte Atlantique française. Entre plages de sable fin, villages pittoresques aux maisons blanches et paysages naturels préservés, l'Île de Ré vous promet un séjour inoubliable."
      },
      "ile-d-oleron": {
        name: "Île d'Oléron",
        bgImage: "/images/7c8c4693bfee794fb7f13009a4a717f2.jpg",
        description: "Découvrez nos hébergements d'exception sur l'Île d'Oléron, la plus grande des îles françaises de l'Atlantique. Entre forêts de pins, plages sauvages et villages ostréicoles, profitez d'un séjour de luxe dans un cadre naturel préservé."
      },
      "porquerolles": {
        name: "Porquerolles (îles d'Hyères)",
        bgImage: "/images/259c2e5b890f7eb1cb5c35d27fdb0989.jpg",
        description: "Découvrez nos hébergements d'exception sur l'île de Porquerolles, joyau méditerranéen du Parc national de Port-Cros. Laissez-vous séduire par ses plages paradisiaques, ses eaux turquoise et ses sentiers sauvages préservés."
      },
      "la-reunion": {
        name: "La Réunion",
        bgImage: "/images/8e8f043913761de1264b1e20bd283847.jpg",
        description: "Découvrez nos hébergements d'exception sur l'île intense de La Réunion, avec ses paysages volcaniques spectaculaires, ses cirques majestueux et ses plages tropicales. Profitez d'un séjour de luxe dans un cadre naturel exceptionnel classé au patrimoine mondial."
      },
      "guadeloupe": {
        name: "La Guadeloupe",
        bgImage: "/images/f678d313d8118594a1879b1c12ecb717.jpg",
        description: "Découvrez nos hébergements d'exception en Guadeloupe, archipel tropical aux multiples facettes. Entre plages de sable blanc, forêt tropicale et paysages volcaniques, profitez d'un séjour de luxe dans un cadre paradisiaque."
      },
      "martinique": {
        name: "Martinique",
        bgImage: "/images/3c414a78ac7e9a82392fa12f64352cc8.jpg",
        description: "Découvrez nos hébergements d'exception en Martinique, île aux fleurs des Caraïbes. Entre plages idylliques, forêts tropicales et culture créole vibrante, profitez d'un séjour de luxe dans un cadre enchanteur."
      },
      "cote-d-azur": {
        name: "Côte d'Azur / Provence-Alpes-Côte d'Azur",
        bgImage: "/images/19e6fe82b1b99864665ad42a0ad27aef.jpg",
        description: "Découvrez nos hébergements d'exception sur la Côte d'Azur, destination mythique de la Méditerranée française. Profitez du luxe et du glamour de Saint-Tropez, Cannes et Monaco, avec leurs marinas prestigieuses et leur littoral enchanteur."
      }
    }
  },
  espagne: {
    name: "Espagne",
    bgImage: "/images/7c8c4693bfee794fb7f13009a4a717f2.jpg",
    places: {
      "majorque": {
        name: "Majorque",
        bgImage: "/images/e2051ce2c30a4d0b8cb60835895acd60.jpg",
        description: "Découvrez nos hébergements d'exception à Majorque, la perle des Baléares. Entre plages cristallines, villages de charme et montagnes spectaculaires, profitez d'un séjour de luxe dans l'une des plus belles îles de la Méditerranée."
      },
      "tenerife": {
        name: "Tenerife",
        bgImage: "/images/7c8c4693bfee794fb7f13009a4a717f2.jpg",
        description: "Découvrez nos hébergements d'exception à Tenerife, la plus grande des îles Canaries. Entre plages volcaniques, paysages impressionnants dominés par le majestueux volcan Teide et stations balnéaires animées, profitez d'un séjour de luxe sous le soleil toute l'année."
      },
      "ibiza": {
        name: "Ibiza",
        bgImage: "/images/7c8c4693bfee794fb7f13009a4a717f2.jpg",
        description: "Découvrez nos hébergements d'exception à Ibiza, l'île aux multiples facettes. Entre criques idylliques aux eaux cristallines, villages traditionnels authentiques et vie nocturne légendaire, profitez d'un séjour de luxe dans un cadre méditerranéen enchanteur."
      },
      "gran-canaria": {
        name: "Gran Canaria",
        bgImage: "/images/7c8c4693bfee794fb7f13009a4a717f2.jpg",
        description: "Découvrez nos hébergements d'exception à Gran Canaria, l'île aux mille visages. Entre dunes de sable du désert de Maspalomas, montagnes verdoyantes du centre et plages dorées, profitez d'un séjour de luxe dans un cadre naturel exceptionnel sous le soleil toute l'année."
      },
      "lanzarote": {
        name: "Lanzarote",
        bgImage: "/images/7c8c4693bfee794fb7f13009a4a717f2.jpg",
        description: "Découvrez nos hébergements d'exception à Lanzarote, l'île aux volcans. Entre paysages lunaires, vignobles uniques nichés dans la lave et plages aux eaux turquoise, profitez d'un séjour de luxe dans un cadre naturel exceptionnel façonné par l'art de César Manrique et les forces volcaniques."
      }
      // Autres destinations espagnoles à compléter plus tard
    }
  },
  italie: {
    name: "Italie",
    bgImage: "/images/259c2e5b890f7eb1cb5c35d27fdb0989.jpg",
    places: {
      "sicile": {
        name: "Sicile",
        bgImage: "/images/8af8f659aba33763f528976acb9aa3ad.jpg",
        description: "Découvrez nos hébergements d'exception en Sicile, la plus grande île de la Méditerranée. Entre richesses culturelles millénaires, plages idylliques et gastronomie renommée, profitez d'un séjour de luxe dans un cadre historique unique."
      },
      "sardaigne": {
        name: "Sardaigne",
        bgImage: "/images/259c2e5b890f7eb1cb5c35d27fdb0989.jpg",
        description: "Découvrez nos hébergements d'exception en Sardaigne, véritable joyau de la Méditerranée. Entre criques secrètes aux eaux turquoise, villages de charme et gastronomie raffinée, profitez d'un séjour de luxe dans un cadre naturel préservé."
      },
      "capri": {
        name: "Capri",
        bgImage: "/images/259c2e5b890f7eb1cb5c35d27fdb0989.jpg",
        description: "Découvrez nos hébergements d'exception sur l'île de Capri, perle du golfe de Naples. Entre falaises vertigineuses, eaux cristallines et ambiance glamour, profitez d'un séjour de luxe dans l'une des destinations les plus élégantes d'Italie."
      },
      "ischia": {
        name: "Ischia",
        bgImage: "/images/259c2e5b890f7eb1cb5c35d27fdb0989.jpg",
        description: "Découvrez nos hébergements d'exception sur l'île d'Ischia, célèbre pour ses sources thermales. Entre jardins luxuriants, plages de sable fin et eaux curatives, profitez d'un séjour de luxe alliant détente et bien-être."
      },
      "elbe": {
        name: "Elbe",
        bgImage: "/images/259c2e5b890f7eb1cb5c35d27fdb0989.jpg",
        description: "Découvrez nos hébergements d'exception sur l'île d'Elbe, joyau de l'archipel toscan. Entre plages idylliques, villages pittoresques et histoire napoléonienne, profitez d'un séjour de luxe dans un cadre naturel préservé."
      },
      "lipari": {
        name: "Lipari / Éoliennes",
        bgImage: "/images/259c2e5b890f7eb1cb5c35d27fdb0989.jpg",
        description: "Découvrez nos hébergements d'exception aux îles Éoliennes, archipel volcanique au nord de la Sicile. Entre paysages lunaires, eaux thermales et villages blanchis à la chaux, profitez d'un séjour de luxe dans un cadre authentique préservé."
      },
      "lido-de-venise": {
        name: "Lido de Venise",
        bgImage: "/images/259c2e5b890f7eb1cb5c35d27fdb0989.jpg",
        description: "Découvrez nos hébergements d'exception au Lido de Venise, élégante station balnéaire et hôte du célèbre festival du film. Entre plages dorées, villas Art nouveau et proximité avec Venise, profitez d'un séjour de luxe alliant culture et détente."
      },
      "procida": {
        name: "Procida",
        bgImage: "/images/259c2e5b890f7eb1cb5c35d27fdb0989.jpg",
        description: "Découvrez nos hébergements d'exception à Procida, petit joyau coloré du golfe de Naples. Entre maisons pastel, ruelles pittoresques et criques secrètes, profitez d'un séjour de luxe authentique loin du tourisme de masse."
      },
      "lampedusa": {
        name: "Lampedusa",
        bgImage: "/images/259c2e5b890f7eb1cb5c35d27fdb0989.jpg",
        description: "Découvrez nos hébergements d'exception à Lampedusa, perle des îles Pélages. Entre plages de sable blanc, eaux turquoise et réserves naturelles préservées, profitez d'un séjour de luxe dans un véritable paradis méditerranéen."
      },
      "pantelleria": {
        name: "Pantelleria",
        bgImage: "/images/259c2e5b890f7eb1cb5c35d27fdb0989.jpg",
        description: "Découvrez nos hébergements d'exception à Pantelleria, île volcanique entre Sicile et Tunisie. Entre dammusi traditionnels, lacs volcaniques et vignobles réputés, profitez d'un séjour de luxe dans un cadre unique au charme sauvage."
      }
    }
  }
};

// Exemple de structure pour un hébergement
interface Hebergement {
  id: string;
  name: string;
  type: "appartements" | "villas" | "hotels";
  description: string;
  features: string[];
  price: string | number | null;
  images: string[];
  location: string;
}

// Modifier le composant ImageCarousel pour n'avoir que des miniatures qui s'agrandissent au clic
const ImageCarousel = ({ images, title }: { images: string[], title: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Sélectionner une image spécifique et l'afficher en plein écran
  const showImageFullscreen = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(index);
    setIsFullscreen(true);
  };
  
  // Fermer le mode plein écran
  const closeFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFullscreen(false);
  };
  
  // Naviguer vers l'image précédente en mode plein écran
  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };
  
  // Naviguer vers l'image suivante en mode plein écran
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };
  
  return (
    <div className="space-y-3">
      {/* Grille de miniatures cliquables */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((image, index) => (
          <div 
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105"
            onClick={(e) => showImageFullscreen(index, e)}
          >
            <OptimizedImage
              src={image}
              alt={`${title} - Image ${index + 1}`}
              fill
              className="object-cover"
              unoptimized={true}
              suppressHydrationWarning
            />
          </div>
        ))}
      </div>
      
      {/* Vue plein écran */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black z-[60] flex items-center justify-center p-4" 
          onClick={closeFullscreen}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Bouton de fermeture */}
            <button 
              type="button"
              onClick={closeFullscreen}
              className="absolute top-4 right-4 bg-black/50 text-white w-10 h-10 rounded-full flex items-center justify-center z-10 hover:bg-black/70"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            {/* Image en plein écran */}
            <img
              src={images[currentIndex]}
              alt={`${title} - Image ${currentIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain"
            />
            
            {/* Navigation */}
            {images.length > 1 && (
              <>
                <button 
                  type="button"
                  onClick={prevImage} 
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-12 h-12 rounded-full flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  type="button"
                  onClick={nextImage} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-12 h-12 rounded-full flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
            
            {/* Compteur d'images */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Modifier les styles de la modal pour agrandir son contenu
const Modal = ({ isOpen, onClose, title, children }: { 
  isOpen: boolean; 
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  // Bloquer le défilement du body quand la modal est ouverte
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;
  
  // Gestionnaire pour arrêter la propagation des clics
  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto" 
        onClick={handleModalContentClick}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-medium text-[#1a2841]">{title}</h3>
            <button 
              type="button"
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-6 text-gray-700">
          {children}
        </div>
        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button 
            type="button"
            onClick={onClose} 
            className="px-4 py-2 bg-[#c8b273] text-white rounded-full hover:bg-opacity-90 transition-all"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default function DestinationPage() {
  const params = useParams();
  const pays = params.pays as string;
  const destination = params.destination as string;
  
  // État pour les hébergements
  const [hebergements, setHebergements] = useState<{
    appartements: Hebergement[];
    villas: Hebergement[];
    hotels: Hebergement[];
  }>({
    appartements: [],
    villas: [],
    hotels: []
  });

  // État pour indiquer si les données sont en cours de chargement
  const [isLoading, setIsLoading] = useState(true);

  // Charger les données des hébergements au montage du composant
  useEffect(() => {
    async function fetchHebergements() {
      try {
        const response = await fetch('/data/hebergements.json');
        const data = await response.json();
        
        // Vérifier si nous avons des données pour cette destination
        if (data[pays] && data[pays][destination]) {
          setHebergements({
            appartements: data[pays][destination].appartements || [],
            villas: data[pays][destination].villas || [],
            hotels: data[pays][destination].hotels || []
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement des hébergements :', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHebergements();
  }, [pays, destination]);
  
  // Vérifier si le pays et la destination existent dans nos données
  if (!destinations[pays] || !destinations[pays].places[destination]) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-serif text-[#1a2841] mb-4">Destination non trouvée</h1>
        <p className="mb-8">Nous ne proposons pas encore d'hébergements dans cette destination.</p>
        <Link 
          href="/hebergements" 
          className="inline-block bg-[#c8b273] text-white px-6 py-2 rounded-full hover:bg-opacity-90 transition-all"
        >
          Retour aux hébergements
        </Link>
      </div>
    );
  }

  const paysInfo = destinations[pays];
  const destinationInfo = paysInfo.places[destination];

  // État pour le filtre actif
  const [activeFilter, setActiveFilter] = useState<"all" | "appartements" | "villas" | "hotels">("all");

  // Fonction pour filtrer les hébergements
  const getFilteredHebergements = () => {
    switch (activeFilter) {
      case "appartements": return hebergements.appartements;
      case "villas": return hebergements.villas;
      case "hotels": return hebergements.hotels;
      default: return [
        ...hebergements.appartements,
        ...hebergements.villas,
        ...hebergements.hotels
      ];
    }
  };

  // Remplacer complètement le composant HebergementCard
  const HebergementCard = ({ hebergement }: { hebergement: Hebergement }) => {
    // État pour la modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Fonction pour ouvrir la modal
    const openModal = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsModalOpen(true);
    };
    
    // Fonction pour fermer la modal
    const closeModal = () => {
      setIsModalOpen(false);
    };
    
    return (
      <>
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:scale-105 transition-transform duration-300">
          <div className="relative h-60">
            <OptimizedImage 
              src={hebergement.images.length > 0 ? hebergement.images[0] : "/images/b6ed5cca3ba709c6074cae00910adfe1.jpg"}
              alt={hebergement.name} 
              fill 
              className="object-cover"
              unoptimized={true}
              suppressHydrationWarning
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
              <h4 className="text-xl font-medium">{hebergement.location}</h4>
            </div>
          </div>
          <div className="p-6">
            <h5 className="text-lg font-medium text-[#1a2841] mb-3">{hebergement.name}</h5>
            
            {/* Affichage de la description */}
            {hebergement.description && (
              <div className="mb-4 text-gray-700 text-sm">
                <p className="line-clamp-4">{hebergement.description}</p>
                <button 
                  type="button"
                  className="text-[#c8b273] hover:underline mt-1 text-sm font-medium"
                  onClick={openModal}
                >
                  Voir plus
                </button>
              </div>
            )}
            
            <ul className="space-y-1 mb-4 text-gray-700">
              {hebergement.features.map((feature, index) => (
                <li key={index}>• {feature}</li>
              ))}
            </ul>
            <p className="text-[#1a2841] font-medium mb-4">
              {hebergement.price ? `À partir de ${hebergement.price}€/nuit` : "Prix sur demande"}
            </p>
            <Link 
              href={`/contact?hebergement=${hebergement.id}`}
              className="inline-block bg-[#c8b273] text-white px-6 py-2 rounded-full hover:bg-opacity-90 transition-all hover:scale-105 text-sm w-full text-center"
            >
              Réserver
            </Link>
          </div>
        </div>
        
        {/* La modal est maintenant rendue en dehors du composant principal */}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={hebergement.name}
        >
          <div className="space-y-6">
            {/* Carrousel d'images */}
            {hebergement.images.length > 0 && (
              <div className="space-y-4">
                <ImageCarousel images={hebergement.images} title={hebergement.name} />
              </div>
            )}
            
            <h4 className="font-medium text-[#1a2841] text-lg">{hebergement.location}</h4>
            
            <div className="text-gray-700 whitespace-pre-line">
              {hebergement.description}
            </div>
            
            <div className="mt-4">
              <h5 className="font-medium mb-2 text-[#1a2841]">Caractéristiques :</h5>
              <ul className="space-y-1 pl-2">
                {hebergement.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-[#c8b273] mr-2">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-4">
              <p className="text-[#1a2841] font-medium">
                {hebergement.price ? `À partir de ${hebergement.price}€/nuit` : "Prix sur demande"}
              </p>
            </div>
            
            <div className="mt-4">
              <Link 
                href={`/contact?hebergement=${hebergement.id}`}
                className="inline-block bg-[#c8b273] text-white px-6 py-3 rounded-full hover:bg-opacity-90 transition-all text-center w-full"
              >
                Réserver cet hébergement
              </Link>
            </div>
          </div>
        </Modal>
      </>
    );
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <div className="absolute inset-0 z-0">
          <OptimizedImage 
            src={destinationInfo.bgImage} 
            alt={`Hébergements de luxe à ${destinationInfo.name}`} 
            fill 
            style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
            priority
            quality={80}
            sizes="100vw"
            suppressHydrationWarning
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-20 text-center">
          <div>
            <h1 className="text-5xl md:text-7xl font-serif mb-4 font-light text-white">{destinationInfo.name}</h1>
          </div>
          <div>
            <div className="h-1 w-24 bg-[#c8b273] mb-6 mx-auto"></div>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-serif mb-8 font-light text-white">
              Hébergements d'exception
            </h2>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="bg-[#1a2841] py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/hebergements" className="text-white hover:text-[#c8b273] transition-colors">
              Hébergements
            </Link>
            <span className="text-gray-400 mx-2">›</span>
            <Link href={`/hebergements/${pays}`} className="text-white hover:text-[#c8b273] transition-colors">
              {paysInfo.name}
            </Link>
            <span className="text-gray-400 mx-2">›</span>
            <span className="text-[#c8b273]">{destinationInfo.name}</span>
          </div>
        </div>
      </section>
      
      {/* Description */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif text-[#1a2841] mb-4">{destinationInfo.name}</h2>
            <div className="h-1 w-16 bg-[#c8b273] mb-8 mx-auto"></div>
            <p className="text-gray-700 leading-relaxed mb-6">
              {destinationInfo.description}
            </p>
          </div>
        </div>
      </section>

      {/* Filtres */}
      <section className="py-6 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => setActiveFilter("all")}
              className={`px-5 py-2 rounded-full transition-all ${
                activeFilter === "all" 
                  ? "bg-[#1a2841] text-white" 
                  : "bg-white text-[#1a2841] border border-gray-200 hover:bg-gray-100"
              }`}
            >
              Tous ({[...hebergements.appartements, ...hebergements.villas, ...hebergements.hotels].length})
            </button>
            <button 
              onClick={() => setActiveFilter("appartements")}
              className={`px-5 py-2 rounded-full transition-all ${
                activeFilter === "appartements" 
                  ? "bg-[#1a2841] text-white" 
                  : "bg-white text-[#1a2841] border border-gray-200 hover:bg-gray-100"
              }`}
            >
              Appartements ({hebergements.appartements.length})
            </button>
            <button 
              onClick={() => setActiveFilter("villas")}
              className={`px-5 py-2 rounded-full transition-all ${
                activeFilter === "villas" 
                  ? "bg-[#1a2841] text-white" 
                  : "bg-white text-[#1a2841] border border-gray-200 hover:bg-gray-100"
              }`}
            >
              Villas ({hebergements.villas.length})
            </button>
            <button 
              onClick={() => setActiveFilter("hotels")}
              className={`px-5 py-2 rounded-full transition-all ${
                activeFilter === "hotels" 
                  ? "bg-[#1a2841] text-white" 
                  : "bg-white text-[#1a2841] border border-gray-200 hover:bg-gray-100"
              }`}
            >
              Hôtels ({hebergements.hotels.length})
            </button>
          </div>
        </div>
      </section>

      {/* Liste des hébergements */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Chargement des hébergements...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {getFilteredHebergements().map((hebergement) => (
                  <HebergementCard key={hebergement.id} hebergement={hebergement} />
                ))}
              </div>
              
              {getFilteredHebergements().length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">Aucun hébergement disponible dans cette catégorie pour le moment.</p>
                  <p className="text-gray-500 mt-2">Essayez une autre catégorie ou contactez-nous pour des options personnalisées.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl md:text-3xl font-serif text-[#1a2841] mb-6">Vous n'avez pas trouvé ce que vous cherchiez ?</h3>
          <p className="text-gray-700 mb-8 max-w-2xl mx-auto">
            Contactez nos conseillers pour découvrir d'autres hébergements exclusifs à {destinationInfo.name} 
            ou pour une demande sur mesure.
          </p>
          <Link 
            href="/contact" 
            className="inline-block bg-[#c8b273] text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all hover:scale-105"
          >
            Contactez-nous
          </Link>
        </div>
      </section>
    </div>
  );
} 