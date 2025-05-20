import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { supabase } from '@/utils/supabase/client';

// Configuration du transporteur d'emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'martinseddoh12@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'arthuriousk12',
  },
});

// Interface pour les données de réservation
interface ReservationData {
  type: string;
  formule: string;
  date: string;
  adults: number;
  children: number;
  nom: string;
  email: string;
  telephone: string;
  message?: string;
}

// Fonction pour calculer le prix total et l'acompte
const calculatePrices = (data: ReservationData) => {
  let basePrice = 0;
  let childPrice = 0;
  let isPrivate = false;

  // Tarifs selon le type de bateau et formule
  if (data.type === 'yacht') {
    if (data.formule === 'journee') {
      basePrice = 153;
      childPrice = 77;
    } else if (data.formule === 'golden') {
      basePrice = 128;
      childPrice = 64;
    } else if (data.formule.includes('privatisation')) {
      basePrice = 1020;
      childPrice = 0;
      isPrivate = true;
    }
  } else if (data.type === 'catamaran') {
    if (data.formule === 'journee') {
      basePrice = 128;
      childPrice = 64;
    } else if (data.formule === 'golden') {
      basePrice = 111;
      childPrice = 55;
    } else if (data.formule === 'basseseason') {
      basePrice = 102;
      childPrice = 51;
    } else if (data.formule.includes('privatisation')) {
      basePrice = 850;
      childPrice = 0;
      isPrivate = true;
    }
  }

  // Calcul du montant total
  const totalPrice = isPrivate
    ? basePrice
    : basePrice * data.adults + childPrice * data.children;
  
  // Calcul de l'acompte (30%)
  const deposit = Math.round(totalPrice * 0.3);

  return { totalPrice, deposit };
};

