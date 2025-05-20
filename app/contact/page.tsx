"use client";
import { useState } from "react";
import Link from "next/link";
import { FiMapPin, FiMail, FiPhone, FiClock } from "react-icons/fi";
import AnimatedSection from "@/components/AnimatedSection";
import Image from "next/image";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulation d'envoi de formulaire
    setTimeout(() => {
      setFormStatus({
        submitted: true,
        success: true,
        message: "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setFormStatus({
          submitted: false,
          success: false,
          message: "",
        });
      }, 5000);
    }, 1000);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/zone-background.jpg"
            alt="Contact Ocean Lux"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
            priority
            quality={100}
            unoptimized={true}
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <AnimatedSection animation="fade-in">
            <h1 className="text-4xl md:text-6xl font-serif mb-4 font-light text-white">CONTACTEZ-NOUS</h1>
          </AnimatedSection>
          <AnimatedSection animation="fade-in" delay={200}>
            <div className="h-1 w-16 bg-secondary mb-6 mx-auto"></div>
          </AnimatedSection>
          <AnimatedSection animation="fade-in" delay={400}>
            <h2 className="text-2xl md:text-3xl font-serif mb-8 font-light text-white">À votre service</h2>
          </AnimatedSection>
          <AnimatedSection animation="fade-in" delay={600} className="max-w-2xl mx-auto">
            <p className="text-lg mb-8 text-white">
              Pour toute demande d'information ou réservation, n'hésitez pas à nous contacter. 
              Notre équipe se fera un plaisir de vous répondre.
            </p>
          </AnimatedSection>
        </div>

        {/* Formulaire de réservation intégré (version desktop) */}
        <AnimatedSection 
          animation="fade-in" 
          delay={1000}
          className="hidden md:block absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm p-4 z-30"
          style={{ color: '#000000' }}
        >
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <FiMapPin className="text-primary text-xl mr-2" />
                <span>Port Tino Rossi, Ajaccio</span>
              </div>
              <div className="flex items-center">
                <FiPhone className="text-primary text-xl mr-2" />
                <span>+33 7 73 73 87 37</span>
              </div>
              <div className="flex items-center">
                <FiMail className="text-primary text-xl mr-2" />
                <span>luxocean243@gmail.com</span>
              </div>
            </div>
            <Link
              href="/reserver"
              className="px-8 py-3 bg-secondary text-white rounded-full hover:bg-opacity-90 transition-all hover-grow ripple-button font-medium"
            >
              Réserver
            </Link>
          </div>
        </AnimatedSection>
      </section>

      {/* Contact Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Column - Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-3xl font-light text-[#161e2c] mb-2">
                Envoyez-nous un message
              </h2>
              <div className="w-20 h-1 bg-[#c8b273] mb-6"></div>

              {formStatus.submitted && (
                <div className={`p-4 mb-6 rounded ${formStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {formStatus.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#c8b273] focus:border-[#c8b273]"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#c8b273] focus:border-[#c8b273]"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-gray-700 mb-1">Téléphone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#c8b273] focus:border-[#c8b273]"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-gray-700 mb-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#c8b273] focus:border-[#c8b273]"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="px-10 py-4 bg-[#c8b273] text-white font-medium rounded-md hover:bg-[#b6a267] transition-colors duration-300"
                >
                  Envoyer
                </button>
              </form>
            </div>

            {/* Right Column - Contact Info */}
            <div>
              <h2 className="text-3xl font-light text-[#161e2c] mb-2">
                Informations de contact
              </h2>
              <div className="w-20 h-1 bg-[#c8b273] mb-6"></div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium text-[#161e2c] mb-2">Adresse</h3>
                  <p className="text-gray-600">
                    Port Tino Rossi<br />
                    Quai des Torpilleurs<br />
                    20000 Ajaccio, Corse
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-[#161e2c] mb-2">Email</h3>
                  <a href="mailto:luxocean243@gmail.com" className="text-[#c8b273] hover:underline">
                    luxocean243@gmail.com
                  </a>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-[#161e2c] mb-2">Téléphone</h3>
                  <a href="tel:+33773738737" className="text-[#c8b273] hover:underline">
                    +33 7 73 73 87 37
                  </a>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-[#161e2c] mb-2">Horaires</h3>
                  <p className="text-gray-600">
                    Lundi - Samedi: 9h00 - 18h00<br />
                    Dimanche: Fermé (sauf réservations)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* Map Section */}
      <div className="w-full h-96 relative">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.954!2d8.7378!3d41.9192!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12da14c5ab61f81f%3A0xd4be4dd6e96cfb2c!2sPort%20Tino%20Rossi!5e0!3m2!1sfr!2sfr!4v1624881782042!5m2!1sfr!2sfr" 
          width="100%" 
          height="100%" 
          style={{border:0}} 
          allowFullScreen 
          loading="lazy"
          title="Carte de localisation Ocean Lux"
        ></iframe>
      </div>
    </div>
  );
} 