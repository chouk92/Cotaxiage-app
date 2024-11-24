import { Location } from '../types/booking';
import { ALL_STATIONS } from '../data/stations';

const FIXED_RATES = {
  CDG: {
    rightBank: 56,
    leftBank: 65
  },
  ORLY: {
    rightBank: 44,
    leftBank: 36
  }
} as const;

type Airport = keyof typeof FIXED_RATES;

function isAirport(stationId: string): Airport | null {
  if (stationId.toLowerCase().includes('cdg')) return 'CDG';
  if (stationId.toLowerCase().includes('orly')) return 'ORLY';
  return null;
}

function isLeftBank(location: Location): boolean {
  return location.lat < 48.8566; // Seine river latitude as boundary
}

export function calculateFare(pickup: Location, dropoff: Location): number {
  const pickupAirport = isAirport(pickup.id || '');
  const dropoffAirport = isAirport(dropoff.id || '');

  // If neither point is an airport, or both are airports, return 0 (invalid route)
  if ((!pickupAirport && !dropoffAirport) || (pickupAirport && dropoffAirport)) {
    return 0;
  }

  // Get the airport and determine if the other point is left or right bank
  const airport = pickupAirport || dropoffAirport;
  const nonAirportLocation = pickupAirport ? dropoff : pickup;
  const isLeft = isLeftBank(nonAirportLocation);

  // Get the fixed rate based on the bank and airport
  return FIXED_RATES[airport][isLeft ? 'leftBank' : 'rightBank'];
}

export function calculatePerPersonFare(totalFare: number, passengers: number): number {
  return Math.ceil(totalFare / Math.max(1, passengers));
}