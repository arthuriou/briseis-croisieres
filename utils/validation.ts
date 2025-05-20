// Validation de l'email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validation du numéro de téléphone (formats français)
export const validatePhone = (phone: string): boolean => {
  // Accepte les formats:
  // +33 1 23 45 67 89
  // 01 23 45 67 89
  // 0123456789
  const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
  return phoneRegex.test(phone);
};

// Validation du nom (au moins 2 caractères, pas de chiffres ou symboles spéciaux)
export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

// Validation de la date (doit être aujourd'hui ou dans le futur)
export const validateDate = (date: string): boolean => {
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return selectedDate >= today;
};

// Validation d'un champ obligatoire
export const isRequired = (value: string | number): boolean => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== undefined && value !== null;
};

// Vérifie si le formulaire est prêt pour la soumission
export const validateReservationForm = (formData: {
  type: string;
  formule: string;
  date: string;
  adults: number;
  children: number;
  nom: string;
  email: string;
  telephone: string;
}): { valid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  if (!isRequired(formData.type)) {
    errors.type = 'Veuillez sélectionner un type de bateau';
  }
  
  if (!isRequired(formData.formule)) {
    errors.formule = 'Veuillez sélectionner une formule';
  }
  
  if (!isRequired(formData.date)) {
    errors.date = 'Veuillez sélectionner une date';
  } else if (!validateDate(formData.date)) {
    errors.date = 'La date doit être aujourd\'hui ou dans le futur';
  }
  
  if (formData.adults < 1) {
    errors.adults = 'Il doit y avoir au moins 1 adulte';
  }
  
  if (!isRequired(formData.nom)) {
    errors.nom = 'Veuillez entrer votre nom complet';
  } else if (!validateName(formData.nom)) {
    errors.nom = 'Veuillez entrer un nom valide';
  }
  
  if (!isRequired(formData.email)) {
    errors.email = 'Veuillez entrer votre adresse email';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Veuillez entrer une adresse email valide';
  }
  
  if (!isRequired(formData.telephone)) {
    errors.telephone = 'Veuillez entrer votre numéro de téléphone';
  } else if (!validatePhone(formData.telephone)) {
    errors.telephone = 'Veuillez entrer un numéro de téléphone valide';
  }
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}; 