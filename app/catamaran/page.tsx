"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import PlaceholderImage from "@/components/PlaceholderImage";
import Image from "next/image";

export default function CatamaranPage() {
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
    const formuleType = selectedFormule.includes('golden') ? 'golden' : 
                        selectedFormule.includes('journee') ? 'journee' : 
                        selectedFormule.includes('basseseason') ? 'basseseason' : 'privatisation';
    
    window.location.href = `/reserver?type=catamaran&formule=${formuleType}&date=${date}&adults=${nbAdult}&children=${nbChild}`;
  };

  // Composant de rendu pour les sections avec images du catamaran - à utiliser sans Plaiceholder
  const ImageSection = ({ imagePath, alt, priority = false }: { imagePath: string, alt: string, priority?: boolean }) => (
    <div className="relative h-full min-h-[400px] rounded-lg overflow-hidden">
      <Image 
        src={imagePath}
        alt={alt}
        fill
        priority={priority}
        className="object-cover"
        quality={100}
        sizes="(max-width: 768px) 100vw, 50vw"
        unoptimized={true}
      />
    </div>
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/19e6fe82b1b99864665ad42a0ad27aef.jpg" 
            alt="Catamaran à Bonifacio" 
            fill 
            style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
            priority
            quality={100}
            unoptimized={true}
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-20 text-center">
          <AnimatedSection>
            <h1 className="text-5xl md:text-7xl font-serif mb-4 font-light  text-white">Une croisière en catamaran</h1>
          </AnimatedSection>
          <AnimatedSection delay={200}>
            <div className="h-1 w-24 bg-secondary mb-6 mx-auto"></div>
          </AnimatedSection>
          <AnimatedSection delay={400}>
            <h2 className="text-2xl md:text-3xl font-serif mb-8 font-light text-white">depuis Bonifacio vers l'archipel des îles Lavezzi</h2>
          </AnimatedSection>
          <AnimatedSection delay={600}>
            <Link 
              href="/reserver?type=catamaran" 
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
            <h3 className="text-xl font-medium text-primary mb-6 text-center">Réservez votre croisière en catamaran</h3>
            
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
                    <option value="catamaran-journee">Catamaran - La journée en mer</option>
                    <option value="catamaran-golden">Catamaran - La Golden Hour</option>
                    <option value="catamaran-privatisation-journee">Catamaran - Privatisation journée</option>
                    <option value="catamaran-privatisation-golden">Catamaran - Privatisation Golden Hour</option>
                    <option value="catamaran-basseseason">Catamaran - Offre basse saison</option>
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

      {/* La dolce felicità */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection>
              <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">La dolce</h2>
            </AnimatedSection>
            <AnimatedSection delay={200}>
              <h3 className="text-2xl font-serif text-primary mb-6">felicità</h3>
            </AnimatedSection>
            <AnimatedSection delay={300}>
              <div className="h-1 w-16 bg-secondary mb-8 mx-auto"></div>
            </AnimatedSection>
            <AnimatedSection delay={400} className="text-dark leading-relaxed mb-8">
              <p className="mb-4">
                Explorez et appréciez à bord du Catamaran Briseis les majestueuses falaises de Bonifacio, les eaux cristallines de Sperone, la beauté sauvage des îles Lavezzi et le raffinement de Cavallo dans un catamaran d'exception. Savourez à bord les pâtes aux langoustines de Tony et Pierre-Baptiste.
              </p>
              <p className="mb-4">
                Une journée de rêve dans les plus beaux sites de l'extrême sud Corse. Un moment privilégié de partage et de Dolce vita. L'assurance de passer votre plus belle journée des vacances.
              </p>
            </AnimatedSection>
            <AnimatedSection delay={600}>
              <Link 
                href="/contact" 
                className="inline-block border-2 border-primary text-primary px-8 py-3 rounded-full hover:bg-primary hover:text-white transition-all hover-grow"
              >
                Contactez-nous
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* La journée en mer */}
      <section className="py-16 bg-light">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <AnimatedSection animation="slide-left" className="md:w-1/2  w-full">
              <ImageSection 
                imagePath="/images/fille.jpg" 
                alt="Catamaran journée en mer"
                priority={true}
              />

              <video 
              src="/images/f0e5862064f6681a53541a7f732d50a6.mp4" 
              autoPlay muted loop className="w-full h-full object-cover"></video>
            </AnimatedSection>
            
            <AnimatedSection animation="slide-right" className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">La journée</h2>
              <h3 className="text-2xl font-serif text-primary mb-6">en mer</h3>
              <div className="h-1 w-16 bg-secondary mb-8"></div>
              
              <h4 className="text-xl font-medium text-primary mb-6">Une promenade en mer de Bonifacio face aux magnifiques Îles Lavezzi</h4>
              
              <p className="text-dark font-bold mb-2">Nombre de passagers : 22 maximum</p>
              <p className="text-dark font-bold mb-2">Horaires : de 08h30-16h00</p>
              <p className="text-dark font-bold mb-6">Prix : 128€/personne repas inclu</p>
              
              <p className="text-dark leading-relaxed mb-6">
                Au départ du quai des pêcheurs du port de Bonifacio, la journée commence par la découverte des lieux emblématiques de la cité des falaises. À savoir l'aperçu des grottes, les escaliers du roi d'Aragon, la ville suspendue au-dessus de la mer et le grain de sable. Le tout en longeant la côte jusqu'à au cap extrême sud de la Corse : le cap de St Antoine.
              </p>
              
              <p className="text-dark leading-relaxed mb-6">
                Un premier arrêt baignade s'effectue aux îles Lavezzi où nous arrivons vers 10h00, vous pourrez profiter de la plage et du bateau avec Paddle, masque et tuba. Vous saurez profiter de ce site exceptionnelle. De là sera servit l'apéritif et le repas : Les pâtes aux vongole préparées avec soin par Pierre-Baptiste.
              </p>
              
              <p className="text-dark leading-relaxed mb-8">
                La croisière se poursuit à la voile vers les îles Lavezzi ou vous pourrez pleinement en profiter à bord du catamaran ou en débarquant sur les plages de coquillages et de sable fin aux eaux cristallines. S'ensuit une visite de l'archipel et un retour à 16h au port de Bonifacio. Une journée en croisière à bord de notre catamaran, ma chi dolce felicità.
              </p>
              
              <Link 
                href="/reserver?type=catamaran&formule=journee" 
                className="inline-block bg-secondary text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all hover-grow ripple-button"
              >
                Réserver
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Golden Hour */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row-reverse gap-12 items-center">
            <AnimatedSection animation="slide-right" className="md:w-1/2">
              <ImageSection 
                imagePath="/images/a1a42a6b457cc9870ef40641372de002.jpg" 
                alt="Catamaran Golden Hour"
              />
            </AnimatedSection>
            
            <AnimatedSection animation="slide-left" className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">La Golden Hour en Catamaran</h2>
              <h3 className="text-2xl font-serif text-primary mb-6">Aux îles Lavezzi</h3>
              <div className="h-1 w-16 bg-secondary mb-8"></div>
              
              <h4 className="text-xl font-medium text-primary mb-6">Une promenade en mer de Bonifacio aux îles Lavezzi</h4>
              
              <p className="text-dark font-bold mb-2">Nombre de passagers : 22 Maximum</p>
              <p className="text-dark font-bold mb-2">Horaires : de 16h30 à 21h00</p>
              <p className="text-dark font-bold mb-6">Prix : 85€/pers repas inclu</p>
              
              <p className="text-dark leading-relaxed mb-8">
                Profitez d'un repas dans les criques des îles lavezzi à partir de 16h30. Le soleil est haut et il fait encore chaud. Presque plus aucun bateaux sur l'eau. Une fin d'après midi de rêve à se baigner depuis le catamaran avec de la musique, sirotant un verre avec un plat de pâte aux vongole jusqu'au coucher du soleil que vous pourrez admirer en navigation sous les falaises à la voile ou au moteur. Une manière tout aussi belle de profiter de votre été sans rien rater avec notre golden hour. Une croisière en mer sur mesure à bord de notre catamaran depuis Bonifacio vers les joyaux de l'extreme sud.
              </p>
              
              <Link 
                href="/reserver?type=catamaran&formule=golden" 
                className="inline-block bg-secondary text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all hover-grow ripple-button"
              >
                Réserver
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Basse Saison */}
      <section className="py-16 bg-light">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <AnimatedSection animation="slide-left" className="md:w-1/2">
              <ImageSection 
                imagePath="/images/66c0d3c6ffa78b60fe8ec4d257caa157.jpg" 
                alt="Catamaran en basse saison"
              />
            </AnimatedSection>
            
            <AnimatedSection animation="slide-right" className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">Le catamaran en Basse Saison</h2>
              <h3 className="text-2xl font-serif text-primary mb-6">Aux îles Lavezzi</h3>
              <div className="h-1 w-16 bg-secondary mb-8"></div>
              
              <h4 className="text-xl font-medium text-primary mb-6">Une promenade en mer de Bonifacio aux îles Lavezzi d'avril au 15 mai et en octobre</h4>
              
              <p className="text-dark font-bold mb-2">Nombre de passagers : 22 Maximum</p>
              <p className="text-dark font-bold mb-2">Horaires : de 10h00-15h00</p>
              <p className="text-dark font-bold mb-6">Prix : 102€/pers repas inclu</p>
              
              <p className="text-dark leading-relaxed mb-8">
                Briseis Croisière vous emmène dans les criques de l'archipel de îles Lavezzi. Une promenade en mer de Bonifacio où vous pourrez déguster votre repas accompagnés d'un verre de rosé depuis le bateau ou encore sur l'une des nombreuses plages des Lavezzi. Vous aurez l'occasion de visiter ce paradis sur mer à l'état naturel hors saison et n'aurez que pour vous le plus beau des décors. Lors de votre promenade en mer depuis Bonifacio vers les îles Lavezzi vous aurez l'occasion de voir le grain de sable la pointe st Antoine ou encore Sperone. De quoi profiter d'une bonne promenade de Luxe.
              </p>
              
              <Link 
                href="/reserver?type=catamaran&formule=basseseason" 
                className="inline-block bg-secondary text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all hover-grow ripple-button"
              >
                Réserver
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Galerie */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedSection>
              <h2 className="text-3xl md:text-4xl font-serif text-primary mb-4">Galerie</h2>
            </AnimatedSection>
            <AnimatedSection delay={200}>
              <div className="h-1 w-16 bg-secondary mb-8 mx-auto"></div>
            </AnimatedSection>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {[
                {
                  src: "/images/3e27e8a18c7af27ce7d64a93f3b48581.jpg",
                  alt: "Vue du catamaran à Bonifacio"
                },
                {
                  src: "/images/19e6fe82b1b99864665ad42a0ad27aef.jpg",
                  alt: "Vue du catamaran en navigation"
                },
                {
                  src: "/images/66c0d3c6ffa78b60fe8ec4d257caa157.jpg",
                  alt: "Catamaran en mer"
                },
                {
                  src: "/images/9879be074413aef545fb1707a4c4e981.jpg",
                  alt: "Vue latérale du catamaran"
                },
                {
                  src: "/images/b6c5ac2a0108212af334970c7e150177.jpg",
                  alt: "Catamaran dans les eaux cristallines"
                },
                {
                  src: "/images/4797e545e83f9cbe56075b961702c689.jpg",
                  alt: "Détente à bord du catamaran"
                },
                {
                  src: "/images/fcbef3026c2de48f69c97c468b2c32de.jpg",
                  alt: "Vue sous un autre angle du catamaran"
                },
                {
                  src: "/images/c6f164b56238f74d4685b3719b47dab4.jpg",
                  alt: "Catamaran en navigation vers les îles Lavezzi"
                }
              ].map((image, index) => (
                <div key={index} className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-40 md:h-80 w-full">
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
            
            <AnimatedSection delay={400} className="mt-12">
              <Link 
                href="/galerie" 
                className="inline-block bg-secondary text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all hover-grow ripple-button"
              >
                Voir toutes les photos
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
} 