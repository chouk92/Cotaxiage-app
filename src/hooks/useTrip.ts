import { useState, useEffect } from 'react';
import { doc, onSnapshot, updateDoc, arrayUnion, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Trip } from '../types/trip';
import { toast } from 'react-hot-toast';
import { shareTrip } from '../utils/social-share';

export function useTrip(tripId: string) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const tripRef = doc(db, 'trips', tripId);
    const unsubscribe = onSnapshot(
      tripRef,
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setTrip({
            id: doc.id,
            ...data,
            scheduledFor: data.scheduledFor?.toDate() || new Date(),
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date()
          } as Trip);
          setError(null);
        } else {
          setTrip(null);
          setError('Trip not found');
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching trip:', err);
        setError('Failed to load trip details');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [tripId]);

  const joinTrip = async (userId: string) => {
    if (!trip) return;

    if (trip.currentPassengers >= trip.maxPassengers) {
      toast.error('This trip is full');
      return;
    }

    if (trip.participants.includes(userId)) {
      toast.error('You are already part of this trip');
      return;
    }

    try {
      // Share trip first
      const shared = await shareTrip(trip);
      if (!shared) {
        toast.error('Please share the trip to join');
        return;
      }

      // Then join the trip
      const tripRef = doc(db, 'trips', tripId);
      await updateDoc(tripRef, {
        participants: arrayUnion(userId),
        currentPassengers: increment(1),
        status: trip.currentPassengers + 1 >= trip.maxPassengers ? 'full' : 'open',
        updatedAt: serverTimestamp()
      });
      
      toast.success('Successfully joined the trip');
    } catch (error) {
      console.error('Error joining trip:', error);
      toast.error('Failed to join trip');
    }
  };

  return { trip, loading, error, joinTrip };
}