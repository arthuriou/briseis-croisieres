import React from 'react';
import Image from 'next/image';

interface ReservationData {
  type: string;
  formule: string;
  date: string;
  adults: number;
  children: number;
  nom?: string;
  email?: string;
  telephone?: string;
}

interface ReservationSummaryProps {
  data: ReservationData;
  showPersonalInfo?: boolean;
}

const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

// Fonction pour déterminer le prix en fonction du type et de la formule
const getPriceInfo = (type: string, formule: string) => {
  if (type === 'yacht') {
    if (formule === 'journee') return { basePrice: 153, childPrice: 77 };
    if (formule === 'golden') return { basePrice: 128, childPrice: 64 };
    if (formule.includes('privatisation')) return { basePrice: 1020, childPrice: 0, isPrivate: true };
  } else if (type === 'catamaran') {
    if (formule === 'journee') return { basePrice: 128, childPrice: 64 };
    if (formule === 'golden') return { basePrice: 111, childPrice: 55 };
    if (formule === 'basseseason') return { basePrice: 102, childPrice: 51 };
    if (formule.includes('privatisation')) return { basePrice: 850, childPrice: 0, isPrivate: true };
  }
  return { basePrice: 0, childPrice: 0 };
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

const ReservationSummary: React.FC<ReservationSummaryProps> = ({ 
  data, 
  showPersonalInfo = false 
}) => {
  const { basePrice, childPrice, isPrivate } = getPriceInfo(data.type, data.formule);
  
  const totalPrice = isPrivate 
    ? basePrice 
    : (basePrice * data.adults) + (childPrice * data.children);
  
  const deposit = Math.round(totalPrice * 0.3);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="relative">
        {data.type === 'yacht' ? (
          <Image 
            src="/images/yacht-summary.jpg" 
            alt="Yacht El Corazon" 
            width={1200} 
            height={400}
            className="w-full h-48 object-cover"
          />
        ) : (
          <Image 
            src="/images/catamaran-summary.jpg" 
            alt="Catamaran Le Layla" 
            width={1200} 
            height={400}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 flex items-end">
          <div className="p-6 text-white">
            <h3 className="text-2xl font-light tracking-wide">
              {data.type === 'yacht' ? 'Yacht El Corazon' : 'Catamaran Le Layla'}
            </h3>
            <p className="text-white/80 font-light">{getFormuleLabel(data.formule)}</p>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-5">
        <h4 className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-4">Détails de la réservation</h4>
        
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Date</p>
            <p className="font-medium text-[#161e2c]">{formatDate(data.date)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Participants</p>
            <p className="font-medium text-[#161e2c]">
              {data.adults} <span className="text-gray-600 font-normal">adulte{data.adults > 1 ? 's' : ''}</span>
              {data.children > 0 && <>, {data.children} <span className="text-gray-600 font-normal">enfant{data.children > 1 ? 's' : ''}</span></>}
            </p>
          </div>
        </div>
      </div>
      
      {showPersonalInfo && data.nom && data.email && data.telephone && (
        <div className="px-6 pb-5 border-t border-gray-100 pt-5">
          <h4 className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-4">Vos coordonnées</h4>
          <div className="space-y-2">
            <p className="text-sm text-[#161e2c] flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              {data.nom}
            </p>
            <p className="text-sm text-[#161e2c] flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              {data.email}
            </p>
            <p className="text-sm text-[#161e2c] flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              {data.telephone}
            </p>
          </div>
        </div>
      )}
      
      <div className="px-6 py-5 bg-gray-50 border-t border-gray-100">
        <div className="flex justify-between items-center text-sm mb-2">
          <span className="text-gray-600">Prix de base</span>
          <span className="font-medium">{isPrivate ? basePrice : `${basePrice}€ × ${data.adults}`}</span>
        </div>
        
        {!isPrivate && data.children > 0 && (
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-gray-600">Enfants</span>
            <span className="font-medium">{`${childPrice}€ × ${data.children}`}</span>
          </div>
        )}
        
        <div className="border-t border-gray-200 my-3 pt-3 flex justify-between items-center">
          <span className="font-medium">Montant total</span>
          <span className="font-semibold text-lg text-[#161e2c]">{totalPrice} €</span>
        </div>
        
        <div className="bg-[#f9f6e8] -mx-6 px-6 py-4 mt-4 border-t border-[#e9e1c3]">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[#9a885a] font-medium">Acompte à payer (30%)</span>
            <span className="font-semibold text-[#c8b273]">{deposit} €</span>
          </div>
          <div className="flex justify-between items-center text-xs text-[#9a885a]">
            <span>Solde à régler le jour de la croisière</span>
            <span>{totalPrice - deposit} €</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationSummary; 