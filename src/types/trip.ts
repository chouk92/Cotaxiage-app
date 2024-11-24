import { Location } from './booking';

export interface Trip {
  id: string;
  creatorId: string;
  participants: string[];
  pickup: Location;
  dropoff: Location;
  scheduledFor: Date;
  maxPassengers: number;
  currentPassengers: number;
  availableSeats: number;
  status: 'open' | 'full' | 'cancelled' | 'completed';
  fare: number;
  perPersonFare?: number;
  createdAt: Date;
  updatedAt: Date;
}