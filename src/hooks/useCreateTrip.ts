import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { calculateFare } from '../utils/fareCalculator';
import { validateRoute } from '../utils/validation';
import { ALL_STATIONS } from '../data/stations';

interface CreateTripData {
  pickup: string;
  dropoff: string;
  date: string;
  availableSeats: number;
}

export function useCreateTrip() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const createTrip = async (data: CreateTripData) => {
    if (!user) {
      toast.error('You must be logged in to create a trip');
      return null;
    }

    const routeValidation = validateRoute(data.pickup, data.dropoff);
    if (!routeValidation.valid) {
      toast.error(routeValidation.error);
      return null;
    }

    const pickupStation = ALL_STATIONS.find(s => s.id === data.pickup);
    const dropoffStation = ALL_STATIONS.find(s => s.id === data.dropoff);

    if (!pickupStation || !dropoffStation) {
      toast.error('Invalid pickup or dropoff location');
      return null;
    }

    setLoading(true);
    try {
      const tripData = {
        creatorId: user.uid,
        pickup: pickupStation,
        dropoff: dropoffStation,
        scheduledFor: new Date(data.date),
        maxPassengers: 4,
        currentPassengers: 1,
        availableSeats: data.availableSeats,
        participants: [user.uid],
        status: 'open',
        fare: calculateFare(pickupStation, dropoffStation),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'trips'), tripData);
      toast.success('Trip created successfully!');
      return docRef.id;
    } catch (error: any) {
      console.error('Error creating trip:', error);
      toast.error(
        error.code === 'permission-denied'
          ? 'You do not have permission to create trips'
          : 'Failed to create trip'
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createTrip, loading };
}