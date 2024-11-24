import { ALL_STATIONS } from '../data/stations';

export function validateRoute(pickupId: string, dropoffId: string) {
  const pickup = ALL_STATIONS.find(s => s.id === pickupId);
  const dropoff = ALL_STATIONS.find(s => s.id === dropoffId);

  if (!pickup || !dropoff) {
    return { 
      valid: false, 
      error: 'Point de départ ou d\'arrivée invalide' 
    };
  }

  const isValidRoute = (
    (pickup.type === 'airport' && (dropoff.type === 'train' || dropoff.type === 'taxi')) ||
    ((pickup.type === 'train' || pickup.type === 'taxi') && dropoff.type === 'airport')
  );

  if (!isValidRoute) {
    return { 
      valid: false, 
      error: 'Les trajets doivent être entre un aéroport et une gare/station' 
    };
  }

  return { valid: true };
}

export function validatePassengers(count: number, isCreator: boolean = false): {
  valid: boolean;
  error?: string;
} {
  const maxPassengers = isCreator ? 4 : 3;
  
  if (count < 1 || count > maxPassengers) {
    return {
      valid: false,
      error: `Maximum ${maxPassengers} passagers autorisés${isCreator ? ' (vous inclus)' : ''}`
    };
  }
  
  return { valid: true };
}

export function validateDateTime(date: Date): {
  valid: boolean;
  error?: string;
} {
  const now = new Date();
  const minTime = new Date(now.getTime() + 30 * 60000); // +30 minutes
  
  if (date < minTime) {
    return {
      valid: false,
      error: 'La réservation doit être faite au moins 30 minutes à l\'avance'
    };
  }

  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  
  if (date > maxDate) {
    return {
      valid: false,
      error: 'La réservation ne peut pas être faite plus de 3 mois à l\'avance'
    };
  }

  return { valid: true };
}

export function validatePaymentDetails(cardNumber: string, expiryDate: string, cvc: string): {
  valid: boolean;
  error?: string;
} {
  // Validation du numéro de carte
  if (!/^\d{16}$/.test(cardNumber)) {
    return {
      valid: false,
      error: 'Numéro de carte invalide'
    };
  }

  // Validation de la date d'expiration
  if (!/^\d{4}$/.test(expiryDate)) {
    return {
      valid: false,
      error: 'Date d\'expiration invalide'
    };
  }

  const month = parseInt(expiryDate.substring(0, 2));
  const year = parseInt('20' + expiryDate.substring(2, 4));
  const now = new Date();

  if (month < 1 || month > 12 || 
      year < now.getFullYear() || 
      (year === now.getFullYear() && month < now.getMonth() + 1)) {
    return {
      valid: false,
      error: 'Date d\'expiration invalide'
    };
  }

  // Validation du CVC
  if (!/^\d{3}$/.test(cvc)) {
    return {
      valid: false,
      error: 'CVC invalide'
    };
  }

  return { valid: true };
}