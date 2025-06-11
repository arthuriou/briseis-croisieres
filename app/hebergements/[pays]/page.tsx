"use client";
import React, { useEffect, useState } from "react";
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

// Structure des destinations organisées par pays
type PlaceInfo = {
  slug: string;
  name: string;
};

type PaysInfo = {
  name: string;
  bgImage: string;
  places: PlaceInfo[];
};

type DestinationsMap = {
  [key: string]: PaysInfo;
};

const destinations: DestinationsMap = {
  france: {
    name: "France",
    bgImage: "/images/b6ed5cca3ba709c6074cae00910adfe1.jpg",
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
    bgImage: "/images/7c8c4693bfee794fb7f13009a4a717f2.jpg",
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
    bgImage: "/images/259c2e5b890f7eb1cb5c35d27fdb0989.jpg",
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

export default function PaysPage() {
  const params = useParams();
  const pays = params.pays as string;
  
  // Vérifier si le pays existe dans nos destinations
  if (!destinations[pays]) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-serif text-[#1a2841] mb-4">Destination non trouvée</h1>
        <p className="mb-8">Nous ne proposons pas encore d'hébergements dans ce pays.</p>
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
  
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <div className="absolute inset-0 z-0">
          <OptimizedImage 
            src={paysInfo.bgImage} 
            alt={`Hébergements de luxe en ${paysInfo.name}`} 
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
            <h1 className="text-5xl md:text-7xl font-serif mb-4 font-light text-white">{paysInfo.name}</h1>
          </div>
          <div>
            <div className="h-1 w-24 bg-[#c8b273] mb-6 mx-auto"></div>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-serif mb-8 font-light text-white">
              Nos hébergements d'exception
            </h2>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="bg-[#1a2841] py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/hebergements" className="text-white hover:text-[#c8b273] transition-colors">
              ← Toutes nos destinations
            </Link>
          </div>
        </div>
      </section>
      
      {/* Liste des destinations */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif text-[#1a2841] mb-8 text-center">
            Destinations en {paysInfo.name}
          </h2>
          <div className="h-1 w-16 bg-[#c8b273] mb-12 mx-auto"></div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {paysInfo.places.map((place) => (
              <Link 
                key={place.slug}
                href={`/hebergements/${pays}/${place.slug}`} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 group"
              >
                <div className="relative h-64">
                  <OptimizedImage 
                    src={paysInfo.bgImage} 
                    alt={place.name} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    unoptimized={true}
                    suppressHydrationWarning
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h4 className="text-2xl font-serif mb-2">{place.name}</h4>
                    <p className="text-sm text-white/80">
                      Découvrir nos appartements, villas et hôtels
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 