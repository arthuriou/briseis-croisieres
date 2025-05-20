import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Vérifier si Stripe est configuré
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_votreCleSecreteStripe';
const isStripeConfigured = stripeSecretKey !== 'sk_test_votreCleSecreteStripe';

// Initialisez Stripe avec votre clé secrète
const stripe = isStripeConfigured 
  ? new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' })
  : null;

export async function POST(request: Request) {
  try {
    const { amount, reservation_id, customer_email, customer_name } = await request.json();

    // Si nous sommes en développement et que Stripe n'est pas configuré, utilisons un mode de simulation
    if (process.env.NODE_ENV === 'development' && !isStripeConfigured) {
      console.log('Mode développement: Création d\'une intention de paiement simulée');
      
      // Simuler un délai pour l'API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Générer un ID et un secret aléatoires pour simuler Stripe
      const fakePaymentIntentId = `pi_dev_${Math.random().toString(36).substring(2, 15)}`;
      const fakeClientSecret = `${fakePaymentIntentId}_secret_${Math.random().toString(36).substring(2, 15)}`;
      
      return NextResponse.json({ 
        clientSecret: fakeClientSecret,
        paymentIntentId: fakePaymentIntentId,
        mode: 'development'
      });
    }

    // En production ou si Stripe est configuré, utiliser l'API Stripe
    if (!stripe) {
      throw new Error('Stripe n\'est pas configuré correctement');
    }

    // Créez une intention de paiement avec Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe utilise les centimes
      currency: 'eur',
      metadata: {
        reservation_id,
      },
      receipt_email: customer_email,
      description: `Acompte pour réservation #${reservation_id}`,
      payment_method_types: ['card'],
      // Activez PayPal uniquement si vous avez configuré cette option dans votre dashboard Stripe
      // payment_method_types: ['card', 'paypal'],
    });

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'intention de paiement:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'intention de paiement' },
      { status: 500 }
    );
  }
} 