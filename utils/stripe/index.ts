import { loadStripe } from '@stripe/stripe-js';

// Remplacez cette chaîne par votre clé publique Stripe
const stripePublicKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || 'pk_test_votreClePubliqueStripe';
 
export const getStripe = () => {
  return loadStripe(stripePublicKey);
}; 