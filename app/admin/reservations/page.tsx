"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';

interface Reservation {
  id: number;
  type: string;
  formule: string;
  date_reservation: string;
  adults: number;
  children: number;
  nom: string;
  email: string;
  telephone: string;
  message: string | null;
  statut: string;
  montant_total: number;
  montant_acompte: number;
  acompte_paye: boolean;
  created_at: string;
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    fetchReservations();
  }, [statusFilter, dateFilter]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('reservations')
        .select('*');

      // Appliquer le filtre par statut
      if (statusFilter !== 'all') {
        query = query.eq('statut', statusFilter);
      }

      // Appliquer le filtre par date
      if (dateFilter === 'today') {
        query = query.eq('date_reservation', new Date().toISOString().split('T')[0]);
      } else if (dateFilter === 'future') {
        query = query.gte('date_reservation', new Date().toISOString().split('T')[0]);
      } else if (dateFilter === 'past') {
        query = query.lt('date_reservation', new Date().toISOString().split('T')[0]);
      }

      // Exécuter la requête et trier par date
      const { data, error } = await query.order('date_reservation', { ascending: true });

      if (error) throw error;
      
      setReservations(data || []);
    } catch (err: any) {
      console.error('Erreur lors du chargement des réservations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = async (id: number, newStatus: string) => {
    try {
      setError('');
      setSuccess('');

      const { error } = await supabase
        .from('reservations')
        .update({ statut: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      setSuccess(`Statut de la réservation #${id} mis à jour avec succès !`);
      fetchReservations();
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour du statut:', err);
      setError(err.message);
    }
  };

  const updatePaymentStatus = async (id: number, isPaid: boolean) => {
    try {
      setError('');
      setSuccess('');

      const { error } = await supabase
        .from('reservations')
        .update({ acompte_paye: isPaid })
        .eq('id', id);

      if (error) throw error;
      
      setSuccess(`Statut de paiement de la réservation #${id} mis à jour avec succès !`);
      fetchReservations();
    } catch (err: any) {
      console.error('Erreur lors de la mise à jour du statut de paiement:', err);
      setError(err.message);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-serif text-[#161e2c] mb-8 text-center">
          Gestion des réservations
        </h1>

        {/* Messages de succès ou d'erreur */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {/* Filtres */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-medium mb-4">Filtres</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="statusFilter" className="block text-gray-700 font-medium mb-2">
                Statut
              </label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8b273]"
              >
                <option value="all">Tous les statuts</option>
                <option value="en_attente">En attente</option>
                <option value="confirmee">Confirmée</option>
                <option value="annulee">Annulée</option>
              </select>
            </div>
            <div>
              <label htmlFor="dateFilter" className="block text-gray-700 font-medium mb-2">
                Date
              </label>
              <select
                id="dateFilter"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c8b273]"
              >
                <option value="all">Toutes les dates</option>
                <option value="today">Aujourd'hui</option>
                <option value="future">À venir</option>
                <option value="past">Passées</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des réservations */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-medium mb-6">Réservations</h2>
          
          {loading ? (
            <p className="text-center py-4">Chargement...</p>
          ) : reservations.length === 0 ? (
            <p className="text-center py-4">Aucune réservation trouvée.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Type</th>
                    <th className="px-4 py-2 text-left">Formule</th>
                    <th className="px-4 py-2 text-left">Client</th>
                    <th className="px-4 py-2 text-left">Contact</th>
                    <th className="px-4 py-2 text-left">Montant</th>
                    <th className="px-4 py-2 text-left">Acompte</th>
                    <th className="px-4 py-2 text-left">Statut</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((reservation) => (
                    <tr key={reservation.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">{reservation.id}</td>
                      <td className="px-4 py-3">{formatDate(reservation.date_reservation)}</td>
                      <td className="px-4 py-3 capitalize">
                        {reservation.type === 'yacht' ? 'Yacht (El Corazon)' : 'Catamaran (Le Layla)'}
                      </td>
                      <td className="px-4 py-3 capitalize">
                        {
                          reservation.formule === 'journee' ? 'Journée en mer' :
                          reservation.formule === 'golden' ? 'Golden Hour' :
                          reservation.formule === 'privatisation' ? 'Privatisation' :
                          'Offre basse saison'
                        }
                      </td>
                      <td className="px-4 py-3">
                        <div><strong>{reservation.nom}</strong></div>
                        <div>
                          {reservation.adults} {reservation.adults > 1 ? 'adultes' : 'adulte'}
                          {reservation.children > 0 && `, ${reservation.children} ${reservation.children > 1 ? 'enfants' : 'enfant'}`}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>{reservation.email}</div>
                        <div>{reservation.telephone}</div>
                      </td>
                      <td className="px-4 py-3">{formatPrice(reservation.montant_total)}</td>
                      <td className="px-4 py-3">
                        <div>{formatPrice(reservation.montant_acompte)}</div>
                        <div className="mt-1">
                          <button
                            onClick={() => updatePaymentStatus(reservation.id, !reservation.acompte_paye)}
                            className={`px-2 py-1 text-xs rounded ${
                              reservation.acompte_paye 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {reservation.acompte_paye ? 'Payé' : 'Non payé'}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded ${
                          reservation.statut === 'confirmee' 
                            ? 'bg-green-100 text-green-800' 
                            : reservation.statut === 'annulee'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {
                            reservation.statut === 'en_attente' ? 'En attente' :
                            reservation.statut === 'confirmee' ? 'Confirmée' :
                            'Annulée'
                          }
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => updateReservationStatus(reservation.id, 'confirmee')}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-xs"
                            disabled={reservation.statut === 'confirmee'}
                          >
                            Confirmer
                          </button>
                          <button
                            onClick={() => updateReservationStatus(reservation.id, 'annulee')}
                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                            disabled={reservation.statut === 'annulee'}
                          >
                            Annuler
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 