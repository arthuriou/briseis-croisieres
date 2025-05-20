import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/utils/supabase/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_votreCleSecreteStripe', {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_votreSecretWebhook';

export async function POST(request: Request) {
  // En mode développement sans clé webhook, on accepte tout
  if (process.env.NODE_ENV === 'development' && webhookSecret === 'whsec_votreSecretWebhook') {
    console.log('Mode développement: Webhook simulé accepté');
    return NextResponse.json({ received: true });
  }

  const payload = await request.text();
  const signature = request.headers.get('stripe-signature') as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    console.error(`Erreur de signature webhook: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    return NextResponse.json({ error: 'Signature invalide' }, { status: 400 });
  }

  // Gestion des événements
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    
    // Récupérer l'ID de la réservation depuis les métadonnées
    const reservationId = paymentIntent.metadata.reservation_id;
    
    if (reservationId) {
      try {
        // Vérifier si Supabase est configuré
        if (process.env.NODE_ENV !== 'development' || (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
          // Mettre à jour le statut de paiement dans la base de données
          const { error } = await supabase
            .from('reservations')
            .update({ 
              acompte_paye: true,
              statut: 'confirmee',
              stripe_payment_id: paymentIntent.id
            })
            .eq('id', reservationId);
            
          if (error) {
            console.error('Erreur lors de la mise à jour de la réservation:', error);
          }
        } else {
          console.log(`Mode développement: Paiement simulé confirmé pour la réservation #${reservationId}`);
        }
      } catch (err) {
        console.error('Erreur lors du traitement du paiement réussi:', err);
      }
    }
  }

  return NextResponse.json({ received: true });
} 