// Vérification de la disponibilité pour une date donnée
const checkAvailability = async (date: string, type: string, formule: string): Promise<boolean> => {
  try {
    // Si l'environnement est en développement et Supabase n'est pas configuré, on considère toujours disponible
    if (process.env.NODE_ENV === 'development' && (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
      return true;
    }

    // Vérifier d'abord si une entrée existe pour la date, type et formule spécifiés
    const { data, error } = await supabase
      .from('disponibilites')
      .select('places_disponibles')
      .eq('type', type)
      .eq('formule', formule)
      .eq('date', date)
      .single();

    if (error) {
      // Si aucune entrée n'existe, on suppose que la date est disponible
      if (error.code === 'PGRST116') {
        return true;
      }
      console.error('Erreur lors de la vérification de disponibilité:', error);
      return true; // En cas d'erreur, on considère disponible pour éviter de bloquer les réservations
    }

    // Si une entrée existe, vérifier s'il reste des places
    return data.places_disponibles > 0;
  } catch (error) {
    console.error('Erreur lors de la vérification de disponibilité:', error);
    return true; // En cas d'erreur, on considère disponible pour éviter de bloquer les réservations
  }
};

// Fonction pour envoyer un email à l'administrateur
const sendAdminEmail = async (data: ReservationData) => {
  const mailOptions = {
    from: process.env.EMAIL_USER || 'luxocean243@gmail.com',
    to: process.env.ADMIN_EMAIL || 'luxocean243@gmail.com',
    subject: 'Nouvelle demande de réservation',
    html: `
      <h1>Nouvelle demande de réservation</h1>
      <p><strong>Nom:</strong> ${data.nom}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Téléphone:</strong> ${data.telephone}</p>
      <p><strong>Type de bateau:</strong> ${data.type === 'yacht' ? 'Yacht (El Corazon)' : 'Catamaran (Le Layla)'}</p>
      <p><strong>Formule:</strong> ${data.formule}</p>
      <p><strong>Date:</strong> ${data.date}</p>
      <p><strong>Adultes:</strong> ${data.adults}</p>
      <p><strong>Enfants:</strong> ${data.children}</p>
      ${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ''}
    `,
  };

  return transporter.sendMail(mailOptions);
};

// Fonction pour envoyer un email de confirmation au client
const sendClientEmail = async (data: ReservationData, totalPrice: number, deposit: number) => {
  const mailOptions = {
    from: process.env.EMAIL_USER || 'luxocean243@gmail.com ',
    to: data.email,
    subject: 'Confirmation de votre demande de réservation - Ocean Lux',
    html: `
      <h1>Confirmation de votre demande de réservation</h1>
      <p>Cher(e) ${data.nom},</p>
      <p>Nous avons bien reçu votre demande de réservation pour :</p>
      <ul>
        <li><strong>Type de bateau:</strong> ${data.type === 'yacht' ? 'Yacht (El Corazon)' : 'Catamaran (Le Layla)'}</li>
        <li><strong>Formule:</strong> ${data.formule}</li>
        <li><strong>Date:</strong> ${data.date}</li>
        <li><strong>Nombre de participants:</strong> ${data.adults} adulte(s) et ${data.children} enfant(s)</li>
      </ul>
      <p><strong>Montant total:</strong> ${totalPrice} €</p>
      <p><strong>Acompte à payer (30%):</strong> ${deposit} €</p>
      <p>Notre équipe vous contactera dans les 24 heures pour confirmer la disponibilité et finaliser les détails de votre croisière.</p>
      <p>Un acompte de 30% sera demandé pour confirmer votre réservation, le solde étant à régler le jour de la croisière.</p>
      
      <h3>Moyens de paiement acceptés :</h3>
      <ul>
        <li>Cartes bancaires (Visa, Mastercard)</li>
        <li>PayPal</li>
        <li>Stripe</li>
        <li>Espèces (sur place uniquement)</li>
        <li>Virements bancaires (IBAN fourni après confirmation)</li>
        <li>Chèques vacances ANCV</li>
      </ul>
      
      <p>Cordialement,</p>
      <p>L'équipe Ocean Lux</p>
      <p><a href="https://www.briseis-croisieres.com">www.OceanLux.com</a></p>
      <p>Tel: +33 7 73 73 87 37</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export async function POST(request: Request) {
  try {
    const data: ReservationData = await request.json();
    
    // Validation des données
    if (!data.type || !data.formule || !data.date || !data.adults || !data.nom || !data.email || !data.telephone) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      );
    }
    
    // Vérification de la disponibilité
    const available = await checkAvailability(data.date, data.type, data.formule);
    
    if (!available) {
      return NextResponse.json(
        { error: 'La date sélectionnée n\'est pas disponible pour cette croisière' },
        { status: 409 }
      );
    }
    
    // Calcul des prix
    const { totalPrice, deposit } = calculatePrices(data);
    
    // Enregistrement de la réservation dans Supabase
    let reservationData = null;
    
    try {
      if (process.env.NODE_ENV !== 'development' || (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
        const { data: supabaseData, error: reservationError } = await supabase
      .from('reservations')
      .insert([
        {
          type: data.type,
          formule: data.formule,
          date_reservation: data.date,
          adults: data.adults,
          children: data.children,
          nom: data.nom,
          email: data.email,
          telephone: data.telephone,
          message: data.message || '',
          statut: 'en_attente',
          montant_total: totalPrice,
          montant_acompte: deposit,
          acompte_paye: false
        }
      ])
      .select();
    
    if (reservationError) {
      console.error('Erreur lors de l\'enregistrement de la réservation:', reservationError);
        } else {
          reservationData = supabaseData ? supabaseData[0] : null;
        }
      } else {
        // Mode développement sans Supabase - on crée une réservation fictive
        reservationData = {
          id: Math.floor(Math.random() * 1000),
          type: data.type,
          formule: data.formule,
          date_reservation: data.date,
          adults: data.adults,
          children: data.children,
          nom: data.nom,
          email: data.email,
          telephone: data.telephone,
          message: data.message || '',
          statut: 'en_attente',
          montant_total: totalPrice,
          montant_acompte: deposit,
          acompte_paye: false,
          created_at: new Date().toISOString()
        };
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la réservation:', error);
      // On continue même si l'enregistrement échoue
    }
    
    // Mise à jour des disponibilités (si la table existe et si Supabase est configuré)
    try {
      if (process.env.NODE_ENV !== 'development' || (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) {
      // Vérifier si une entrée existe pour cette date
      const { data: dispoData } = await supabase
        .from('disponibilites')
        .select('id, places_disponibles')
        .eq('type', data.type)
        .eq('formule', data.formule)
        .eq('date', data.date)
        .single();
      
      if (dispoData) {
        // Si l'entrée existe, décrémenter le nombre de places disponibles
        await supabase
          .from('disponibilites')
          .update({ places_disponibles: dispoData.places_disponibles - 1 })
          .eq('id', dispoData.id);
        }
      }
    } catch (error) {
      // Ignorer les erreurs liées aux disponibilités
      console.log('Note: La table disponibilites n\'existe peut-être pas encore');
    }
    
    // Envoi des emails
    try {
      await Promise.all([
        sendAdminEmail(data),
        sendClientEmail(data, totalPrice, deposit)
      ]);
    } catch (emailError) {
      console.error('Erreur lors de l\'envoi des emails:', emailError);
      // Continuer même si l'envoi d'email échoue
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Demande de réservation envoyée avec succès',
      reservation: reservationData
    });
    
  } catch (error) {
    console.error('Erreur lors du traitement de la réservation:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors du traitement de votre demande' },
      { status: 500 }
    );
  }
} 