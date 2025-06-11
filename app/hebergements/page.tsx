"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

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
  const [imgSrc, setImgSrc] = React.useState(src);
  
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

// Structure des destinations organisées par pays
type PlaceInfo = {
  slug: string;
  name: string;
};

type PaysInfo = {
  name: string;
  places: PlaceInfo[];
};

type DestinationsMap = {
  [key: string]: PaysInfo;
};

const destinations: DestinationsMap = {
  france: {
    name: "France",
    places: [
      { slug: "ile-de-re", name: "Île de Ré" },
      { slug: "ile-d-oleron", name: "Île d'Oléron" },
      { slug: "porquerolles", name: "Porquerolles (îles d'Hyères)" },
      { slug: "la-reunion", name: "La Réunion" },
      { slug: "guadeloupe", name: "La Guadeloupe" },
      { slug: "martinique", name: "Martinique" },
      { slug: "cote-d-azur", name: "Côte d'Azur / Provence-Alpes-Côte d'Azur" }
    ]
  },
  espagne: {
    name: "Espagne",
    places: [
      { slug: "majorque", name: "Majorque" },
      { slug: "tenerife", name: "Tenerife" },
      { slug: "ibiza", name: "Ibiza" },
      { slug: "gran-canaria", name: "Gran Canaria" },
      { slug: "lanzarote", name: "Lanzarote" },
    ]
  },
  italie: {
    name: "Italie",
    places: [
      { slug: "sicile", name: "Sicile" },
      { slug: "sardaigne", name: "Sardaigne" },
      { slug: "capri", name: "Capri" },
      { slug: "ischia", name: "Ischia" },
      { slug: "elbe", name: "Elbe" },
      { slug: "lipari", name: "Lipari / Éoliennes" },
      { slug: "lido-de-venise", name: "Lido de Venise" },
      { slug: "procida", name: "Procida" },
      { slug: "lampedusa", name: "Lampedusa" },
      { slug: "pantelleria", name: "Pantelleria" }
    ]
  }
};

export default function HebergementsPage() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Gestion du bouton de retour en haut
    const handleScroll = () => {
      // Afficher le bouton quand on défile plus de 300px
      setShowBackToTop(window.scrollY > 300);
    };

    // Ajouter l'écouteur d'événement
    window.addEventListener('scroll', handleScroll);
    
    // Récupère tous les liens d'ancrage
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    // Ajoute un gestionnaire d'événements à chaque lien
    anchorLinks.forEach(anchor => {
      anchor.addEventListener('click', function(this: HTMLAnchorElement, e: Event) {  
        e.preventDefault();
        
        // Récupère l'ID cible depuis l'attribut href
        const targetId = this.getAttribute('href') || '';
        if (!targetId) return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // Défilement fluide vers l'élément cible
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Mise à jour de l'URL avec le hash sans déclencher de nouveau défilement
          window.history.pushState(null, '', targetId);
        }
      });
    });

    // Nettoyage à la destruction du composant
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Fonction pour revenir en haut de la page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <div className="absolute inset-0 z-0">
          <OptimizedImage 
            src="/images/b6ed5cca3ba709c6074cae00910adfe1.jpg" 
            alt="Hébergements de luxe" 
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
            <h1 className="text-5xl md:text-7xl font-serif mb-4 font-light text-white">Hébergements</h1>
          </div>
          <div>
            <div className="h-1 w-24 bg-[#c8b273] mb-6 mx-auto"></div>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-serif mb-8 font-light text-white">Appartements, Villas et Hôtels de luxe</h2>
          </div>
          <div>
            <Link 
              href="#destinations" 
              className="inline-block bg-[#c8b273] text-white px-10 py-4 rounded-full hover:bg-opacity-90 transition-all hover:scale-105 text-lg"
            >
              Découvrir nos destinations
            </Link>
          </div>
        </div>
      </section>

      {/* Bouton retour en haut */}
      <button
        onClick={scrollToTop}
        className={`fixed right-6 bottom-6 z-50 p-3 rounded-full bg-[#1a2841] text-white shadow-lg transition-all duration-300 ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="Retour en haut"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
      
      {/* Section Introduction */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif text-[#1a2841] mb-4">Des hébergements d'exception</h2>
            <div className="h-1 w-16 bg-[#c8b273] mb-8 mx-auto"></div>
            <p className="text-gray-700 leading-relaxed mb-6">
              OceanLux Croisières vous propose une sélection exclusive d'hébergements de luxe dans les plus belles destinations 
              méditerranéennes et au-delà. De somptueux appartements avec vue sur mer aux villas privatives avec piscine, 
              en passant par les hôtels 5 étoiles, découvrez notre collection d'hébergements haut de gamme.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Pour chaque destination, nous avons sélectionné pour vous les meilleurs hébergements : appartements meublés, 
              villas de prestige et hôtels de luxe, tous soigneusement choisis pour leur emplacement exceptionnel, 
              leurs prestations haut de gamme et leur service irréprochable.
            </p>
          </div>
        </div>
      </section>
      
      {/* Section Destinations */}
      <section id="destinations" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif text-[#1a2841] mb-8 text-center">Nos destinations</h2>
          <div className="h-1 w-16 bg-[#c8b273] mb-12 mx-auto"></div>
          
          {/* France */}
          <div className="mb-16">
            <h3 className="text-2xl font-serif text-[#1a2841] mb-6 flex items-center">
              <span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
              France
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {destinations.france.places.map((place) => (
                <Link 
                  key={place.slug}
                  href={`/hebergements/france/${place.slug}`} 
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all hover:scale-105 group"
                >
                  <div className="relative h-48">
                    <OptimizedImage 
                      src={`/images/b6ed5cca3ba709c6074cae00910adfe1.jpg`} 
                      alt={place.name} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      unoptimized={true}
                      suppressHydrationWarning
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="text-xl font-medium">{place.name}</h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Espagne */}
          <div className="mb-16">
            <h3 className="text-2xl font-serif text-[#1a2841] mb-6 flex items-center">
              <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
              Espagne
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {destinations.espagne.places.map((place) => (
                <Link 
                  key={place.slug}
                  href={`/hebergements/espagne/${place.slug}`} 
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all hover:scale-105 group"
                >
                  <div className="relative h-48">
                    <OptimizedImage 
                      src={`/images/7c8c4693bfee794fb7f13009a4a717f2.jpg`} 
                      alt={place.name} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      unoptimized={true}
                      suppressHydrationWarning
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="text-xl font-medium">{place.name}</h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Italie */}
          <div>
            <h3 className="text-2xl font-serif text-[#1a2841] mb-6 flex items-center">
              <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
              Italie
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {destinations.italie.places.map((place) => (
                <Link 
                  key={place.slug}
                  href={`/hebergements/italie/${place.slug}`} 
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all hover:scale-105 group"
                >
                  <div className="relative h-48">
                    <OptimizedImage 
                      src={`/images/259c2e5b890f7eb1cb5c35d27fdb0989.jpg`} 
                      alt={place.name} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      unoptimized={true}
                      suppressHydrationWarning
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="text-xl font-medium">{place.name}</h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 