import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Trip } from '../types/trip';
import { toast } from 'react-hot-toast';

interface TripFilters {
  pickup?: string;
  dropoff?: string;
  fromDate?: Date;
  availableSeats?: number;
}

export function useTrips(filters?: TripFilters) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const tripsRef = collection(db, 'trips');
      let q = query(
        tripsRef,
        where('status', '==', 'open'),
        orderBy('scheduledFor', 'asc')
      );

      if (filters?.pickup) {
        q = query(q, where('pickup.id', '==', filters.pickup));
      }

      if (filters?.dropoff) {
        q = query(q, where('dropoff.id', '==', filters.dropoff));
      }

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          let tripsData = snapshot.docs
            .map(doc => ({
              id: doc.id,
              ...doc.data(),
              scheduledFor: doc.data().scheduledFor?.toDate() || new Date(),
              createdAt: doc.data().createdAt?.toDate() || new Date(),
              updatedAt: doc.data().updatedAt?.toDate() || new Date()
            } as Trip))
            .filter(trip => {
              if (filters?.fromDate && trip.scheduledFor < filters.fromDate) {
                return false;
              }
              if (filters?.availableSeats && 
                  (trip.maxPassengers - trip.currentPassengers) < filters.availableSeats) {
                return false;
              }
              return true;
            });

          setTrips(tripsData);
          setError(null);
          setLoading(false);
        },
        (err) => {
          console.error('Erreur lors du chargement des trajets:', err);
          toast.error('Impossible de charger les trajets');
          setError('Échec du chargement des trajets');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Erreur lors de l\'initialisation des trajets:', err);
      setError('Échec de l\'initialisation des trajets');
      setLoading(false);
    }
  }, [filters?.pickup, filters?.dropoff, filters?.fromDate, filters?.availableSeats]);

  return { trips, loading, error };
}