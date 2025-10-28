// Utilidades de validación para formularios

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validatePhone = (phone: string): boolean => {
  // Acepta formatos internacionales
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

export const validateLinkedIn = (url: string): boolean => {
  if (!url) return true; // Opcional
  return url.includes('linkedin.com/in/') || url.includes('linkedin.com/company/');
};

export const validateGitHub = (url: string): boolean => {
  if (!url) return true; // Opcional
  return url.includes('github.com/');
};

export const validateDateRange = (startDate: string, endDate?: string): boolean => {
  if (!startDate) return false;
  
  const start = new Date(startDate);
  if (isNaN(start.getTime())) return false;
  
  if (endDate) {
    const end = new Date(endDate);
    if (isNaN(end.getTime())) return false;
    return start <= end;
  }
  
  return true;
};

export const getValidationMessage = (field: string, type: 'email' | 'url' | 'phone' | 'date' | 'required'): string => {
  const messages = {
    email: `${field} debe ser un email válido`,
    url: `${field} debe ser una URL válida`,
    phone: `${field} debe ser un teléfono válido`,
    date: `${field} debe ser una fecha válida`,
    required: `${field} es requerido`,
  };
  
  return messages[type];
};
