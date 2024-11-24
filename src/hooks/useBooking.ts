import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useBookingStore } from '../stores/bookingStore';
import { toast } from 'react-hot-toast';

export function useBooking() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { pickup, dropoff, date, passengers, fare, reset } = useBookingStore();

  const createBooking = async () => {
    if (!user || !pickup || !dropoff || !date) {
      toast.error('Missing required booking information');
      return null;
    }

    setLoading(true);
    try {
      const bookingData = {
        userId: user.uid,
        pickup,
        dropoff,
        scheduledFor: date,
        passengers,
        fare,
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'bookings'), bookingData);
      reset();
      return docRef.id;
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createBooking, loading };
}