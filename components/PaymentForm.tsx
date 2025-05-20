'use client';
import { useState, useEffect } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getStripe } from '@/utils/stripe';

interface PaymentFormProps {
  amount: number;
  reservationId: number | string;
  customerEmail: string;
  customerName: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

// Formulaire de paiement interne
const CheckoutForm = ({ amount, reservationId, customerEmail, customerName, onSuccess, onError }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      });

      if (error) {
        setErrorMessage(error.message || 'Une erreur est survenue lors du paiement.');
        onError(error.message || 'Une erreur est survenue lors du paiement.');
      } else {
        onSuccess();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue.';
      setErrorMessage(message);
      onError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 bg-blue-50 rounded-lg mb-4">
        <p className="text-blue-800 font-medium text-sm">Montant à payer: {amount.toFixed(2)}€</p>
      </div>
      
      <PaymentElement />
      
      {errorMessage && (
        <div className="p-4 bg-red-50 rounded-lg">
          <p className="text-red-800">{errorMessage}</p>
        </div>
      )}
      
      <button
        type="submit"
        disabled={!stripe || isLoading}
        className={`w-full px-6 py-3 rounded-full text-white shadow-md transition-all ${
          isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#c8b273] hover:bg-[#b6a267]'
        }`}
      >
        {isLoading ? 'Traitement...' : 'Payer maintenant'}
      </button>
    </form>
  );
};

// Wrapper avec l'initialisation de Stripe
const PaymentForm = ({ amount, reservationId, customerEmail, customerName, onSuccess, onError }: PaymentFormProps) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount,
            reservation_id: reservationId,
            customer_email: customerEmail,
            customer_name: customerName,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Impossible de créer l\'intention de paiement');
        }

        setClientSecret(data.clientSecret);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Une erreur est survenue.';
        setError(message);
        onError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentIntent();
  }, [amount, reservationId, customerEmail, customerName, onError]);

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#c8b273]"></div>
        <p className="mt-4 text-gray-600">Préparation du paiement...</p>
      </div>
    );
  }

  if (error || !clientSecret) {
    return (
      <div className="p-6 bg-red-50 rounded-lg">
        <p className="text-red-800 font-medium">Erreur lors de l'initialisation du paiement:</p>
        <p className="text-red-700">{error || 'Impossible de créer la session de paiement.'}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  const stripeOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#c8b273',
      },
    },
  };

  return (
    <div className="payment-form-container">
      <Elements stripe={getStripe()} options={stripeOptions}>
        <CheckoutForm
          amount={amount}
          reservationId={reservationId}
          customerEmail={customerEmail}
          customerName={customerName}
          onSuccess={onSuccess}
          onError={onError}
        />
      </Elements>
    </div>
  );
};

export default PaymentForm; 