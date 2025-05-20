"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiX } from 'react-icons/fi';
import Image from "next/image";
import AnimatedSection from "@/components/AnimatedSection";

export default function GaleriePage() {
  const [modalImage, setModalImage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFormule, setSelectedFormule] = useState("catamaran-journee");
  const [date, setDate] = useState("");
  const [nbAdult, setNbAdult] = useState(1);
  const [nbChild, setNbChild] = useState(0);

  // Initialiser la date avec la date d'aujourd'hui au format YYYY-MM-DD
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    setDate(`${year}-${month}-${day}`);
  }, []);

  const handleNbChange = (type: string, action: 'add' | 'minus') => {
    if (type === 'adult') {
      if (action === 'add') {
        setNbAdult(prev => prev + 1);
      } else {
        setNbAdult(prev => prev > 1 ? prev - 1 : 1);
      }
    } else {
      if (action === 'add') {
        setNbChild(prev => prev + 1);
      } else {
        setNbChild(prev => prev > 0 ? prev - 1 : 0);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirection vers la page de réservation avec les paramètres
    const formuleType = selectedFormule.includes('golden') ? 'golden' : 'journee';
    
    window.location.href = `/reserver?type=catamaran&formule=${formuleType}&date=${date}&adults=${nbAdult}&children=${nbChild}`;
  };

  // Collection d'images utilisant les fichiers existants
  const images = [
    { id: 1, src: "/images/b03133c60d9e89c21ddcba126441c68d.jpg", alt: "Vue sur les îles Lavezzi", category: "Îles Lavezzi" },
    { id: 2, src: "/images/3a7d7b2172539c1e1bc3a98c84ba2d73.jpg", alt: "Notre yacht El Corazon", category: "Yacht" },
    { id: 3, src: "/images/92f304125688f3164896e67c309bf232.jpg", alt: "Falaises de Bonifacio", category: "Bonifacio" },
    { id: 4, src: "/images/3827fad2d0944023d701fdb484f819c9.jpg", alt: "Notre catamaran Briséis", category: "Catamaran" },
    { id: 5, src: "/images/a1a42a6b457cc9870ef40641372de002.jpg", alt: "Coucher de soleil en mer", category: "Couchers de soleil" },
    { id: 6, src: "/images/f4c6e53540f41a981984866da204d708.jpg", alt: "Criques des îles Lavezzi", category: "Îles Lavezzi" },
    { id: 7, src: "/images/06e381ca69d4e406d59aec0bb365b430.jpg", alt: "Intérieur du yacht", category: "Yacht" },
    { id: 8, src: "/images/bed62b191763ae7e6732840fb88cdad9.jpg", alt: "Port de Bonifacio", category: "Bonifacio" },
    { id: 9, src: "/images/19e6fe82b1b99864665ad42a0ad27aef.jpg", alt: "Pont du catamaran", category: "Catamaran" },
    { id: 10, src: "/images/b1f1a2bd2939abecced48c4ae808f752.jpg", alt: "Coucher de soleil à Bonifacio", category: "Couchers de soleil" },
    { id: 11, src: "/images/6f8a7b709989b368b3cd8e9ca8714183.jpg", alt: "Plage des îles Lavezzi", category: "Îles Lavezzi" },
    { id: 12, src: "/images/89bb76133ae70cad2dcbb5448ad4e9bb.jpg", alt: "Vue du yacht", category: "Yacht" },
    { id: 13, src: "/images/d4e16579913a73ddc28125fa81fc4a34.jpg", alt: "Vue maritime", category: "Bonifacio" },
    { id: 14, src: "/images/8af8f659aba33763f528976acb9aa3ad.jpg", alt: "Coucher de soleil", category: "Couchers de soleil" },
    { id: 15, src: "/images/34df55308310770ca9764bdb58d1c872.jpg", alt: "Vue des îles", category: "Îles Lavezzi" },
    { id: 16, src: "/images/259c2e5b890f7eb1cb5c35d27fdb0989.jpg", alt: "Yacht en navigation", category: "Yacht" },
    { id: 17, src: "/images/99e330b388bcbe9189c519e17ec50347.jpg", alt: "Vue sur Bonifacio", category: "Bonifacio" },
    { id: 18, src: "/images/66c0d3c6ffa78b60fe8ec4d257caa157.jpg", alt: "Catamaran en mer", category: "Catamaran" },
    { id: 19, src: "/images/b6ed5cca3ba709c6074cae00910adfe1.jpg", alt: "Vue des falaises", category: "Bonifacio" },
    { id: 20, src: "/images/4b69285a3630a4354e5124bb8b26ffb3.jpg", alt: "Coucher de soleil spectaculaire", category: "Couchers de soleil" },
  ];

  const openModal = (src: string) => {
    setModalImage(src);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "auto";
  };

  return (
    <div className="pb-16">
      {/* Hero Section */}
      <section className="relative h-[100vh] flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <div className="absolute inset-0 z-0">
          <video src="/images/fb15d748519d1a0a461327296c8e2ec3.mp4 " autoPlay muted loop className="w-full h-full object-cover"></video>
        </div>
        
        <div className="container mx-auto px-4 relative z-20 text-center">
          <AnimatedSection>
            <h1 className="text-5xl md:text-6xl font-serif font-light mb-4 text-white">Galerie</h1>
          </AnimatedSection>
          <AnimatedSection delay={200}>
            <div className="h-1 w-24 bg-secondary mb-6 mx-auto"></div>
          </AnimatedSection>
          <AnimatedSection delay={400}>
            <h2 className="text-3xl md:text-4xl font-serif font-light mb-8 text-white">Nos plus belles images</h2>
          </AnimatedSection>
        </div>

        {/* Formulaire de réservation intégré (version desktop) */}
        <AnimatedSection 
          animation="fade-in" 
          delay={1000}
          className="hidden md:block absolute bottom-12 left-0 right-0 z-30"
        >
          <div className="container mx-auto max-w-4xl">
            <form onSubmit={handleSubmit} className="grid grid-cols-5 items-center bg-white/90 backdrop-blur-sm rounded-sm">
              <div className="col-span-1 p-5 border-r border-gray-200">
                <label htmlFor="formule" className="block mb-2 text-sm font-medium text-[#b69e6b]">Croisière</label>
                <div className="relative">
                  <select 
                    id="formule" 
                    name="formule" 
                    value={selectedFormule}
                    onChange={(e) => setSelectedFormule(e.target.value)}
                    className="w-full py-2 pr-8 bg-transparent border-none rounded-none focus:outline-none text-gray-700 appearance-none"
                    required
                  >
                    <option value="catamaran-journee">Catamaran - La journée en mer</option>
                    <option value="catamaran-golden">Catamaran - La Golden Hour</option>
                    <option value="yacht-journee">Yacht - La journée en mer</option>
                    <option value="yacht-golden">Yacht - La Golden Hour</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="col-span-1 p-5 border-r border-gray-200">
                <label htmlFor="date" className="block mb-2 text-sm font-medium text-[#b69e6b]">Date</label>
                <input 
                  type="date" 
                  id="date" 
                  name="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full py-2 bg-transparent border-none focus:outline-none text-gray-700"
                  required
                />
              </div>
              
              <div className="col-span-1 p-5 border-r border-gray-200">
                <label htmlFor="adults" className="block mb-2 text-sm font-medium text-[#b69e6b]">Adultes</label>
                <div className="flex items-center justify-between">
                  <button 
                    type="button"
                    onClick={() => handleNbChange('adult', 'minus')}
                    className="flex items-center justify-center w-7 h-7 rounded-full border border-gray-300 text-gray-400"
                  >
                    <span className="sr-only">Moins</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-3 h-3">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="text-gray-700 font-medium mx-3">{nbAdult}</span>
                  <button 
                    type="button"
                    onClick={() => handleNbChange('adult', 'add')}
                    className="flex items-center justify-center w-7 h-7 rounded-full border border-gray-300 text-gray-400"
                  >
                    <span className="sr-only">Plus</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-3 h-3">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="col-span-1 p-5 border-r border-gray-200">
                <label htmlFor="children" className="block mb-2 text-sm font-medium text-[#b69e6b]">Enfants</label>
                <div className="flex items-center justify-between">
                  <button 
                    type="button"
                    onClick={() => handleNbChange('child', 'minus')}
                    className="flex items-center justify-center w-7 h-7 rounded-full border border-gray-300 text-gray-400"
                  >
                    <span className="sr-only">Moins</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-3 h-3">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="text-gray-700 font-medium mx-3">{nbChild}</span>
                  <button 
                    type="button"
                    onClick={() => handleNbChange('child', 'add')}
                    className="flex items-center justify-center w-7 h-7 rounded-full border border-gray-300 text-gray-400"
                  >
                    <span className="sr-only">Plus</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-3 h-3">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="col-span-1">
                <button 
                  type="submit" 
                  className="w-full h-full py-[46px] bg-[#1a2841] text-white uppercase tracking-wider font-medium hover:bg-opacity-90 flex items-center justify-center"
                >
                  Réserver
                </button>
              </div>
            </form>
          </div>
        </AnimatedSection>
      </section>

      {/* Formulaire de réservation mobile */}
      <section className="md:hidden py-8 bg-primary/10">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade-in">
            <h2 className="text-2xl font-serif text-primary mb-6 text-center">Réservez votre croisière</h2>
          </AnimatedSection>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="formule-mobile" className="block text-dark font-medium mb-2">Croisière</label>
              <select 
                id="formule-mobile" 
                name="formule" 
                value={selectedFormule}
                onChange={(e) => setSelectedFormule(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                required
              >
                <option value="catamaran-journee">Catamaran - La journée en mer</option>
                <option value="catamaran-golden">Catamaran - La Golden Hour</option>
                <option value="yacht-journee">Yacht - La journée en mer</option>
                <option value="yacht-golden">Yacht - La Golden Hour</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="date-mobile" className="block text-dark font-medium mb-2">Date</label>
              <input 
                type="date" 
                id="date-mobile" 
                name="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="adults-mobile" className="block text-dark font-medium mb-2">Adultes</label>
                <div className="flex items-center">
                  <button 
                    type="button"
                    onClick={() => handleNbChange('adult', 'minus')}
                    className="bg-gray-200 p-2 rounded-l-lg"
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    id="adults-mobile" 
                    name="adults" 
                    value={nbAdult}
                    onChange={(e) => setNbAdult(parseInt(e.target.value) || 1)}
                    className="w-full p-3 border-y border-gray-300 text-center focus:outline-none"
                    min="1"
                    required
                    readOnly
                  />
                  <button 
                    type="button"
                    onClick={() => handleNbChange('adult', 'add')}
                    className="bg-gray-200 p-2 rounded-r-lg"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="children-mobile" className="block text-dark font-medium mb-2">Enfants</label>
                <div className="flex items-center">
                  <button 
                    type="button"
                    onClick={() => handleNbChange('child', 'minus')}
                    className="bg-gray-200 p-2 rounded-l-lg"
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    id="children-mobile" 
                    name="children" 
                    value={nbChild}
                    onChange={(e) => setNbChild(parseInt(e.target.value) || 0)}
                    className="w-full p-3 border-y border-gray-300 text-center focus:outline-none"
                    min="0"
                    readOnly
                  />
                  <button 
                    type="button"
                    onClick={() => handleNbChange('child', 'add')}
                    className="bg-gray-200 p-2 rounded-r-lg"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <button
                type="submit" 
                className="bg-secondary text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all hover-grow ripple-button"
              >
                Réserver
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Galerie d'images */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map(image => (
              <AnimatedSection 
                key={image.id} 
                animation="fade-in" 
                delay={image.id * 100}
                className="aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div 
                  className="w-full h-full cursor-pointer relative"
                  onClick={() => openModal(image.src)}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    quality={100}
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                    unoptimized={true}
                  />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Modal pour l'image agrandie */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <button 
            className="absolute top-4 right-4 text-white text-2xl"
            onClick={closeModal}
          >
            <span className="sr-only">Fermer</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="max-w-4xl max-h-[90vh] relative">
            <img 
              src={modalImage} 
              alt="Image en plein écran" 
              className="max-w-full max-h-[90vh] object-contain"
              onClick={e => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-serif text-primary mb-6">Envie de vivre l'expérience ?</h2>
            <p className="max-w-2xl mx-auto mb-8 text-dark">
              Ne vous contentez pas de regarder les photos. Venez découvrir par vous-même les merveilles de la Corse du Sud et des îles Lavezzi lors d'une croisière inoubliable.
            </p>
            <Link 
              href="/reserver" 
              className="bg-secondary text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all hover-grow ripple-button"
            >
              Réserver une croisière
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 