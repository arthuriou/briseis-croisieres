"use client";
import Link from "next/link";
import Image from "next/image";
import AnimatedSection from "@/components/AnimatedSection";
import { useState, useEffect } from "react";

export default function MomentsForts() {
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

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/ddd60f2a5e077ea5fb62a3706680ff74.jpg" 
            alt="Moments forts Ocean Lux" 
            fill 
            style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
            priority
            quality={100}
            unoptimized={true}
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <AnimatedSection animation="fade-in">
            <h1 className="text-4xl md:text-6xl font-serif mb-4 font-light text-white">Moments Forts</h1>
          </AnimatedSection>
          <AnimatedSection animation="fade-in" delay={200}>
            <div className="h-1 w-16 bg-secondary mb-6 mx-auto"></div>
          </AnimatedSection>
          <AnimatedSection animation="fade-in" delay={400}>
            <h2 className="text-2xl md:text-3xl font-serif mb-8 font-light text-white">Des expériences inoubliables</h2>
          </AnimatedSection>
          <AnimatedSection animation="fade-in" delay={600} className="max-w-2xl mx-auto">
            <p className="text-lg mb-8 text-white">
              Découvrez les moments qui rendent nos croisières uniques. Entre dégustations gastronomiques, baignades dans des criques paradisiaques et couchers de soleil spectaculaires, chaque instant est une invitation à l'émerveillement.
            </p>
          </AnimatedSection>
          <AnimatedSection animation="fade-in" delay={800}>
            <Link 
              href="/reserver" 
              className="inline-block bg-secondary text-white px-10 py-4 rounded-full hover:bg-opacity-90 transition-all hover-grow ripple-button text-lg"
            >
              Réserver
            </Link>
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

      {/* Section croisière exceptionnelle */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-primary mb-6">Une croisière exceptionnelle</h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Découvrez les moments phares qui font de nos croisières une expérience incomparable en Corse.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="h-[300px] md:h-[350px] relative rounded-lg shadow-md overflow-hidden">
              <video src="/images/f859b3de94ca4d1758db36aeef63c6ab.mp4" 
              autoPlay muted loop 
              className="absolute inset-0 w-full h-full 
              object-cover">
              </video>

            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-serif text-primary mb-4">Le départ</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Nous larguons les amarres à 9h30 depuis le port Charles Ornano à Ajaccio. Un café et quelques viennoiseries vous attendent à bord pour bien commencer la journée. Le capitaine vous présente l'équipage, le bateau et le programme de la journée.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Direction les îles Sanguinaires : le paysage est somptueux, l'équipage vous raconte l'histoire de ce lieu emblématique et mythique de la ville d'Ajaccio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Paddle et baignade */}
      <section className="py-20 bg-light">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="order-2 md:order-1">
              <h3 className="text-2xl md:text-3xl font-serif text-primary mb-4">Paddle et baignade</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Premier arrêt baignade dans une crique paradisiaque : le capitaine jette l'ancre dans un lieu privilégié, où l'eau cristalline aux reflets turquoise vous invite à la baignade.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Les plus sportifs peuvent s'initier au paddle, tandis que les autres profitent d'un bain rafraîchissant. Les masques et tubas sont à disposition pour explorer les fonds marins.
              </p>
            </div>
            <div className="order-1 md:order-2 h-[300px] md:h-[350px] relative rounded-lg shadow-md overflow-hidden">
              <Image 
                src="/images/e23a79adff7bd4da68c526e5097972fd.jpg" 
                alt="Paddle et baignade" 
                fill 
                style={{ objectFit: 'cover' }}
                quality={100}
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized={true}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Apéro & Convivialité */}
      <section className="py-20 bg-white">
      <div className="absolute inset-0 bg-cover bg-center " style={{ backgroundImage: "url('/images/texture.jpg')" }}></div>
        <div className="container mx-auto px-4  relative z-10  ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="h-[300px] md:h-[350px] relative rounded-lg shadow-md overflow-hidden">
              <Image 
                src="/images/367aa30d9253a5531444134a93703dc2.jpg" 
                alt="Apéro et convivialité" 
                fill 
                style={{ objectFit: 'cover' }}
                quality={100}
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized={true}
              />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-serif text-primary mb-4">Apéro & Convivialité</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Après cette première baignade, l'équipage vous offre un apéritif composé de produits locaux, accompagné d'un verre de rosé frais. C'est l'occasion d'échanger entre passagers et avec l'équipage dans une ambiance conviviale.
              </p>
              <p className="text-gray-700 leading-relaxed">
                La navigation se poursuit le long de la côte vers la réserve naturelle de Scandola ou d'autres sites remarquables selon les conditions météo.
              </p>
            </div>
                </div>
              </div>
      </section>

      {/* Tout le monde se régale */}
      <section className="py-20 bg-light">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="order-2 md:order-1">
              <h3 className="text-2xl md:text-3xl font-serif text-primary mb-4">Tout le monde se régale</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                Vers 13h, nous jetons l'ancre dans un endroit abrité. L'équipage dresse une belle table et vous sert un délicieux repas préparé par notre traiteur partenaire.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Au menu : entrée, plat, dessert, le tout accompagné de vins locaux, d'eau et de café. Un moment de partage et de détente, bercé par le doux mouvement des vagues.
                </p>
              </div>
            <div className="order-1 md:order-2 h-[700px] md:h-750px] relative rounded-lg shadow-md overflow-hidden">
              <Image 
                src="/images/299e2e418edb5d4a3c3bc24e794c10e7.jpg" 
                alt="Repas en croisière" 
                fill 
                style={{ objectFit: 'cover' }}
                quality={100}
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized={true}
              />
            </div>
          </div>
        </div>
      </section>

      {/* La visite et le second arrêt baignade */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="h-[400px] md:h-[450px] relative rounded-lg shadow-md overflow-hidden">
              <Image 
                src="/images/dffd4e9bfde3cf8d3cf2881afe3add04.jpg" 
                alt="Visite et baignade" 
                fill 
                style={{ objectFit: 'cover' }}
                quality={100}
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized={true}
              />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-serif text-primary mb-4">La visite et le second arrêt baignade</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                L'après-midi, nous naviguons le long de la côte sauvage. Le capitaine vous fait découvrir les trésors cachés de ce littoral préservé : grottes marines, plages inaccessibles, faune et flore remarquables.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Un second arrêt baignade vous permet de vous rafraîchir, pendant que l'équipage prépare une collation sucrée pour le goûter.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 