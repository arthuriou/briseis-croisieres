'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AnimatedSection from '@/components/AnimatedSection';

export default function PaymentSuccessPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'processing' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  
  useEffect(() => {
    const validatePayment = async () => {
      try {
        const paymentIntentId = searchParams.get('payment_intent');
        const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');
        
        if (!paymentIntentId || !paymentIntentClientSecret) {
          setPaymentStatus('error');
          setErrorMessage('Informations de paiement manquantes');
          setIsLoading(false);
          return;
        }
        
        // Vous pourriez vérifier le statut du paiement côté serveur ici
        // Mais pour l'instant, nous considérons que la redirection vers cette page signifie que le paiement a réussi
        setPaymentStatus('success');
      } catch (error) {
        console.error('Erreur lors de la vérification du paiement:', error);
        setPaymentStatus('error');
        setErrorMessage('Erreur lors de la vérification du paiement');
      } finally {
        setIsLoading(false);
      }
    };
    
    validatePayment();
  }, [searchParams]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#c8b273]"></div>
        <p className="mt-6 text-lg text-gray-600">Vérification de votre paiement...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <AnimatedSection
          animation="fade-in"
          className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-lg shadow-lg"
        >
          {paymentStatus === 'success' && (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              
              <h1 className="text-3xl font-serif text-center text-[#161e2c] mb-4">
                Paiement effectué avec succès !
              </h1>
              
              <p className="text-center text-gray-600 mb-8">
                Nous avons bien reçu votre paiement. Un email de confirmation vous a été envoyé.
                Notre équipe vous contactera prochainement pour finaliser les détails de votre réservation.
              </p>
              
              <div className="text-center">
                <Link
                  href="/"
                  className="inline-block bg-[#c8b273] text-white px-8 py-3 rounded-full hover:bg-[#b6a267] transition-all"
                >
                  Retour à l'accueil
                </Link>
              </div>
            </>
          )}
          
          {paymentStatus === 'processing' && (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              
              <h1 className="text-3xl font-serif text-center text-[#161e2c] mb-4">
                Paiement en cours de traitement
              </h1>
              
              <p className="text-center text-gray-600 mb-8">
                Votre paiement est en cours de traitement. Vous recevrez un email de confirmation
                dès que le paiement sera validé.
              </p>
              
              <div className="text-center">
                <Link
                  href="/"
                  className="inline-block bg-[#c8b273] text-white px-8 py-3 rounded-full hover:bg-[#b6a267] transition-all"
                >
                  Retour à l'accueil
                </Link>
              </div>
            </>
          )}
          
          {paymentStatus === 'error' && (
            <>
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              
              <h1 className="text-3xl font-serif text-center text-[#161e2c] mb-4">
                Problème lors du paiement
              </h1>
              
              <p className="text-center text-gray-600 mb-2">
                Une erreur est survenue lors du traitement de votre paiement :
              </p>
              
              <p className="text-center text-red-600 mb-8">
                {errorMessage || "Erreur inconnue, veuillez réessayer ou nous contacter."}
              </p>
              
              <div className="text-center space-x-4">
                <Link
                  href="/reserver"
                  className="inline-block bg-[#c8b273] text-white px-8 py-3 rounded-full hover:bg-[#b6a267] transition-all"
                >
                  Réessayer
                </Link>
                
                <Link
                  href="/contact"
                  className="inline-block border-2 border-[#161e2c] text-[#161e2c] px-8 py-3 rounded-full hover:bg-[#161e2c] hover:text-white transition-all"
                >
                  Nous contacter
                </Link>
              </div>
            </>
          )}
        </AnimatedSection>
      </div>
    </div>
  );
} 