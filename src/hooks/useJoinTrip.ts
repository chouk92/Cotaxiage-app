import { useState } from 'react';
import { doc, updateDoc, arrayUnion, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { shareTrip } from '../utils/social-share';
import { Trip } from '../types/trip';

export function useJoinTrip(tripId: string) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const joinTrip = async (trip: Trip) => {
    if (!user) {
      toast.error('You must be logged in to join a trip');
      return false;
    }

    if (trip.creatorId === user.uid) {
      toast.error('You cannot join your own trip');
      return false;
    }

    if (trip.participants.includes(user.uid)) {
      toast.error('You have already joined this trip');
      return false;
    }

    if (trip.currentPassengers >= trip.maxPassengers) {
      toast.error('This trip is full');
      return false;
    }

    // Share trip first
    const shared = await shareTrip(trip);
    if (!shared) {
      toast.error('Please share the trip to join');
      return false;
    }

    setLoading(true);
    try {
      const tripRef = doc(db, 'trips', tripId);
      await updateDoc(tripRef, {
        participants: arrayUnion(user.uid),
        currentPassengers: increment(1),
        status: trip.currentPassengers + 1 >= trip.maxPassengers ? 'full' : 'open',
        updatedAt: serverTimestamp()
      });

      toast.success('Successfully joined the trip!');
      return true;
    } catch (error) {
      console.error('Error joining trip:', error);
      toast.error('Failed to join trip');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { joinTrip, loading };
}