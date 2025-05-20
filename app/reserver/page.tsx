"use client";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AnimatedSection from "@/components/AnimatedSection";
import AvailabilityChecker from "@/components/AvailabilityChecker";
import ReservationSteps from "@/components/ReservationSteps";
import ReservationSummary from "@/components/ReservationSummary";
import { validateReservationForm } from "@/utils/validation";

// Interface pour les données du formulaire
interface FormData {
  type: string;
  formule: string;
  date: string;
  adults: number;
  children: number;
  nom: string;
  email: string;
  telephone: string;
  message: string;
}

// Interface pour les erreurs du formulaire
interface FormErrors {
  [key: string]: string;
}

// Composant principal du formulaire de réservation
function ReservationForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  
  const [formData, setFormData] = useState<FormData>({
    type: "",
    formule: "",
    date: "",
    adults: 1,
    children: 0,
    nom: "",
    email: "",
    telephone: "",
    message: "",
  });

  // Récupérer les paramètres de l'URL
  useEffect(() => {
    const type = searchParams.get("type");
    const formule = searchParams.get("formule");
    const date = searchParams.get("date");
    const adults = searchParams.get("adults");
    const children = searchParams.get("children");
    
    if (type) setFormData((prev) => ({ ...prev, type }));
    if (formule) setFormData((prev) => ({ ...prev, formule }));
    if (date) setFormData((prev) => ({ ...prev, date }));
    if (adults) setFormData((prev) => ({ ...prev, adults: parseInt(adults) }));
    if (children) setFormData((prev) => ({ ...prev, children: parseInt(children) }));
  }, [searchParams]);

  // Gérer les changements dans le formulaire
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Effacer l'erreur lorsque l'utilisateur modifie le champ
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Gérer les changements de nombre (adultes/enfants)
  const handleChangeNumber = (name: string, value: number) => {
    setFormData({
      ...formData,
      [name]: Math.max(name === "adults" ? 1 : 0, value),
    });
  };

  // Gérer le changement de disponibilité
  const handleAvailabilityChange = useCallback((isAvailable: boolean) => {
    setIsAvailable(isAvailable);
  }, []);

  // Validation de l'étape actuelle
  const validateCurrentStep = (): boolean => {
    if (currentStep === 0) {
      // Validation de la première étape (sélection du bateau, formule, date)
      if (!formData.type || !formData.formule || !formData.date) {
        const errors: FormErrors = {};
        if (!formData.type) errors.type = "Veuillez sélectionner un type de bateau";
        if (!formData.formule) errors.formule = "Veuillez sélectionner une formule";
        if (!formData.date) errors.date = "Veuillez sélectionner une date";
        setFormErrors(errors);
        return false;
      }
      return isAvailable; // Vérifier aussi la disponibilité
    } 
    
    if (currentStep === 1) {
      // Validation de la deuxième étape (coordonnées)
      const { valid, errors } = validateReservationForm(formData);
      if (!valid) {
        setFormErrors(errors);
        return false;
      }
      return true;
    }
    
    return true;
  };

  // Passer à l'étape suivante
  const goToNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Retourner à l'étape précédente
  const goToPreviousStep = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier la validité du formulaire
    const { valid, errors } = validateReservationForm(formData);
    if (!valid) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    setSubmissionError("");
    
    try {
      const response = await fetch('/api/reservation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue lors de l\'envoi de votre réservation');
      }
      
      setSubmissionSuccess(true);
      // Rediriger vers une page de confirmation ou afficher un message
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Afficher un message d'erreur pour un champ spécifique
  const renderError = (fieldName: string) => {
    return formErrors[fieldName] ? (
      <p className="text-red-500 text-sm mt-1">{formErrors[fieldName]}</p>
    ) : null;
  };

  // Rendu conditionnel en fonction de l'étape actuelle
  const renderStepContent = () => {
    if (submissionSuccess) {
      return (
        <div className="text-center py-8">
          <div className="text-5xl text-green-500 mb-4">✓</div>
          <h3 className="text-2xl font-serif text-[#161e2c] mb-4">Réservation envoyée avec succès !</h3>
          <p className="mb-6">
            Merci pour votre réservation. Nous vous avons envoyé un email de confirmation.
            Notre équipe vous contactera dans les 24 heures pour finaliser les détails.
          </p>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="bg-[#c8b273] text-white px-8 py-2 rounded-full hover:bg-[#b6a267] transition-all"
          >
            Retour à l'accueil
          </button>
        </div>
      );
    }
    
    switch (currentStep) {
      case 0:
  return (
          <>
            {/* Type de bateau et formule */}
      <AnimatedSection animation="slide-left" delay={200}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
                  <label htmlFor="type" className="block text-dark font-medium mb-2">
                    Type de bateau
                  </label>
            <select 
              id="type" 
              name="type" 
              value={formData.type}
              onChange={handleChange}
                    className={`w-full p-3 border ${
                      formErrors.type ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8b273]`}
            >
              <option value="">Sélectionnez un bateau</option>
              <option value="yacht">Yacht (El Corazon)</option>
              <option value="catamaran">Catamaran (Le Layla)</option>
            </select>
                  {renderError('type')}
          </div>
          
          <div>
                  <label
                    htmlFor="formule"
                    className="block text-dark font-medium mb-2"
                  >
                    Formule
                  </label>
            <select 
              id="formule" 
              name="formule" 
              value={formData.formule}
              onChange={handleChange}
                    className={`w-full p-3 border ${
                      formErrors.formule ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8b273]`}
            >
              <option value="">Sélectionnez une formule</option>
              <option value="journee">Journée en mer</option>
              <option value="golden">Golden Hour</option>
              <option value="privatisation">Privatisation</option>
              {formData.type === "catamaran" && (
                <option value="basseseason">Offre basse saison</option>
              )}
            </select>
                  {renderError('formule')}
          </div>
        </div>
      </AnimatedSection>
      
      {/* Date et participants */}
      <AnimatedSection animation="slide-right" delay={400}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
                  <label htmlFor="date" className="block text-dark font-medium mb-2">
                    Date
                  </label>
            <input 
              type="date" 
              id="date" 
              name="date" 
              value={formData.date}
              onChange={handleChange}
                    className={`w-full p-3 border ${
                      formErrors.date ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8b273]`}
                  />
                  {renderError('date')}
                  
                  {/* Vérificateur de disponibilité */}
                  {formData.type && formData.formule && formData.date && (
                    <AvailabilityChecker
                      date={formData.date}
                      type={formData.type}
                      formule={formData.formule}
                      onAvailabilityChange={handleAvailabilityChange}
                    />
                  )}
          </div>
          
          <div>
                  <label
                    htmlFor="adults"
                    className="block text-dark font-medium mb-2"
                  >
                    Adultes
                  </label>
            <div className="flex items-center">
              <button 
                type="button"
                      onClick={() =>
                        handleChangeNumber("adults", formData.adults - 1)
                      }
                className="bg-gray-200 p-2 rounded-l-lg"
              >
                -
              </button>
              <input 
                type="number" 
                id="adults" 
                name="adults" 
                value={formData.adults}
                      onChange={(e) =>
                        handleChangeNumber("adults", parseInt(e.target.value))
                      }
                className="w-full p-3 border-y border-gray-300 text-center focus:outline-none"
                min="1"
              />
              <button 
                type="button"
                      onClick={() =>
                        handleChangeNumber("adults", formData.adults + 1)
                      }
                className="bg-gray-200 p-2 rounded-r-lg"
              >
                +
              </button>
            </div>
                  {renderError('adults')}
          </div>
          
          <div>
                  <label
                    htmlFor="children"
                    className="block text-dark font-medium mb-2"
                  >
                    Enfants
                  </label>
            <div className="flex items-center">
              <button 
                type="button"
                      onClick={() =>
                        handleChangeNumber("children", formData.children - 1)
                      }
                className="bg-gray-200 p-2 rounded-l-lg"
              >
                -
              </button>
              <input 
                type="number" 
                id="children" 
                name="children" 
                value={formData.children}
                      onChange={(e) =>
                        handleChangeNumber("children", parseInt(e.target.value))
                      }
                className="w-full p-3 border-y border-gray-300 text-center focus:outline-none"
                min="0"
              />
              <button 
                type="button"
                      onClick={() =>
                        handleChangeNumber("children", formData.children + 1)
                      }
                className="bg-gray-200 p-2 rounded-r-lg"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </AnimatedSection>
            
            <AnimatedSection animation="fade-in" delay={600}>
              <div className="flex justify-between mt-8">
                <div></div>
                <button
                  type="button"
                  onClick={goToNextStep}
                  disabled={!isAvailable}
                  className={`px-8 py-2 rounded-full text-white shadow-md ${
                    isAvailable ? 'bg-[#c8b273] hover:bg-[#b6a267]' : 'bg-gray-400 cursor-not-allowed'
                  } transition-colors`}
                >
                  Continuer
                </button>
              </div>
            </AnimatedSection>
          </>
        );
      
      case 1:
        return (
          <>
            {/* Résumé de la réservation */}
            <AnimatedSection animation="fade-in" delay={200} className="mb-8">
              <ReservationSummary data={formData} />
      </AnimatedSection>
      
      {/* Coordonnées */}
            <AnimatedSection animation="slide-left" delay={400}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
                  <label htmlFor="nom" className="block text-dark font-medium mb-2">
                    Nom complet
                  </label>
            <input 
              type="text" 
              id="nom" 
              name="nom" 
              value={formData.nom}
              onChange={handleChange}
                    className={`w-full p-3 border ${
                      formErrors.nom ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8b273]`}
            />
                  {renderError('nom')}
          </div>
          
          <div>
                  <label htmlFor="email" className="block text-dark font-medium mb-2">
                    Email
                  </label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
                    className={`w-full p-3 border ${
                      formErrors.email ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8b273]`}
            />
                  {renderError('email')}
          </div>
        </div>
      </AnimatedSection>
      
            <AnimatedSection animation="slide-right" delay={600}>
        <div>
                <label
                  htmlFor="telephone"
                  className="block text-dark font-medium mb-2"
                >
                  Téléphone
                </label>
          <input 
            type="tel" 
            id="telephone" 
            name="telephone" 
            value={formData.telephone}
            onChange={handleChange}
                  className={`w-full p-3 border ${
                    formErrors.telephone ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8b273]`}
                  placeholder="Ex: 06 12 34 56 78"
                />
                {renderError('telephone')}
        </div>
      </AnimatedSection>
      
            <AnimatedSection animation="slide-left" delay={800}>
        <div>
                <label htmlFor="message" className="block text-dark font-medium mb-2">
                  Message (optionnel)
                </label>
          <textarea 
            id="message" 
            name="message" 
            value={formData.message}
            onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8b273]"
            rows={4}
                  placeholder="Informations complémentaires, besoins spécifiques..."
          ></textarea>
        </div>
      </AnimatedSection>
      
            <AnimatedSection animation="fade-in" delay={1000}>
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={goToPreviousStep}
                  className="px-8 py-2 rounded-full border border-[#c8b273] text-[#c8b273] hover:bg-gray-100 transition-colors"
                >
                  Retour
                </button>
                <button
                  type="button"
                  onClick={goToNextStep}
                  className="px-8 py-2 rounded-full bg-[#c8b273] text-white hover:bg-[#b6a267] shadow-md transition-colors"
                >
                  Vérifier
                </button>
              </div>
            </AnimatedSection>
          </>
        );
      
      case 2:
        return (
          <>
            {/* Résumé final et confirmation */}
            <AnimatedSection animation="fade-in" delay={200}>
              <ReservationSummary data={formData} showPersonalInfo={true} />
            </AnimatedSection>
            
            <AnimatedSection animation="fade-in" delay={400}>
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <p className="mb-4">En soumettant ce formulaire, vous acceptez que les informations saisies soient utilisées pour traiter votre demande de réservation.</p>
                
                <div className="flex items-start mb-4">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    className="mt-1 mr-2"
                    required
                  />
                  <label htmlFor="terms" className="text-sm">
                    J'accepte les <a href="/mentions-legales" className="text-[#c8b273] underline">conditions générales de vente</a> et la politique de confidentialité de Briséis Croisières.
                  </label>
                </div>
              </div>
              
              {submissionError && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  {submissionError}
                </div>
              )}
            </AnimatedSection>
            
            <AnimatedSection animation="fade-in" delay={600}>
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={goToPreviousStep}
                  className="px-8 py-2 rounded-full border border-[#c8b273] text-[#c8b273] hover:bg-gray-100 transition-colors"
                >
                  Retour
                </button>
        <button 
          type="submit" 
                  disabled={isSubmitting}
                  className={`px-10 py-3 rounded-full text-white shadow-lg transition-all hover:scale-105 ${
                    isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#c8b273] hover:bg-[#b6a267]'
                  }`}
        >
                  {isSubmitting ? 'Envoi en cours...' : 'Confirmer ma réservation'}
        </button>
              </div>
      </AnimatedSection>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <ReservationSteps currentStep={currentStep} totalSteps={3} />
      {renderStepContent()}
    </form>
  );
}

