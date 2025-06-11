"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FiMenu, FiX, FiPhone } from "react-icons/fi";
import { FaFacebookF, FaInstagram } from "react-icons/fa";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    // Forcer un état initial qui garantit la transparence
    const initialCheck = () => {
      // Toutes les pages ont maintenant un header transparent au début
      const specialPages = false;
      // Seuil de déclenchement pour toutes les pages
      const threshold = window.innerHeight - 100;

      const isScrolled = window.scrollY > threshold;
      setScrolled(isScrolled);
    };

    // Exécuter immédiatement au montage du composant
    initialCheck();

    const handleScroll = () => {
      // Seuil de déclenchement uniforme pour toutes les pages
      const threshold = window.innerHeight - 100;

      // Changer la couleur uniquement après avoir dépassé le seuil
      const isScrolled = window.scrollY > threshold;

      // Mettre à jour l'état uniquement si nécessaire
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    // Ajouter l'écouteur d'événement pour les changements futurs
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled, pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { name: "ACCUEIL", path: "/" },
    { name: "MOMENTS FORTS", path: "/moments-forts" },
    { name: "YACHT", path: "/yacht" },
    { name: "CATAMARAN", path: "/catamaran" },
    { name: "HÉBERGEMENTS", path: "/appartements" },
    { name: "PRIVATISATION", path: "/privatisation" },
    { name: "RÉGION", path: "/region" },
    { name: "GALERIE", path: "/galerie" },
    { name: "CONTACT", path: "/contact" },
  ];

  // Désormais aucune page n'a un header opaque au démarrage
  const initialOpaque = false;

  return (
    <>
      <style jsx global>{`
        /* Styles de base */
        .hover-grow {
          transition: transform 0.3s ease;
        }
        .hover-grow:hover {
          transform: scale(1.05);
        }

        /* Animations */
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideRight {
          from {
            transform: translateX(-20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease forwards;
        }
        .animate-slide-right {
          animation: slideRight 0.4s ease forwards;
        }

        /* Style amélioré pour la ligne sous les liens */
        .nav-link-underline {
          position: relative;
          display: inline-block;
        }

        .nav-link-underline::after {
          content: "";
          position: absolute;
          width: 0;
          height: 2px;
          bottom: -4px;
          left: 0;
          background-color: #c8b273;
          transition: width 0.3s ease;
        }

        .nav-link-underline:hover::after,
        .nav-link-underline.active::after {
          width: 100%;
        } 

        /* Style du header au scroll */
        header.scrolled {
          background-color: #161e2c !important;
          backdrop-filter: blur(8px) !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
        }
        
        /* Style pour le bouton de réservation toujours doré */
        .reservation-button {
          background-color: #c8b273 !important;
          color: white !important;
        }
        .reservation-button:hover {
          background-color: #c8b273 !important;
        }
      `}</style>

      <header
        ref={headerRef}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled || initialOpaque ? "scrolled" : ""
        }`}
        style={{
          backgroundColor:
            scrolled || initialOpaque ? "#161e2c" : "transparent",
          boxShadow:
            scrolled || initialOpaque
              ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              : "none",
          backdropFilter: scrolled || initialOpaque ? "blur(8px)" : "none",
        }}
      >
        <div className="container mx-auto pl-0 pr-2 md:pr-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center hover-grow -ml-4 md:-ml-8">
          <div className="flex items-center">
              <Image 
                src="/images/OceanLux_logo2.png"
                alt="OceanLux Croisières"
                width={120}
                height={30}
                sizes="(max-width: 768px) 120px, 180px"
                className="h-auto w-[120px] md:w-[180px]"
                priority
              />
          </div>
        </Link>

        {/* Navigation desktop */}
          <nav className="hidden lg:flex space-x-5 xl:space-x-8 justify-center">
            {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
                className={`text-white hover:text-[#c8b273] transition-colors nav-link-underline text-xs font-medium tracking-wider whitespace-nowrap ${
                  pathname === item.path ? "active" : ""
                }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

          <div className="hidden lg:flex items-center space-x-4">
          {/* Bouton réserver */}
          <Link 
            href="/reserver" 
              className="reservation-button text-sm px-6 py-2 rounded-md font-medium transition-all hover-grow whitespace-nowrap shadow-md ml-4"
              style={{ backgroundColor: '#c8b273 !important' }}
          >
            RÉSERVER
          </Link>

            {/* Icônes sociales */}
            <div className="flex items-center space-x-4 ml-2">
              <a
                href="https://www.facebook.com/oceanluxcroisieres"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#c8b273] flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="Facebook"
              >
                <FaFacebookF className="text-[#fff]" />
              </a>
              <a
                href="https://www.instagram.com/oceanlux_croisieres"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#c8b273] flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="Instagram"
              >
                <FaInstagram className="text-[#fff]" />
              </a>
              <a
                href="tel:+33773738737"
                className="w-8 h-8 rounded-full bg-[#c8b273] flex items-center justify-center hover:opacity-80 transition-opacity"
                aria-label="Téléphone"
              >
                <FiPhone className="text-[#fff]" />
              </a>
            </div>
          </div>

          {/* Bouton menu mobile */}
          <button
            className="lg:hidden text-white focus:outline-none"
            aria-label="Menu"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="lg:hidden bg-[#161e2c] animate-fade-in">
            <div className="container mx-auto px-4 py-6">
              <nav className="flex flex-col space-y-6">
                {navItems.map((item, index) => (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`text-white hover:text-[#c8b273] transition-colors text-base font-medium animate-slide-right`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                    onClick={toggleMenu}
                  >
                    {item.name}
                  </Link>
                ))}
                
                <Link 
                  href="/reserver" 
                  className="w-full text-center bg-[#c8b273] text-white py-3 rounded-md font-medium animate-slide-right"
                  style={{ animationDelay: `${navItems.length * 0.05}s` }}
                  onClick={toggleMenu}
                >
                  RÉSERVER
                </Link>

                <div 
                  className="flex justify-center space-x-6 animate-slide-right"
                  style={{ animationDelay: `${(navItems.length + 1) * 0.05}s` }}
                >
                  <a
                    href="https://www.facebook.com/oceanluxcroisieres"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#c8b273] flex items-center justify-center"
                    aria-label="Facebook"
                  >
                    <FaFacebookF className="text-[#fff]" />
                  </a>
                  <a
                    href="https://www.instagram.com/oceanlux_croisieres"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-[#c8b273] flex items-center justify-center"
                    aria-label="Instagram"
                  >
                    <FaInstagram className="text-[#fff]" />
                  </a>
                  <a
                    href="tel:+33773738737"
                    className="w-10 h-10 rounded-full bg-[#c8b273] flex items-center justify-center"
                    aria-label="Téléphone"
                  >
                    <FiPhone className="text-[#fff]" />
                  </a>
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header; 
