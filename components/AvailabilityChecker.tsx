import { useState, useEffect } from 'react';

interface AvailabilityCheckerProps {
  date: string;
  type: string;
  formule: string;
  onAvailabilityChange: (isAvailable: boolean) => void;
}

const AvailabilityChecker: React.FC<AvailabilityCheckerProps> = ({
  date,
  type,
  formule,
  onAvailabilityChange
}) => {
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Ne rien faire si tous les champs ne sont pas remplis
    if (!date || !type || !formule) {
      return;
    }

    const checkAvailability = async () => {
      setLoading(true);
      setError('');
      
      try {
        // En production, cela ferait un appel API pour vérifier la disponibilité réelle
        // Pour l'instant, nous simulons avec un délai et une vérification aléatoire
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Pour tester, on peut rendre indisponible le 1er et 15ème jour de chaque mois
        const dayOfMonth = new Date(date).getDate();
        const isAvailable = !(dayOfMonth === 1 || dayOfMonth === 15);
        
        setAvailable(isAvailable);
        onAvailabilityChange(isAvailable);
      } catch (err) {
        console.error('Erreur lors de la vérification de disponibilité:', err);
        setError('Erreur lors de la vérification de disponibilité');
        setAvailable(false);
        onAvailabilityChange(false);
      } finally {
        setLoading(false);
      }
    };

    // Vérifier la disponibilité chaque fois que la date, le type ou la formule change
    checkAvailability();
  }, [date, type, formule, onAvailabilityChange]);

  if (!date || !type || !formule) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center mt-3 bg-blue-50 py-2 px-3 rounded-md animate-pulse border border-blue-100">
        <svg className="h-4 w-4 text-blue-500 mr-2 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-sm font-medium text-blue-700">Vérification de la disponibilité...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center mt-3 bg-red-50 py-2 px-3 rounded-md border border-red-100">
        <svg className="h-4 w-4 text-red-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
        <span className="text-sm font-medium text-red-700">{error}</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center mt-3 rounded-md py-2 px-3 transition-all ${
      available 
        ? 'bg-green-50 border border-green-100' 
        : 'bg-red-50 border border-red-100'
    }`}>
      {available ? (
        <svg className="h-4 w-4 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="h-4 w-4 text-red-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      )}
      <span className={`text-sm font-medium ${
        available ? 'text-green-700' : 'text-red-700'
      }`}>
        {available 
          ? 'Date disponible' 
          : 'Date non disponible. Veuillez en choisir une autre.'}
      </span>
    </div>
  );
};

export default AvailabilityChecker; 