// Composant principal
export default function ReserverPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-black/20 z-10"></div>
        <div className="absolute inset-0 z-0">
          <video
            src="/images/061ee9b67c244dbad6b07e4290ec2f8c.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-full object-cover object-center"
            suppressHydrationWarning
          ></video>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <AnimatedSection animation="fade-in">
            <h1 className="text-4xl md:text-6xl font-serif mb-4 font-light text-white">
              Réservez votre croisière
            </h1>
          </AnimatedSection>
          <AnimatedSection animation="fade-in" delay={200}>
            <div className="h-1 w-16 bg-secondary mb-6 mx-auto"></div>
          </AnimatedSection>
          <AnimatedSection animation="fade-in" delay={400}>
            <h2 className="text-2xl md:text-3xl font-serif mb-8 font-light text-white">
              Une expérience maritime exclusive
            </h2>
          </AnimatedSection>
          <AnimatedSection
            animation="fade-in"
            delay={600}
            className="max-w-2xl mx-auto"
          >
            <p className="text-lg mb-8 text-white">
              Complétez le formulaire ci-dessous pour réserver votre croisière.
              Notre équipe vous contactera rapidement pour confirmer votre
              réservation et finaliser les détails.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Formulaire de réservation */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <AnimatedSection
            animation="fade-in"
            className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-lg shadow-lg"
          >
            <h2 className="text-3xl font-serif text-[#161e2c] mb-8 text-center">
              Formulaire de réservation
            </h2>
              <Suspense fallback={<div className="text-center py-8">Chargement du formulaire...</div>}>
                <ReservationForm />
              </Suspense>
          </AnimatedSection>
        </div>
      </section>

      {/* Section d'informations */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <AnimatedSection
            animation="fade-in"
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-serif text-[#161e2c] mb-6">
              Informations utiles
            </h2>
            <div className="h-1 w-16 bg-[#c8b273] mb-8 mx-auto"></div>
            <p className="text-dark mb-6">
              Après soumission de votre demande de réservation, nous vous
              contacterons dans les 24 heures pour confirmer la disponibilité et
              finaliser les détails de votre croisière.
            </p>
            <p className="text-dark mb-6">
              Un acompte de 30% sera demandé pour confirmer la réservation, le
              solde étant à régler le jour de la croisière.
            </p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-12">
            <AnimatedSection
              animation="zoom-in"
              delay={300}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              <div className="mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-[#161e2c] mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-[#161e2c] mb-2">
                Heure de départ
              </h3>
              <p className="text-dark">
                Les départs se font du port de Bonifacio. Merci d'arriver 15
                minutes avant l'horaire prévu.
              </p>
            </AnimatedSection>
            
            <AnimatedSection
              animation="zoom-in"
              delay={500}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              <div className="mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-[#161e2c] mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-[#161e2c] mb-2">
                Paiement
              </h3>
              <p className="text-dark mb-3">
                Nous acceptons les moyens de paiement suivants :
              </p>
              <ul className="text-dark text-left pl-4 space-y-1">
                <li>• Cartes bancaires (Visa, Mastercard)</li>
                <li>• PayPal</li>
                <li>• Stripe</li>
                <li>• Espèces (sur place uniquement)</li>
                <li>• Virements bancaires (IBAN fourni après confirmation)</li>
                <li>• Chèques vacances ANCV</li>
              </ul>
              <p className="text-dark mt-3 text-sm">
                L'acompte peut être réglé en ligne ou par virement. Le solde est à régler le jour de la croisière.
              </p>
            </AnimatedSection>
            
            <AnimatedSection
              animation="zoom-in"
              delay={700}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              <div className="mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-[#161e2c] mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-[#161e2c] mb-2">
                Confirmation
              </h3>
              <p className="text-dark">
                Une confirmation par email vous sera envoyée dès la validation
                de votre réservation.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
} 
