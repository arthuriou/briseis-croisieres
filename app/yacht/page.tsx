"use client";
import Link from "next/link";
import Image from "next/image";
import AnimatedSection from "@/components/AnimatedSection";
import { useState, useEffect } from "react";

export default function YachtPage() {
  const [selectedFormule, setSelectedFormule] = useState("yacht-journee");
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
    
    window.location.href = `/reserver?type=yacht&formule=${formuleType}&date=${date}&adults=${nbAdult}&children=${nbChild}`;
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/8ad305ebbed1dbc22311db5c95a038d8.jpg" 
            alt="Yacht à Bonifacio" 
            fill 
            style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
            priority
            quality={100}
            unoptimized={true}
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-20 text-center">
          <AnimatedSection>
            <h1 className="text-5xl md:text-7xl font-serif mb-4 font-light text-white">El Corazon</h1>
          </AnimatedSection>
          <AnimatedSection delay={200}>
            <div className="h-1 w-24 bg-secondary mb-6 mx-auto"></div>
          </AnimatedSection>
          <AnimatedSection delay={400}>
            <h2 className="text-2xl md:text-3xl font-serif mb-8 font-light text-white">Notre Yacht de croisière</h2>
          </AnimatedSection>
          <AnimatedSection delay={600}>
            <Link 
              href="/reserver?type=yacht" 
              className="inline-block bg-secondary text-white px-10 py-4 rounded-full hover:bg-opacity-90 transition-all hover-grow ripple-button text-lg"
            >
              Réserver
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Formulaire de réservation rapide */}
      <section className="py-12 bg-light">
        <div className="container mx-auto px-4">
          <AnimatedSection className="max-w-4xl mx-auto">
            <h3 className="text-xl font-medium text-primary mb-6 text-center">Réservez votre croisière en yacht</h3>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-5 items-center bg-white/95 backdrop-blur-sm rounded-sm shadow-lg">
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
                    <option value="yacht-journee">Yacht - La journée en mer</option>
                    <option value="yacht-golden">Yacht - La Golden Hour</option>
                    <option value="yacht-privatisation-journee">Yacht - Privatisation journée</option>
                    <option value="yacht-privatisation-golden">Yacht - Privatisation Golden Hour</option>
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
          </AnimatedSection>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12">
            <AnimatedSection animation="slide-left" className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">Le bateau</h2>
              <h3 className="text-2xl font-serif text-primary mb-6">El Corazon</h3>
              <div className="h-1 w-16 bg-secondary mb-8"></div>
              <h4 className="text-xl font-medium text-primary mb-6">Un yacht pour la croisière à Bonifacio</h4>
              <p className="text-dark leading-relaxed mb-8">
                Briséis Croisière compte dans sa flotte El Corazon : notre vedette de 20 mètres. 
                D'inspiration italienne, ce yacht des années 90 allie son côté kitch au confort et au loisir du divertissement. 
                Comportant 3 chambres, deux salles d'eau, un salon intérieur, une cuisine et une passerelle de pilotage. 
                En extérieur, il est tout aussi bien équipé d'une passerelle arrière avec sa douchette, d'un salon extérieur, d'un fly bridge et d'un grand bain de soleil à l'avant. 
              </p>
              <p className="text-dark leading-relaxed mb-8">
                De quoi trouver votre aise sur le navire que ce soit à la journée ou à la demi-journée lors de votre croisière à Bonifacio. 
                Une annexe, le Briséis Tender, un 3D tender xpro 535, notre semi rigide pour débarquer sur les plages de l'île et entrer dans les différentes calanques et grottes qui ornent les falaises de Bonifacio. 
                Concernant les équipements nautiques, on retrouve une bouée tractée ainsi qu'un stand up paddle.
              </p>
            </AnimatedSection>
            <AnimatedSection animation="slide-right" className="md:w-1/2 rounded-lg overflow-hidden">
              <div className="relative h-full min-h-[400px]">
                <Image 
                  src="/images/b6ed5cca3ba709c6074cae00910adfe1.jpg" 
                  alt="Intérieur du yacht El Corazon" 
                  fill 
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Caractéristiques Section */}
      <section className="py-16 bg-light">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">Caractéristiques</h2>
            <h3 className="text-2xl font-serif text-primary mb-6">techniques</h3>
            <div className="h-1 w-16 bg-secondary mb-8 mx-auto"></div>
          </AnimatedSection>
          
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatedSection animation="slide-left" delay={200} className="bg-white p-8 rounded-lg shadow-md hover-lift">
              <h4 className="text-xl font-medium text-primary mb-4">Le bateau</h4>
              <ul className="space-y-2 text-dark">
                <li>• Longueur : 20 mètres</li>
                <li>• Style : Yacht italien</li>
                <li>• Capacité : 12 personnes max</li>
                <li>• 3 cabines</li>
                <li>• 2 salles d'eau</li>
                <li>• Salon intérieur</li>
                <li>• Cuisine équipée</li>
              </ul>
            </AnimatedSection>
            
            <AnimatedSection animation="slide-right" delay={400} className="bg-white p-8 rounded-lg shadow-md hover-lift">
              <h4 className="text-xl font-medium text-primary mb-4">Équipements</h4>
              <ul className="space-y-2 text-dark">
                <li>• Passerelle arrière avec douchette</li>
                <li>• Salon extérieur</li>
                <li>• Fly bridge</li>
                <li>• Grand bain de soleil à l'avant</li>
                <li>• Semi-rigide (Briséis Tender)</li>
                <li>• Bouée tractée</li>
                <li>• Stand up paddle</li>
              </ul>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Formules Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">Nos formules</h2>
            <h3 className="text-2xl font-serif text-primary mb-6">de croisière en yacht</h3>
            <div className="h-1 w-16 bg-secondary mb-8 mx-auto"></div>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <AnimatedSection animation="zoom-in" delay={200} className="bg-white p-8 rounded-lg shadow-md border border-gray-100 hover-lift">
              <h3 className="text-2xl font-serif text-primary mb-4">La journée en mer</h3>
              <p className="text-dark mb-2">• Horaires : 09h30 - 16h30</p>
              <p className="text-dark mb-2">• Destination : Îles Lavezzi</p>
              <p className="text-dark mb-2">• Repas et boissons inclus</p>
              <p className="text-dark mb-2">• Activités nautiques</p>
              <p className="text-dark mb-2">• Guide : Tony ou Pierre-Baptiste</p>
              <p className="text-dark mb-6">• 12 personnes maximum</p>
              
              <div className="text-center">
                <Link 
                  href="/reserver?type=yacht&formule=journee" 
                  className="inline-block bg-secondary text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all hover-grow ripple-button"
                >
                  Réserver
                </Link>
              </div>
            </AnimatedSection>
            
            <AnimatedSection animation="zoom-in" delay={400} className="bg-white p-8 rounded-lg shadow-md border border-gray-100 hover-lift">
              <h3 className="text-2xl font-serif text-primary mb-4">Golden Hour</h3>
              <p className="text-dark mb-2">• Horaires : 17h00 - 21h00</p>
              <p className="text-dark mb-2">• Destination : Îles Lavezzi</p>
              <p className="text-dark mb-2">• Apéritif et tapas inclus</p>
              <p className="text-dark mb-2">• Coucher de soleil</p>
              <p className="text-dark mb-2">• Guide : Tony ou Pierre-Baptiste</p>
              <p className="text-dark mb-6">• 12 personnes maximum</p>
              
              <div className="text-center">
                <Link 
                  href="/reserver?type=yacht&formule=golden" 
                  className="inline-block bg-secondary text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all hover-grow ripple-button"
                >
                  Réserver
                </Link>
              </div>
            </AnimatedSection>
          </div>
          
          <AnimatedSection delay={600} className="mt-12 text-center">
            <Link 
              href="/privatisation" 
              className="inline-block border-2 border-primary text-primary px-8 py-3 rounded-full hover:bg-primary hover:text-white transition-all hover-grow"
            >
              Découvrir nos options de privatisation
            </Link>
          </AnimatedSection>
        </div>
      </section>
      
      {/* Galerie Photos */}
      <section className="py-16 bg-light">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">Galerie</h2>
            <h3 className="text-2xl font-serif text-primary mb-6">El Corazon en images</h3>
            <div className="h-1 w-16 bg-secondary mb-8 mx-auto"></div>
          </AnimatedSection>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {[
              {
                src: "/images/06e381ca69d4e406d59aec0bb365b430.jpg",
                alt: "Vue sur le pont du yacht El Corazon"
              },
              {
                src: "/images/89bb76133ae70cad2dcbb5448ad4e9bb.jpg",
                alt: "Vue du yacht en navigation"
              },
              {
                src: "/images/3a7d7b2172539c1e1bc3a98c84ba2d73.jpg",
                alt: "Yacht El Corazon en mer"
              },
              {
                src: "/images/259c2e5b890f7eb1cb5c35d27fdb0989.jpg",
                alt: "Extérieur du yacht El Corazon"
              },
              {
                src: "/images/f678d313d8118594a1879b1c12ecb717.jpg",
                alt: "Vue arrière du yacht"
              },
              {
                src: "/images/19e6fe82b1b99864665ad42a0ad27aef.jpg",
                alt: "Vue latérale du yacht"
              },
              {
                src: "/images/57bc543913049e43ff092f07eb96fdcb.jpg",
                alt: "Yacht en navigation"
              },
              {
                src: "/images/367aa30d9253a5531444134a93703dc2.jpg",
                alt: "Yacht El Corazon dans les eaux cristallines"
              }
            ].map((image, index) => (
              <div key={index} className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-48 md:h-64">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-500"
                    quality={100}
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                    unoptimized={true}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <AnimatedSection delay={800} className="mt-12 text-center">
            <Link 
              href="/galerie" 
              className="inline-block bg-secondary text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all hover-grow ripple-button"
            >
              Voir toutes les photos
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
} 