"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';

interface Disponibilite {
  id: number;
  type: string;
  formule: string;
  date: string;
  places_disponibles: number;
}

export default function DisponibilitesPage() {
  const [disponibilites, setDisponibilites] = useState<Disponibilite[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    type: 'yacht',
    formule: 'journee',
    date: '',
    places_disponibles: 10
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchDisponibilites();
  }, []);

  const fetchDisponibilites = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('disponibilites')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      
      setDisponibilites(data || []);
    } catch (err: any) {
      console.error('Erreur lors du chargement des disponibilités:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'places_disponibles' ? parseInt(value) : value
    });
  };

  const resetForm = () => {
    setFormData({
      type: 'yacht',
      formule: 'journee',
      date: '',
      places_disponibles: 10
    });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleEdit = (dispo: Disponibilite) => {
    setFormData({
      type: dispo.type,
      formule: dispo.formule,
      date: dispo.date,
      places_disponibles: dispo.places_disponibles
    });
    setIsEditing(true);
    setEditingId(dispo.id);
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    resetForm();
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (isEditing && editingId) {
        // Mise à jour d'une disponibilité existante
        const { error } = await supabase
          .from('disponibilites')
          .update({ 
            type: formData.type,
            formule: formData.formule,
            date: formData.date,
            places_disponibles: formData.places_disponibles 
          })
          .eq('id', editingId);

        if (error) throw error;
        setSuccess('Disponibilité mise à jour avec succès !');
        resetForm();
      } else {
        // Vérifier si une disponibilité existe déjà pour cette date, type et formule
        const { data: existingData } = await supabase
          .from('disponibilites')
          .select('id')
          .eq('type', formData.type)
          .eq('formule', formData.formule)
          .eq('date', formData.date);

        if (existingData && existingData.length > 0) {
          // Mettre à jour la disponibilité existante
          const { error } = await supabase
            .from('disponibilites')
            .update({ places_disponibles: formData.places_disponibles })
            .eq('id', existingData[0].id);

          if (error) throw error;
          setSuccess('Disponibilité mise à jour avec succès !');
        } else {
          // Créer une nouvelle disponibilité
          const { error } = await supabase
            .from('disponibilites')
            .insert([
              {
                type: formData.type,
                formule: formData.formule,
                date: formData.date,
                places_disponibles: formData.places_disponibles
              }
            ]);

          if (error) throw error;
          setSuccess('Disponibilité ajoutée avec succès !');
        }
        resetForm();
      }

      // Recharger les disponibilités
      fetchDisponibilites();
    } catch (err: any) {
      console.error('Erreur lors de l\'ajout/mise à jour de la disponibilité:', err);
      setError(err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette disponibilité ?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('disponibilites')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSuccess('Disponibilité supprimée avec succès !');
      // Recharger les disponibilités
      fetchDisponibilites();
    } catch (err: any) {
      console.error('Erreur lors de la suppression de la disponibilité:', err);
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

  const getFormuleLabel = (formule: string): string => {
    switch (formule) {
      case 'journee': return 'Journée en mer';
      case 'golden': return 'Golden Hour';
      case 'privatisation': return 'Privatisation';
      case 'basseseason': return 'Offre basse saison';
      default: return formule;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-light tracking-wide text-[#161e2c]">
            Gestion des disponibilités
          </h1>
          <button 
            onClick={resetForm}
            className="px-4 py-2 bg-[#c8b273] text-white rounded-md hover:bg-[#b6a267] transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Nouvelle disponibilité
          </button>
        </div>

        {/* Messages de notification */}
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4 border-l-4 border-red-500 flex items-start">
            <svg className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-red-800">Erreur</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}
        
        {success && (
          <div className="mb-6 rounded-md bg-green-50 p-4 border-l-4 border-green-500 flex items-start">
            <svg className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-green-800">Succès</h3>
              <p className="mt-1 text-sm text-green-700">{success}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire d'ajout/modification */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-light text-[#161e2c] mb-6 flex items-center">
                {isEditing ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#c8b273]" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Modifier une disponibilité
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#c8b273]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Ajouter une disponibilité
                  </>
                )}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    Type de bateau
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8b273] focus:border-transparent"
                    required
                  >
                    <option value="yacht">Yacht (El Corazon)</option>
                    <option value="catamaran">Catamaran (Le Layla)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="formule" className="block text-sm font-medium text-gray-700 mb-1">
                    Formule
                  </label>
                  <select
                    id="formule"
                    name="formule"
                    value={formData.formule}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8b273] focus:border-transparent"
                    required
                  >
                    <option value="journee">Journée en mer</option>
                    <option value="golden">Golden Hour</option>
                    <option value="privatisation">Privatisation</option>
                    {formData.type === "catamaran" && (
                      <option value="basseseason">Offre basse saison</option>
                    )}
                  </select>
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c8b273] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="places_disponibles" className="block text-sm font-medium text-gray-700 mb-1">
                    Places disponibles
                  </label>
                  <div className="flex items-center">
                    <button 
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev, 
                        places_disponibles: Math.max(0, prev.places_disponibles - 1)
                      }))}
                      className="p-2.5 bg-gray-100 border border-gray-300 rounded-l-md"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <input
                      type="number"
                      id="places_disponibles"
                      name="places_disponibles"
                      value={formData.places_disponibles}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      className="w-full p-2.5 border-y border-gray-300 text-center focus:outline-none focus:ring-0"
                      required
                    />
                    <button 
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev, 
                        places_disponibles: Math.min(100, prev.places_disponibles + 1)
                      }))}
                      className="p-2.5 bg-gray-100 border border-gray-300 rounded-r-md"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#c8b273] text-white rounded-md hover:bg-[#b6a267] transition-colors"
                  >
                    {isEditing ? 'Mettre à jour' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Liste des disponibilités */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-light text-[#161e2c] mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#c8b273]" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Disponibilités actuelles
              </h2>
              
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <svg className="animate-spin h-8 w-8 text-[#c8b273]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : disponibilites.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                  </svg>
                  <p className="text-gray-500">Aucune disponibilité enregistrée.</p>
                  <p className="text-sm text-gray-400 mt-2">Ajoutez votre première disponibilité à l'aide du formulaire.</p>
                </div>
              ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Formule</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Places</th>
                        <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {disponibilites.map((dispo) => (
                        <tr key={dispo.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className={`h-2 w-2 rounded-full mr-2 ${dispo.type === 'yacht' ? 'bg-blue-500' : 'bg-green-500'}`}></span>
                              <span className="font-medium text-gray-900">
                                {dispo.type === 'yacht' ? 'Yacht' : 'Catamaran'}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                            {getFormuleLabel(dispo.formule)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                            {formatDate(dispo.date)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              dispo.places_disponibles > 5 
                                ? 'bg-green-100 text-green-800' 
                                : dispo.places_disponibles > 0
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                            }`}>
                              {dispo.places_disponibles}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEdit(dispo)}
                              className="text-[#c8b273] hover:text-[#b6a267] mr-3"
                              title="Modifier"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(dispo.id)}
                              className="text-red-500 hover:text-red-700"
                              title="Supprimer"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
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
      </div>
    </div>
  );
} 