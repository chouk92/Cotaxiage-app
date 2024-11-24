import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { TaxiStation } from '../types/station';

export function useStations(district?: string) {
  const [stations, setStations] = useState<TaxiStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const stationsRef = collection(db, 'stations');
        const q = district 
          ? query(stationsRef, where('district', '==', district), where('isActive', '==', true))
          : query(stationsRef, where('isActive', '==', true));

        const snapshot = await getDocs(q);
        const stationsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as TaxiStation[];

        setStations(stationsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching stations:', err);
        setError('Failed to load stations');
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, [district]);

  return { stations, loading, error };
}