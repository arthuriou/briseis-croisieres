"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import { FaShip, FaRegClock, FaUsers, FaWater, FaGlassCheers } from "react-icons/fa";

export default function Home() {
  const [selectedFormule, setSelectedFormule] = useState("1");
  const [date, setDate] = useState("");
  const [nbAdult, setNbAdult] = useState(1);
  const [nbChild, setNbChild] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  // Initialiser la date avec la date d'aujourd'hui au format YYYY-MM-DD
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    setDate(`${year}-${month}-${day}`);
    setIsMounted(true);
  }, []);

  // Résoudre les erreurs d'hydratation
  useEffect(() => {
    // Cette fonction ne fait rien, mais elle permet de supprimer les erreurs d'hydratation
    // en forçant un re-render après le montage du composant
  }, [isMounted]);

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
    window.location.href = `/reserver?type=${selectedFormule.includes('catamaran') ? 'catamaran' : 'yacht'}&formule=${selectedFormule.includes('golden') ? 'golden' : 'journee'}&date=${date}&adults=${nbAdult}&children=${nbChild}`;
  };

  const advantages = [
    {
      icon: <FaShip className="text-4xl text-secondary" />,
      title: "Bateaux exceptionnels",
      description: "Yacht luxueux et catamaran moderne pour une expérience maritime d'exception"
    },
    {
      icon: <FaRegClock className="text-4xl text-secondary" />,
      title: "Formules adaptées",
      description: "Choisissez entre croisières à la journée ou coucher de soleil (Golden Hour)"
    },
    {
      icon: <FaUsers className="text-4xl text-secondary" />,
      title: "Expérience familiale",
      description: "Découvrez la Corse avec une famille de pêcheurs depuis 7 générations"
    },
    {
      icon: <FaWater className="text-4xl text-secondary" />,
      title: "Sites exceptionnels",
      description: "Navigation dans les plus beaux lieux: îles Lavezzi, grottes, calanques de Bonifacio"
    },
    {
      icon: <FaGlassCheers className="text-4xl text-secondary" />,
      title: "Gastronomie à bord",
      description: "Dégustez les fameuses pâtes aux palourdes de Tony et savourez l'apéritif en mer"
    }
  ];

  return (
    <div>
      {/* Hero Section avec vidéo en arrière-plan */}
      <section className="relative h-screen flex items-center justify-center text-white">
      <div className="absolute inset-0 bg-black/20 z-10"></div>
        <div className="absolute inset-0 z-0">
          {isMounted ? (
            <video 
              src="/images/07569e490768dc888517eb1f17fce27d.mp4"
              autoPlay 
              muted 
              loop 
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
              aria-label="Vidéo de présentation Ocean Lux"
              suppressHydrationWarning
            >
              Votre navigateur ne prend pas en charge les vidéos HTML5.
          </video>
          ) : (
            <div className="w-full h-full bg-gray-900" />
          )}
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <AnimatedSection animation="fade-in">
            <h1 className="text-4xl md:text-6xl font-serif mb-4 font-light text-white">Croisière à Bonifacio</h1>
          </AnimatedSection>
          <AnimatedSection animation="fade-in" delay={200}>
            <div className="h-1 w-16 bg-secondary mb-6 mx-auto"></div>
          </AnimatedSection>
          <AnimatedSection animation="fade-in" delay={400}>
            <h2 className="text-2xl md:text-3xl font-serif mb-8 font-light text-white">Ocean Lux</h2>
          </AnimatedSection>
          <AnimatedSection animation="fade-in" delay={600} className="max-w-2xl mx-auto">
            <p className="text-lg mb-8 text-white">
              Offrez-vous l'occasion unique de partir en croisière depuis Bonifacio à destination des îles Lavezzi le temps d'une journée. 
              Rencontrez une famille de pêcheur depuis 7 générations et dégustez les pâtes de Tony pour profiter d'un moment intime dans ce que la Corse recèle de plus beau.
            </p>
          </AnimatedSection>
          <AnimatedSection animation="fade-in" delay={800} className="block md:hidden">
            <Link 
              href="/reserver" 
              className="inline-block bg-secondary text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all hover-grow ripple-button"
            >
              Réserver
            </Link>
          </AnimatedSection>
        </div>

        {/* Formulaire de réservation intégré */}
        <AnimatedSection 
          animation="fade-in" 
          delay={1000}
          className="hidden md:block absolute bottom-12 left-0 right-0 z-30"
        >
          <div className="container mx-auto max-w-4xl">
            <form onSubmit={handleSubmit} className="grid grid-cols-5 items-center bg-white/90 backdrop-blur-sm rounded-sm">
              <div className="col-span-1 p-5 border-r border-gray-200">
                <label htmlFor="croisiere" className="block mb-2 text-sm font-medium text-[#b69e6b]">Croisière</label>
                <div className="relative">
              <select 
                id="croisiere" 
                    className="w-full py-2 pr-8 bg-transparent border-none rounded-none focus:outline-none text-gray-700 appearance-none"
                value={selectedFormule}
                onChange={(e) => setSelectedFormule(e.target.value)}
                required
                    suppressHydrationWarning
                  >
                    <option value="1">Yacht - La journée en mer</option>
                    <option value="2">Yacht - Golden hour en mer</option>
                    <option value="3">Catamaran - La journée en mer</option>
                    <option value="4">Catamaran - La Golden Hour</option>
                    <option value="8">Yacht - Privatisation journée</option>
                    <option value="7">Yacht - Privatisation Golden Hour</option>
                    <option value="5">Catamaran - Privatisation journée</option>
                    <option value="6">Catamaran - Privatisation Golden Hour</option>
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
                  className="w-full py-2 bg-transparent border-none focus:outline-none text-gray-700"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                  suppressHydrationWarning
              />
            </div>
            
              <div className="col-span-1 p-5 border-r border-gray-200">
                <label htmlFor="adults" className="block mb-2 text-sm font-medium text-[#b69e6b]">Adultes</label>
                <div className="flex items-center justify-between">
                <button 
                  type="button" 
                    className="flex items-center justify-center w-7 h-7 rounded-full border border-gray-300 text-gray-400"
                  onClick={() => handleNbChange('adult', 'minus')}
                >
                  <span className="sr-only">Moins</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                  <span className="text-gray-700 font-medium mx-3" suppressHydrationWarning>{nbAdult}</span>
                <button 
                  type="button" 
                    className="flex items-center justify-center w-7 h-7 rounded-full border border-gray-300 text-gray-400"
                  onClick={() => handleNbChange('adult', 'add')}
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
                    className="flex items-center justify-center w-7 h-7 rounded-full border border-gray-300 text-gray-400"
                  onClick={() => handleNbChange('child', 'minus')}
                >
                  <span className="sr-only">Moins</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                  <span className="text-gray-700 font-medium mx-3" suppressHydrationWarning>{nbChild}</span>
                <button 
                  type="button" 
                    className="flex items-center justify-center w-7 h-7 rounded-full border border-gray-300 text-gray-400"
                  onClick={() => handleNbChange('child', 'add')}
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
              <label htmlFor="croisiere-mobile" className="block mb-2 text-sm font-medium text-primary">Croisière</label>
              <select 
                id="croisiere-mobile" 
                className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                value={selectedFormule}
                onChange={(e) => setSelectedFormule(e.target.value)}
                required
                suppressHydrationWarning
              >
                <option value="1">Yacht - La journée en mer</option>
                <option value="2">Yacht - Golden hour en mer</option>
                <option value="3">Catamaran - La journée en mer</option>
                <option value="4">Catamaran - La Golden Hour</option>
                <option value="8">Yacht - Privatisation journée</option>
                <option value="7">Yacht - Privatisation Golden Hour</option>
                <option value="5">Catamaran - Privatisation journée</option>
                <option value="6">Catamaran - Privatisation Golden Hour</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="date-mobile" className="block mb-2 text-sm font-medium text-primary">Date</label>
              <input 
                type="date" 
                id="date-mobile" 
                className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                suppressHydrationWarning
              />
            </div>
            
            <div className="flex gap-4">
              <div className="w-1/2">
                <label htmlFor="adults-mobile" className="block mb-2 text-sm font-medium text-primary">Adultes</label>
                <div className="flex">
                  <button 
                    type="button" 
                    className="px-3 py-3 bg-white border border-gray-300 rounded-l-lg"
                    onClick={() => handleNbChange('adult', 'minus')}
                  >
                    <span className="sr-only">Moins</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <input 
                    type="number" 
                    id="adults-mobile" 
                    className="w-full p-3 bg-white border-y border-gray-300 text-center focus:outline-none"
                    min="1" 
                    value={nbAdult}
                    onChange={(e) => setNbAdult(Math.max(1, parseInt(e.target.value)))}
                    required
                    readOnly
                    suppressHydrationWarning
                  />
                  <button 
                    type="button" 
                    className="px-3 py-3 bg-white border border-gray-300 rounded-r-lg"
                    onClick={() => handleNbChange('adult', 'add')}
                  >
                    <span className="sr-only">Plus</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="w-1/2">
                <label htmlFor="children-mobile" className="block mb-2 text-sm font-medium text-primary">Enfants</label>
                <div className="flex">
                  <button 
                    type="button" 
                    className="px-3 py-3 bg-white border border-gray-300 rounded-l-lg"
                    onClick={() => handleNbChange('child', 'minus')}
                  >
                    <span className="sr-only">Moins</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <input 
                    type="number" 
                    id="children-mobile" 
                    className="w-full p-3 bg-white border-y border-gray-300 text-center focus:outline-none"
                    min="0" 
                    value={nbChild}
                    onChange={(e) => setNbChild(Math.max(0, parseInt(e.target.value)))}
                    required
                    readOnly
                    suppressHydrationWarning
                  />
                  <button 
                    type="button" 
                    className="px-3 py-3 bg-white border border-gray-300 rounded-r-lg"
                    onClick={() => handleNbChange('child', 'add')}
                  >
                    <span className="sr-only">Plus</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="w-full mt-4 px-8 py-3 bg-secondary text-white rounded-full hover:bg-opacity-90 transition-all hover-grow ripple-button font-medium"
            >
              Réserver
            </button>
          </form>
        </div>
      </section>

      {/* Pourquoi nous choisir */}
      <section className="py-16 bg-light">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade-in" className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-primary mb-2">Pourquoi choisir</h2>
            <h3 className="text-2xl font-serif text-primary italic mb-4">Ocean Lux</h3>
            <div className="h-1 w-16 bg-secondary mb-6 mx-auto"></div>
            <p className="max-w-3xl mx-auto text-dark">
              Découvrez ce qui rend nos croisières uniques et pourquoi des milliers de voyageurs 
              nous font confiance chaque année pour leur expérience maritime à Bonifacio.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {advantages.map((item, index) => (
              <AnimatedSection 
                key={index} 
                animation="fade-in" 
                delay={index * 100} 
                className="bg-white p-6 rounded-lg shadow-md hover-lift transition-all"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4">
                    {item.icon}
                  </div>
                  <h4 className="text-xl font-serif text-primary mb-2">{item.title}</h4>
                  <p className="text-dark">{item.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Une histoire de famille Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <AnimatedSection animation="slide-right" className="md:w-1/2">
              <div className="titles mb-6">
                <h2 className="text-3xl md:text-4xl font-serif text-primary mb-2">Une histoire</h2>
                <h3 className="text-2xl font-serif text-primary italic">de famille</h3>
              </div>
              <div className="h-1 w-16 bg-secondary mb-8"></div>
              <div className="content">
                <p className="text-dark leading-relaxed mb-8">
                  Embarquez pour une croisière privée depuis Bonifacio à destination des îles Lavezzi avec une compagnie familiale. L'occasion pour vous de profiter d'un moment intime à bord d'un bateau de 20 mètres ou d'un catamaran. Flirtez avec l'archipel, joyau de la Corse-du-Sud, un verre à la main allongé sur le bain de soleil et savourez tout le meilleur de votre croisière. L'occasion aussi de rencontrer une famille de pêcheurs de Bonifacio qui a façonné sa passion de la mer dans les plus beaux recoins de l'extrême sud de la Corse. Tony et Pierre-Baptiste, son fils, vous feront profiter durant cette croisière au départ de Bonifacio de ce décor qui n'appartient qu'à vous.
                </p>
                <Link 
                  href="/contact" 
                  className="inline-block bg-primary text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all hover-grow ripple-button"
                >
                  Contactez-nous
                </Link>
              </div>
            </AnimatedSection>
            <div className="md:w-1/2 grid grid-cols-2 gap-4">
              <AnimatedSection animation="zoom-in" delay={200} className="aspect-[3/4] rounded-lg overflow-hidden relative">
                <div className="relative h-full w-full">
                  <Image 
                    src="/images/d1f01d9ba68483af79cc34215fe9aafb.jpg" 
                    alt="Une histoire de famille" 
                    fill 
                    style={{ objectFit: 'cover' }}
                    quality={100}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    unoptimized={true}
                  />
                </div>
              </AnimatedSection>
              <AnimatedSection animation="zoom-in" delay={400} className="aspect-[3/4] rounded-lg overflow-hidden relative">
                <div className="relative h-full w-full">
                  <Image 
                    src="/images/a28e5698d995af3a1d6f73c560798eb0.jpg" 
                    alt="Une histoire de famille" 
                    fill 
                    style={{ objectFit: 'cover' }}
                    quality={100}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    unoptimized={true}
                  />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Nos croisières privées Section */}
      <section className="py-16 bg-light">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <AnimatedSection animation="slide-left" delay={200} className="aspect-video rounded-lg overflow-hidden relative">
                <div className="relative h-full w-full">
                  <Image 
                    src="/images/b6ed5cca3ba709c6074cae00910adfe1.jpg" 
                    alt="Croisière à Bonifacio" 
                    fill 
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </AnimatedSection>
            </div>
            <AnimatedSection animation="slide-right" className="md:w-1/2">
              <div className="titles mb-6">
                <h2 className="text-3xl md:text-4xl font-serif text-primary mb-2">Nos croisières</h2>
                <h3 className="text-2xl font-serif text-primary italic">privées</h3>
              </div>
              <div className="h-1 w-16 bg-secondary mb-8"></div>
              <div className="content">
                <h4 className="text-xl font-medium text-primary mb-6">Une croisière exclusive au départ de Bonifacio</h4>
                <p className="text-dark leading-relaxed mb-8">
                  Donnez goût à toutes vos envies : dégustez les pâtes aux palourdes façon familiale en sirotant un cocktail avec vos amis entre deux baignades. Une tout autre façon de découvrir la faune et la flore sous-marine de l'archipel lors d'une croisière exceptionnelle à Bonifacio. Accostez sur les plages avec un semi rigide ou bien pour les plus sportif, en stand up paddle. Un moment exclusif que reproduisent Tony et son fils, de génération en génération, pour transmettre ce qu'est la définition familiale du farniente. Entre amis et en famille, vivez comme vous ne pourrez vivre nulle part ailleurs l'expérience d'une croisière à Bonifacio : privée, authentique et sincère. De quoi succomber à l'hospitalité corse d'un père et son fils.
                </p>
                <Link 
                  href="/moments-forts" 
                  className="inline-block bg-secondary text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all hover-grow ripple-button"
                >
                  Découvrir
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Le bateau El Corazon Section */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-cover bg-center " style={{ backgroundImage: "url('/images/texture.jpg')" }}></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <AnimatedSection animation="slide-right" className="md:w-1/2">
              <div className="titles mb-6">
                <h2 className="text-3xl md:text-4xl font-serif text-primary mb-2">Le bateau</h2>
                <h3 className="text-2xl font-serif text-primary italic">El Corazon</h3>
              </div>
              <div className="h-1 w-16 bg-secondary mb-8"></div>
              <div className="content">
                <h4 className="text-xl font-medium text-primary mb-6">Un yacht pour la croisière à Bonifacio</h4>
                <p className="text-dark leading-relaxed mb-8">
                  Briséis Croisière compte dans sa flotte El Corazon : notre vedette de 20 mètres. D'inspiration italienne, ce yacht des années 90 allie son côté kitch au confort et au loisir du divertissement. Comportant 3 chambres, deux salles d'eau, un salon intérieur, une cuisine et une passerelle de pilotage. En extérieur, il est tout aussi bien équipé d'une passerelle arrière avec sa douchette, d'un salon extérieur, d'un fly bridge et d'un grand bain de soleil à l'avant. De quoi trouver votre aise sur le navire que ce soit à la journée ou à la demi-journée lors de votre croisière à Bonifacio. Une annexe, le Briséis Tender, un 3D tender xpro 535, notre semi rigide pour débarquer sur les plages de l'île et entrer dans les différentes calanques et grottes qui ornent les falaises de Bonifacio. Concernant les équipements nautiques, on retrouve une bouée tractée ainsi qu'un stand up paddle.
                </p>
                <Link 
                  href="/yacht" 
                  className="inline-block bg-secondary text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all hover-grow ripple-button"
                >
                  Découvrir le yacht
                </Link>
              </div>
            </AnimatedSection>
            <div className="md:w-1/2">
              <AnimatedSection animation="slide-left" delay={200} className="relative">
                <div className="relative">
                  <div className="aspect-video rounded-lg overflow-hidden relative">
                    <Image 
                      src="/images/da9d95ac9aaef376523e817189df33d2.jpg" 
                      alt="Yacht El Corazon" 
                      fill 
                      style={{ objectFit: 'cover' }}
                      className="absolute inset-0"
                    />
                    
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Les programmes de navigation */}
      <section className="py-16 bg-light">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <AnimatedSection animation="slide-left" delay={200} className="aspect-video rounded-lg overflow-hidden relative">
                <div className="relative h-full w-full">
                  <Image 
                    src="/images/5624180dde2ba00ba9c466c4cbc4a80f.jpg" 
                    alt="Programmes de navigation" 
                    fill 
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </AnimatedSection>
            </div>
            <AnimatedSection animation="slide-right" className="md:w-1/2">
              <div className="titles mb-6">
                <h2 className="text-3xl md:text-4xl font-serif text-primary mb-2">Les programmes</h2>
                <h3 className="text-2xl font-serif text-primary italic">de navigation</h3>
              </div>
              <div className="h-1 w-16 bg-secondary mb-8"></div>
              <div className="content">
                <h4 className="text-xl font-medium text-primary mb-6">La Corse-du-Sud se dévoile lors d'une croisière à Bonifacio</h4>
                <p className="text-dark leading-relaxed mb-4">
                  <strong>Croisière à la journée ou golden hour avec notre vedette</strong> : de 09h30 à 16h30 ou de 17h00 à 21h00 profitez des Lavezzi à votre guise, entre apéro, repas, et activités nautiques, Tony retracera l'histoire de son île et de ses îlots.
                </p>
                <p className="text-dark leading-relaxed mb-4">
                  <strong>Croisière à la journée où Golden hour en Catamaran</strong> : de 8h30 à 16h00 ou de 16h30 à 21h00, découvrez le grand tour des grottes falaises et calanque en attendant votre bain aux Lavezzi. Quelques surprises vous attendent à bord. apéritif et repas servit par Pierre-Baptiste, le fils, à bord d'un catamaran à voile de Luxe.
                </p>
                <p className="text-dark leading-relaxed mb-4">
                  <strong>D'avril au 15 Mai et en Octobre : consulter les offres basses saison en catamaran de 10h00 à 15h00 à 120€/pers</strong>
                </p>
                <p className="text-dark font-medium mb-8">
                  Choisissez votre bateau, choisissez votre repas, choisissez votre croisière...
                </p>
                <Link 
                  href="/yacht" 
                  className="inline-block bg-secondary text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all hover-grow ripple-button"
                >
                  Découvrir
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Le catamaran Le Layla */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <AnimatedSection animation="slide-right" className="md:w-1/2">
              <div className="titles mb-6">
                <h2 className="text-3xl md:text-4xl font-serif text-primary mb-2">Notre catamaran de croisière</h2>
                <h3 className="text-2xl font-serif text-primary italic">Le Layla</h3>
              </div>
              <div className="h-1 w-16 bg-secondary mb-8"></div>
              <div className="content">
                <h4 className="text-xl font-medium text-primary mb-6">Un catamaran de luxe pour une croisière d'exception</h4>
                <p className="text-dark leading-relaxed mb-8">
                  Le Layla est un bateau de 41 pieds soit 12mx7m et offre une surface accessible de près de 80m2. Une description : 4 cabines/salles de bain, un grand salon intérieur, un fly et un espace à l'avant sans trampoline pour laisser place à un immense bain de soleil. Entre amis et en famille, profitez d'un instant intime sur notre catamaran pour profiter d'une journée aux îles lavezzi. Mais surtout, quel que soit votre croisière au départ de Bonifacio, c'est une journée en bateau à se laisser aller aux rythmes des flots de la Méditerranée. L'occasion de profiter d'une promenade en mer depuis Bonifacio pour accoster sur les Îles Lavezzi ou Cavallo.
                </p>
                <Link 
                  href="/catamaran" 
                  className="inline-block bg-secondary text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all hover-grow ripple-button"
                >
                  Découvrir
                </Link>
              </div>
            </AnimatedSection>
            <div className="md:w-1/2">
              <AnimatedSection animation="slide-left" delay={200} className="aspect-video rounded-lg overflow-hidden relative">
                <div className="relative h-full w-full">
                  <Image 
                    src="/images/87a3bc451c4a6ef44d4b4c762f79fb7e.jpg" 
                    alt="Catamaran Le Layla" 
                    fill 
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16  text-black">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection animation="fade-in">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Prêt pour une aventure maritime inoubliable ?</h2>
          </AnimatedSection>
          <AnimatedSection animation="fade-in" delay={200}>
            <p className="max-w-3xl mx-auto mb-8 text-lg">
              Réservez dès maintenant votre croisière à Bonifacio avec Ocean Lux et vivez des moments exceptionnels en famille ou entre amis.
            </p>
          </AnimatedSection>
          <AnimatedSection animation="fade-in" delay={400}>
            <Link 
              href="/reserver" 
              className="inline-block bg-secondary text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all hover-grow ripple-button text-lg font-medium"
            >
              Réserver ma croisière
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
} 