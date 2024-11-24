import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Booking } from '../types/booking';

export function useBookings(userId: string) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const bookingsRef = collection(db, 'bookings');
    const q = query(
      bookingsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const bookingsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt instanceof Timestamp 
            ? doc.data().createdAt.toDate() 
            : new Date(doc.data().createdAt),
          scheduledFor: doc.data().scheduledFor instanceof Timestamp 
            ? doc.data().scheduledFor.toDate() 
            : new Date(doc.data().scheduledFor)
        })) as Booking[];

        setBookings(bookingsData);
        setError(null);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching bookings:', err);
        setError(
          err.code === 'permission-denied'
            ? 'You do not have permission to view these bookings.'
            : 'Failed to load bookings. Please try again.'
        );
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { bookings, loading, error };
}