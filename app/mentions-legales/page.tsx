import Image from "next/image";
import AnimatedSection from "../../components/AnimatedSection";
import Link from "next/link";

export default function MentionsLegales() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/zone-background.jpg" 
            alt="Mentions légales Ocean Lux" 
            fill 
            style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
            priority
            quality={100}
            unoptimized={true}
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <AnimatedSection animation="fade-in">
            <h1 className="text-4xl md:text-6xl font-serif mb-4 font-light text-white">Mentions légales</h1>
          </AnimatedSection>
          <AnimatedSection animation="fade-in" delay={200}>
            <div className="h-1 w-16 bg-secondary mb-6 mx-auto"></div>
          </AnimatedSection>
          <AnimatedSection animation="fade-in" delay={400}>
            <h2 className="text-2xl md:text-3xl font-serif mb-8 font-light text-white">Informations réglementaires</h2>
          </AnimatedSection>
          <AnimatedSection animation="fade-in" delay={600} className="max-w-2xl mx-auto">
            <p className="text-lg mb-8 text-white">
              Retrouvez ici toutes les informations légales concernant notre entreprise, l'utilisation de notre site web et la protection de vos données personnelles.
            </p>
          </AnimatedSection>
        </div>

        {/* Barre d'information en bas */}
        <AnimatedSection 
          animation="fade-in" 
          delay={1000}
          className="hidden md:block absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-4 z-30"
          style={{ color: '#000000' }}
        >
          <div className="container mx-auto flex items-center justify-between">
            <div className="text-gray-700">
              SARL au capital de 10 000€ | SIRET : 123 456 789 00012
            </div>
            <Link
              href="/contact"
              className="px-8 py-3 bg-secondary text-white rounded-full hover:bg-opacity-90 transition-all hover-grow ripple-button font-medium"
            >
              Nous contacter
            </Link>
          </div>
        </AnimatedSection>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <AnimatedSection animation="fade-in" delay={0.3}>
              <div className="mb-12">
                <h2 className="text-2xl font-serif text-[#161e2c] mb-6">Informations légales</h2>
                <p className="text-dark mb-4">
                  <strong>Raison sociale :</strong> Ocean Lux
                </p>
                <p className="text-dark mb-4">
                  <strong>Forme juridique :</strong> SARL au capital de 10 000€
                </p>
                <p className="text-dark mb-4">
                  <strong>Siège social :</strong> Port, 20169 - Bonifacio, France
                </p>
                <p className="text-dark mb-4">
                  <strong>SIRET :</strong> 123 456 789 00012
                </p>
                <p className="text-dark mb-4">
                  <strong>Directeur de la publication :</strong> Ocean Lux
                </p>
                <p className="text-dark">
                  <strong>Contact :</strong> luxocean243@gmail.com / +33 7 73 73 87 37
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-in" delay={0.4}>
              <div className="mb-12">
                <h2 className="text-2xl font-serif text-[#161e2c] mb-6">Hébergement</h2>
                <p className="text-dark">
                  Ce site est hébergé par la société XYZ Hosting, 123 rue de l'Internet, 75001 Paris, France.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-in" delay={0.5}>
              <div className="mb-12">
                <h2 className="text-2xl font-serif text-[#161e2c] mb-6">Propriété intellectuelle</h2>
                <p className="text-dark mb-4">
                  L'ensemble du contenu de ce site (textes, images, vidéos, etc.) est la propriété exclusive de Ocean Lux ou de ses partenaires. Toute reproduction, représentation, modification, publication, transmission, dénaturation, totale ou partielle du site ou de son contenu, par quelque procédé que ce soit, et sur quelque support que ce soit est interdite sans l'autorisation écrite préalable de Ocean Lux.
                </p>
                <p className="text-dark">
                  Toute exploitation non autorisée du site ou de son contenu, des informations qui y sont divulguées engagerait la responsabilité de l'utilisateur et constituerait une contrefaçon sanctionnée par les articles L 335-2 et suivants du Code de la Propriété Intellectuelle.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-in" delay={0.6}>
              <div className="mb-12">
                <h2 className="text-2xl font-serif text-[#161e2c] mb-6">Protection des données personnelles</h2>
                <p className="text-dark mb-4">
                  Les informations personnelles collectées lors de la prise de contact ou de la réservation sont enregistrées dans un fichier informatisé par Ocean Lux. La base légale du traitement est le consentement que vous donnez lors de la prise de contact ou de la réservation.
                </p>
                <p className="text-dark mb-4">
                  Les données collectées seront communiquées aux seuls destinataires suivants : personnel de Ocean Lux en charge de la gestion des réservations et des demandes clients.
                </p>
                <p className="text-dark mb-4">
                  Les données sont conservées pendant une durée de 3 ans à compter de votre dernière interaction avec notre société.
                </p>
                <p className="text-dark">
                  Vous pouvez accéder aux données vous concernant, les rectifier, demander leur effacement ou exercer votre droit à la limitation du traitement de vos données. Vous pouvez retirer à tout moment votre consentement au traitement de vos données. Pour exercer ces droits ou pour toute question sur le traitement de vos données, vous pouvez contacter luxocean243@gmail.com.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-in" delay={0.7}>
              <div className="mb-12">
                <h2 className="text-2xl font-serif text-[#161e2c] mb-6">Cookies</h2>
                <p className="text-dark mb-4">
                  Notre site internet utilise des cookies pour améliorer l'expérience utilisateur et analyser le trafic. Ces cookies ne collectent aucune information personnelle permettant de vous identifier personnellement.
                </p>
                <p className="text-dark">
                  En naviguant sur notre site, vous acceptez l'utilisation de ces cookies. Vous pouvez toutefois configurer votre navigateur pour refuser l'utilisation de cookies. Dans ce cas, certaines fonctionnalités du site pourraient ne pas être accessibles.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-in" delay={0.8}>
              <div>
                <h2 className="text-2xl font-serif text-[#161e2c] mb-6">Loi applicable et juridiction</h2>
                <p className="text-dark mb-4">
                  Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront compétents.
                </p>
                <p className="text-dark">
                  Les présentes mentions légales peuvent être modifiées à tout moment, sans préavis, selon l'évolution du site ou pour tout autre motif.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
} 