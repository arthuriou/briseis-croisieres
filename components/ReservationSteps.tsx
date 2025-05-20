import React from 'react';

interface ReservationStepsProps {
  currentStep: number;
  totalSteps: number;
}

const ReservationSteps: React.FC<ReservationStepsProps> = ({
  currentStep,
  totalSteps
}) => {
  return (
    <div className="py-4 px-2">
      <div className="flex justify-between items-center mb-4">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <div 
                className={`flex-1 h-1 ${
                  index <= currentStep - 1 ? 'bg-[#c8b273]' : 'bg-gray-300'
                }`}
              />
            )}
            <div 
              className={`
                w-8 h-8 flex items-center justify-center rounded-full 
                ${
                  index < currentStep 
                    ? 'bg-[#c8b273] text-white'
                    : index === currentStep 
                    ? 'bg-white border-2 border-[#c8b273] text-[#c8b273]'
                    : 'bg-white border-2 border-gray-300 text-gray-400'
                }
              `}
            >
              {index + 1}
            </div>
          </React.Fragment>
        ))}
      </div>
      <div className="flex justify-between">
        <div className="text-sm font-medium text-[#c8b273]">Sélection</div>
        <div className={`text-sm font-medium ${currentStep >= 1 ? 'text-[#c8b273]' : 'text-gray-400'}`}>
          Détails
        </div>
        <div className={`text-sm font-medium ${currentStep >= 2 ? 'text-[#c8b273]' : 'text-gray-400'}`}>
          Confirmation
        </div>
      </div>
    </div>
  );
};

export default ReservationSteps; 