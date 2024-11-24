import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Trip } from '../types/trip';

export function useUserTrips(userId: string) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const tripsRef = collection(db, 'trips');
      const q = query(
        tripsRef,
        where('participants', 'array-contains', userId),
        orderBy('scheduledFor', 'desc')
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const tripsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            scheduledFor: doc.data().scheduledFor?.toDate() || new Date(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate() || new Date()
          })) as Trip[];

          setTrips(tripsData);
          setError(null);
          setLoading(false);
        },
        (err) => {
          console.error('Error fetching user trips:', err);
          setError('Failed to load trips');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up user trips listener:', err);
      setError('Failed to initialize trips');
      setLoading(false);
    }
  }, [userId]);

  return { trips, loading, error };
}