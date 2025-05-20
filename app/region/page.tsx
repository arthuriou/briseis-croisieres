"use client";
import Link from "next/link";
import Image from "next/image";
import AnimatedSection from "@/components/AnimatedSection";
import { useState, useEffect } from "react";

export default function RegionPage() {
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

  const attractions = [
    {
      title: "La ville haute de Bonifacio",
      description: "Perchée sur des falaises calcaires vertigineuses, la citadelle de Bonifacio offre une vue imprenable sur la mer. Promenez-vous dans ses ruelles étroites et pittoresques, visitez ses églises médiévales et découvrez son riche patrimoine historique.",
      image: "/images/Bonifacio-Haute-Ville.jpg"
    },
    {
      title: "L'escalier du Roi d'Aragon",
      description: "Cet escalier spectaculaire de 187 marches taillées dans la falaise mène à une source d'eau douce. Selon la légende, il aurait été creusé en une seule nuit lors du siège de Bonifacio par les troupes du roi d'Aragon au XIIIe siècle.",
      image: "/images/escalier.jpg"
    },
    {
      title: "Le phare de la Madonetta",
      description: "Situé à l'entrée du port de Bonifacio, ce phare emblématique guide les navigateurs depuis 1854. Il offre un superbe point de vue sur la ville, les falaises et le détroit entre la Corse et la Sardaigne.",
      image: "/images/Madonetta01.jpg"
    },
    
  ];

  return (
    <div className="pb-16">
      {/* Hero Section */}
      <section className="relative h-[100vh] flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/image.png"
            alt="Région Ocean Lux"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
            priority
            quality={100}
            unoptimized={true}
          />
        </div>

        <div className="container mx-auto px-4 relative z-20 text-center">
          <AnimatedSection>
            <h1 className="text-6xl md:text-7xl font-serif font-light mb-4 text-white">La Région</h1>
          </AnimatedSection>
          <AnimatedSection delay={200}>
            <div className="h-1 w-24 bg-secondary mb-6 mx-auto"></div>
          </AnimatedSection>
          <AnimatedSection delay={400}>
            <h2 className="text-3xl md:text-4xl font-serif font-light mb-10 text-white">Découvrez notre magnifique région</h2>
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

      {/* Introduction Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">Découvrez l'extrême sud de la Corse</h2>
            <div className="h-1 w-24 bg-secondary mb-8 mx-auto"></div>
            <p className="text-dark leading-relaxed mb-8">
              Bonifacio, surnommée la "Cité des Falaises", est une destination unique où se mêlent histoire, culture et paysages époustouflants. 
              Située à l'extrême sud de la Corse, cette ville fortifiée surplombe majestueusement la mer Méditerranée du haut de ses falaises calcaires. 
              Notre port d'attache est le point de départ idéal pour découvrir les merveilles de la région, tant par la terre que par la mer.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Bonifacio Section */}
      <section className="py-16 bg-light">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <AnimatedSection animation="slide-left" className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">La cité médiévale</h2>
              <div className="h-1 w-24 bg-secondary mb-8"></div>
              <p className="text-dark leading-relaxed mb-6">
                Bonifacio se divise en deux parties distinctes : la ville haute (citadelle) et la ville basse (marine). 
                La citadelle médiévale, juchée à 70 mètres au-dessus de la mer, vous transporte à travers les siècles avec ses fortifications, 
                ses ruelles étroites et ses maisons à encorbellement qui semblent défier la gravité en surplombant la falaise.
              </p>
              <p className="text-dark leading-relaxed mb-6">
                Le port, niché dans un fjord naturel, offre un abri idéal pour les bateaux et constitue le point de départ des excursions vers les îles Lavezzi. 
                C'est ici que vous retrouverez notre équipe pour embarquer à bord de nos bateaux et partir à la découverte des trésors marins de la région.
              </p>
            </AnimatedSection>
            <AnimatedSection animation="slide-right" className="md:w-1/2 rounded-lg overflow-hidden shadow-lg">
              <div className="relative h-full min-h-[300px]">
               <video 
               src="/images/3f4329763abfccf2c4ca2d89b8f545e0.mp4 " 
               autoPlay muted loop className="w-full h-full object-cover">
               </video>

              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Les îles Lavezzi Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="absolute inset-0 bg-cover bg-center " style={{ backgroundImage: "url('/images/zone-background.jpg')" }}></div>
          <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
            <AnimatedSection animation="slide-right" className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4 relative z-10">Les îles Lavezzi</h2>
              <div className="h-1 w-24 bg-secondary mb-8"></div>
              <p className="text-dark leading-relaxed mb-6">
                L'archipel des Lavezzi, situé entre la Corse et la Sardaigne, est un joyau naturel protégé où le temps semble s'être arrêté. 
                Ces îles granitiques aux formes sculptées par l'érosion abritent des plages de sable fin et des criques sauvages baignées par des eaux turquoise d'une limpidité exceptionnelle.
              </p>
              <p className="text-dark leading-relaxed mb-6">
                Classées réserve naturelle depuis 1982, les Lavezzi constituent un sanctuaire pour de nombreuses espèces marines et terrestres. 
                La navigation y est réglementée pour préserver ce trésor écologique, et notre équipe veille au respect de l'environnement lors de chaque excursion.
              </p>
            </AnimatedSection>
            <AnimatedSection animation="slide-left" className="md:w-1/2 rounded-lg overflow-hidden shadow-lg">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative md:w-1/2 h-[400px] md:h-[450px] hover:z-10 transition-all duration-700 hover:-translate-y-2 hover:shadow-xl">
                  <Image
                    src="/images/6a22ee76724d1a347e3c5ad7aedda343.jpg"
                    alt="Îles Lavezzi"
                    fill
                    style={{ objectFit: 'cover' }}
                    quality={90}
                    className="rounded-lg"
                  />
                </div>

                <div className="relative md:w-1/2 h-[400px] md:h-[450px] hover:z-10 transition-all duration-700 hover:-translate-y-2 hover:shadow-xl">
                  <Image
                    src="/images/c6f164b56238f74d4685b3719b47dab4.jpg"
                    alt="Îles Lavezzi"
                    fill
                    style={{ objectFit: 'cover' }}
                    quality={90}
                    className="rounded-lg"
                  />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Attractions Section */}
      <section className="py-16 bg-light">
        <div className="container mx-auto px-4">
          <AnimatedSection className="text-center mb-12">
          <div className="absolute inset-0 bg-cover bg-center " style={{ backgroundImage: "url('/images/texture.jpg')" }}></div>
            <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4 relative z-10">À ne pas manquer</h2>
            <div className="h-1 w-24 bg-secondary mb-8 mx-auto"></div>
            <p className="text-dark max-w-3xl mx-auto leading-relaxed relative z-10">
              En complément de votre croisière avec Ocean Lux, voici quelques incontournables à découvrir pendant votre séjour à Bonifacio.
            </p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {attractions.map((attraction, index) => (
              <AnimatedSection 
                key={index} 
                animation="zoom-in" 
                delay={index * 100}
                className="bg-white rounded-lg overflow-hidden shadow-md hover-lift"
              >
                <div className="aspect-video relative">
                  <Image 
                    src={attraction.image}
                    alt={attraction.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    quality={90}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif text-primary mb-3">{attraction.title}</h3>
                  <p className="text-dark">{attraction.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fade-in" className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif text-primary mb-6">Explorez cette région magnifique</h2>
            <p className="text-dark text-lg leading-relaxed mb-10">
              Bonifacio et ses environs regorgent de trésors à découvrir. Commencez votre exploration par une croisière avec Ocean Lux pour admirer cette région unique depuis la mer.
            </p>
            <Link 
              href="/reserver" 
              className="bg-secondary text-white px-10 py-4 rounded-full hover:bg-opacity-90 transition-all hover-grow ripple-button text-lg"
            >
              Réserver votre croisière
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
} 