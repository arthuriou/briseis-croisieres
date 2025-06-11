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

export default function AppartementsPage() {
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
              href="/contact" 
              className="inline-block bg-[#c8b273] text-white px-10 py-4 rounded-full hover:bg-opacity-90 transition-all hover:scale-105 text-lg"
            >
              Nous contacter
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
      
      {/* Section en construction */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif text-[#1a2841] mb-4">Nos hébergements de luxe</h2>
            <div className="h-1 w-16 bg-[#c8b273] mb-8 mx-auto"></div>
            <p className="text-gray-700 leading-relaxed mb-6">
              Cette section est en cours de construction. Nous préparons une sélection exclusive d'hébergements de luxe dans les plus belles destinations.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Pour toute demande concernant les hébergements, n'hésitez pas à nous contacter directement.
            </p>
          </div>
          
          <div className="text-center mt-8">
            <Link 
              href="/contact" 
              className="inline-block bg-[#c8b273] text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all hover:scale-105"
            >
              Contactez-nous pour un devis personnalisé
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 