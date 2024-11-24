export interface Location {
  lat: number;
  lng: number;
  address: string;
  id?: string;
  name?: string;
}

export interface Booking {
  id: string;
  userId: string;
  pickup: Location;
  dropoff: Location;
  scheduledFor: Date;
  passengers: number;
  fare: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  driverId?: string;
}