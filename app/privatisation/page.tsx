"use client";

import Link from "next/link";
import AnimatedSection from "../../components/AnimatedSection";
import { useState, useEffect } from "react";

export default function PrivatisationPage() {
  const [selectedFormule, setSelectedFormule] = useState("yacht-privatisation-journee");
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
    const type = selectedFormule.includes('yacht') ? 'yacht' : 'catamaran';
    const formuleType = selectedFormule.includes('golden') ? 'privatisation-golden' : 'privatisation-journee';
    
    window.location.href = `/reserver?type=${type}&formule=${formuleType}&date=${date}&adults=${nbAdult}&children=${nbChild}`;
  };

  return (
    <div className="pb-16">
      {/* Hero Section */}
      <section className="relative h-[100vh] flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center "
          style={{ backgroundImage: "url('/images/97b4dcfeda8f29b8261f5bccfebe12cb.jpg')" }}
        ></div>
        
        <div className="container mx-auto px-4 relative z-20 text-center">
          <AnimatedSection animation="fade-in" delay={0.2}>
            <h1 className="text-5xl md:text-7xl font-serif mb-4 font-light text-white">Privatisation</h1>
            <div className="h-1 w-24 bg-secondary mb-6 mx-auto"></div>
            <h2 className="text-2xl md:text-3xl font-serif mb-8 font-light text-white">Une croisière exclusive</h2>
          </AnimatedSection>
          <AnimatedSection animation="slide-left" delay={0.4}>
            <p className="max-w-2xl text-lg mx-auto">
              Offrez-vous l'exclusivité d'un de nos bateaux pour un moment inoubliable entre amis, en famille ou pour un événement spécial.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Formulaire de réservation rapide */}
      <section className="py-12 bg-light">
        <div className="container mx-auto px-4">
          <AnimatedSection className="max-w-4xl mx-auto">
            <h3 className="text-xl font-medium text-primary mb-6 text-center">Réservez votre privatisation</h3>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-5 items-center bg-white/95 backdrop-blur-sm rounded-sm shadow-lg">
              <div className="col-span-1 p-5 border-r border-gray-200">
                <label htmlFor="formule" className="block mb-2 text-sm font-medium text-[#b69e6b]">Formule</label>
                <div className="relative">
                  <select 
                    id="formule" 
                    name="formule" 
                    value={selectedFormule}
                    onChange={(e) => setSelectedFormule(e.target.value)}
                    className="w-full py-2 pr-8 bg-transparent border-none rounded-none focus:outline-none text-gray-700 appearance-none"
                    required
                  >
                    <option value="yacht-privatisation-journee">Yacht - Privatisation journée</option>
                    <option value="yacht-privatisation-golden">Yacht - Privatisation Golden Hour</option>
                    <option value="catamaran-privatisation-journee">Catamaran - Privatisation journée</option>
                    <option value="catamaran-privatisation-golden">Catamaran - Privatisation Golden Hour</option>
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

      {/* Introduction Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <AnimatedSection animation="fade-in">
              <h2 className="text-3xl md:text-4xl font-serif text-primary mb-6">L'excellence à votre service</h2>
              <div className="h-1 w-16 bg-secondary mb-8 mx-auto"></div>
            </AnimatedSection>
            <AnimatedSection animation="fade-in" delay={0.3}>
              <p className="text-dark leading-relaxed mb-6">
                Privatisez l'un de nos bateaux et vivez une expérience sur mesure en Corse du Sud. Que ce soit pour un événement particulier, une célébration ou simplement pour profiter pleinement de la mer en toute intimité, nous vous offrons un service personnalisé et de qualité.
              </p>
            </AnimatedSection>
            <AnimatedSection animation="fade-in" delay={0.5}>
              <p className="text-dark leading-relaxed mb-6">
                Tony et Pierre-Baptiste, passionnés de la mer et de leur région, mettront tout en œuvre pour faire de votre sortie en mer un moment mémorable. Profitez de leur expertise et de leur connaissance des plus beaux sites de la région pour une croisière sur mesure.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Options de privatisation */}
      <section className="py-16 bg-light">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade-in">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">Nos formules</h2>
              <h3 className="text-2xl font-serif text-primary mb-6">de privatisation</h3>
              <div className="h-1 w-16 bg-secondary mb-8 mx-auto"></div>
            </div>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {/* Yacht */}
            <AnimatedSection animation="slide-right" delay={0.2}>
              <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                <div className="aspect-video relative">
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/images/a28e5698d995af3a1d6f73c560798eb0.jpg')" }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent flex items-end">
                    <h3 className="text-2xl md:text-3xl font-serif text-white p-6">El Corazon</h3>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-medium text-primary mb-4">Privatisation du yacht</h4>
                  <p className="text-dark mb-6">
                    Profitez de l'élégance et du confort de notre yacht de 20 mètres pour une croisière privée. Idéal pour les groupes jusqu'à 12 personnes souhaitant découvrir les merveilles de la Corse du Sud dans un cadre luxueux.
                  </p>
                  
                  <div className="space-y-6">
                    <div>
                      <h5 className="font-medium text-primary mb-2">Privatisation journée (9h30 - 16h30)</h5>
                      <ul className="space-y-1 text-dark">
                        <li>• Tour complet des îles Lavezzi</li>
                        <li>• Repas complet à bord inclus</li>
                        <li>• Boissons à volonté</li>
                        <li>• Équipements nautiques disponibles</li>
                        <li>• <span className="font-medium">Tarif : à partir de 2040€</span></li>
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-primary mb-2">Privatisation Golden Hour (17h00 - 21h00)</h5>
                      <ul className="space-y-1 text-dark">
                        <li>• Coucher de soleil aux Lavezzi</li>
                        <li>• Apéritif dînatoire inclus</li>
                        <li>• Champagne et boissons</li>
                        <li>• Ambiance musicale</li>
                        <li>• <span className="font-medium">Tarif : à partir de 1530€</span></li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-8 text-center">
                    <Link 
                      href="/reserver?type=yacht&formule=privatisation" 
                      className="inline-block bg-secondary text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all"
                    >
                      Réserver
                    </Link>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            
            {/* Catamaran */}
            <AnimatedSection animation="slide-left" delay={0.4}>
              <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                <div className="aspect-video relative">
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/images/2e2311fd4758bf870ee3dc6084cf6787.jpg')" }}
                  ></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent flex items-end">
                    <h3 className="text-2xl md:text-3xl font-serif text-white p-6">Le Layla</h3>
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-medium text-primary mb-4">Privatisation du catamaran</h4>
                  <p className="text-dark mb-6">
                    Optez pour l'espace et la stabilité de notre catamaran de 41 pieds pour une expérience en mer unique. Parfait pour les groupes jusqu'à 12 personnes souhaitant allier confort et découverte.
                  </p>
                  
                  <div className="space-y-6">
                    <div>
                      <h5 className="font-medium text-primary mb-2">Privatisation journée (8h30 - 16h00)</h5>
                      <ul className="space-y-1 text-dark">
                        <li>• Tour des grottes, falaises et calanques</li>
                        <li>• Arrêt aux îles Lavezzi</li>
                        <li>• Repas et boissons inclus</li>
                        <li>• Équipements nautiques disponibles</li>
                        <li>• <span className="font-medium">Tarif : à partir de 1870€</span></li>
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-primary mb-2">Privatisation Golden Hour (16h30 - 21h00)</h5>
                      <ul className="space-y-1 text-dark">
                        <li>• Navigation au coucher du soleil</li>
                        <li>• Apéritif dînatoire inclus</li>
                        <li>• Champagne et boissons</li>
                        <li>• Ambiance musicale</li>
                        <li>• <span className="font-medium">Tarif : à partir de 1360€</span></li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-8 text-center">
                    <Link 
                      href="/reserver?type=catamaran&formule=privatisation" 
                      className="inline-block bg-secondary text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all"
                    >
                      Réserver
                    </Link>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Événements spéciaux */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection animation="fade-in">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">Événements spéciaux</h2>
                <h3 className="text-2xl font-serif text-primary mb-6">et occasions uniques</h3>
                <div className="h-1 w-16 bg-secondary mb-8 mx-auto"></div>
              </div>
            </AnimatedSection>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <AnimatedSection animation="zoom-in" delay={0.1}>
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <div className="mb-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <h4 className="text-xl font-medium text-primary mb-3">Anniversaires</h4>
                  <p className="text-dark">
                    Célébrez votre anniversaire en mer avec vos proches. Nous pouvons personnaliser la décoration et préparer un gâteau sur demande.
                  </p>
                </div>
              </AnimatedSection>
              
              <AnimatedSection animation="zoom-in" delay={0.3}>
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <div className="mb-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                        <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <h4 className="text-xl font-medium text-primary mb-3">Événements d'entreprise</h4>
                  <p className="text-dark">
                    Team building, séminaires ou incentive, offrez à vos collaborateurs une sortie en mer originale et fédératrice.
                  </p>
                </div>
              </AnimatedSection>
              
              <AnimatedSection animation="zoom-in" delay={0.5}>
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                  <div className="mb-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </div>
                  </div>
                  <h4 className="text-xl font-medium text-primary mb-3">Demandes en mariage</h4>
                  <p className="text-dark">
                    Offrez un cadre romantique et inoubliable pour votre demande en mariage avec un coucher de soleil en mer.
                  </p>
                </div>
              </AnimatedSection>
            </div>
            
            <AnimatedSection animation="fade-in" delay={0.6}>
              <div className="mt-12 p-6 bg-primary/10 rounded-lg">
                <h4 className="text-xl font-medium text-primary mb-4 text-center">Demandes spéciales</h4>
                <p className="text-dark text-center mb-4">
                  Vous avez une idée spécifique ou un événement particulier à organiser ? Contactez-nous pour discuter de vos besoins et nous ferons notre possible pour les satisfaire.
                </p>
                <div className="text-center">
                  <Link 
                    href="/contact" 
                    className="inline-block border-2 border-primary text-primary px-8 py-3 rounded-full hover:bg-primary hover:text-white transition-all"
                  >
                    Nous contacter
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-16 bg-light">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade-in">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">Ils nous ont fait confiance</h2>
              <div className="h-1 w-16 bg-secondary mb-8 mx-auto"></div>
            </div>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <AnimatedSection animation="fade-in" delay={0.2}>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-serif text-xl mr-3">
                    S
                  </div>
                  <div>
                    <h4 className="font-medium">Sophie L.</h4>
                    <p className="text-sm text-gray-600">Anniversaire 40 ans</p>
                  </div>
                </div>
                <p className="text-dark italic">
                  "Une journée incroyable pour fêter mes 40 ans ! Toute l'équipe a été aux petits soins pour nous et nous avons passé un moment inoubliable. La décoration surprise était magnifique et le gâteau délicieux !"
                </p>
                <div className="mt-4 flex">
                  <div className="flex text-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection animation="fade-in" delay={0.4}>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-serif text-xl mr-3">
                    M
                  </div>
                  <div>
                    <h4 className="font-medium">Marc T.</h4>
                    <p className="text-sm text-gray-600">Séminaire d'entreprise</p>
                  </div>
                </div>
                <p className="text-dark italic">
                  "Nous avons privatisé le catamaran pour une journée de team building avec notre équipe. L'expérience était parfaite pour renforcer la cohésion d'équipe dans un cadre exceptionnel. Le capitaine et son équipage ont été très professionnels."
                </p>
                <div className="mt-4 flex">
                  <div className="flex text-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection animation="fade-in" delay={0.6}>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-serif text-xl mr-3">
                    J
                  </div>
                  <div>
                    <h4 className="font-medium">Julien & Emma</h4>
                    <p className="text-sm text-gray-600">Demande en mariage</p>
                  </div>
                </div>
                <p className="text-dark italic">
                  "J'ai organisé ma demande en mariage lors d'une croisière au coucher du soleil. Tout était parfait ! L'équipage a été très discret et a su créer un moment magique. Elle a dit oui avec les Lavezzi en fond, un souvenir gravé à jamais !"
                </p>
                <div className="mt-4 flex">
                  <div className="flex text-secondary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade-in">
            <div className="max-w-4xl mx-auto text-center bg-primary/10 p-10 rounded-lg">
              <h2 className="text-3xl md:text-4xl font-serif text-primary mb-6">Prêt à créer un moment inoubliable ?</h2>
              <p className="text-dark text-lg mb-8 max-w-2xl mx-auto">
                Contactez-nous dès maintenant pour discuter de votre projet de privatisation et créer ensemble une expérience sur mesure qui répondra parfaitement à vos attentes.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link 
                  href="/contact" 
                  className="inline-block bg-primary text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all"
                >
                  Nous contacter
                </Link>
                <Link 
                  href="/reserver?type=privatisation" 
                  className="inline-block bg-secondary text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all"
                >
                  Réserver maintenant
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
} 