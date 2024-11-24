import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { MapPin, Clock, CreditCard } from 'lucide-react';
import { Booking } from '../../types/booking';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';

export default function BookingHistory() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const bookingsRef = collection(db, 'bookings');
        const q = query(
          bookingsRef,
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(q);
        const bookingsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt instanceof Timestamp 
            ? doc.data().createdAt.toDate() 
            : new Date(),
          scheduledFor: doc.data().scheduledFor instanceof Timestamp 
            ? doc.data().scheduledFor.toDate() 
            : new Date(),
        })) as Booking[];

        setBookings(bookingsData);
        setError(null);
      } catch (error: any) {
        console.error('Error fetching bookings:', error);
        setError(
          error.code === 'permission-denied'
            ? 'You do not have permission to view these bookings.'
            : 'Unable to load bookings. Please try again later.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-blue-600 hover:text-blue-700 underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!bookings.length) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-600">No bookings found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center text-gray-600 mb-2">
                <Clock className="h-4 w-4 mr-2" />
                <span>{format(booking.scheduledFor, 'PPp')}</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-blue-600 mr-2" />
                  <span>{booking.pickup.address}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-red-600 mr-2" />
                  <span>{booking.dropoff.address}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold">€{booking.fare.toFixed(2)}</span>
              <div className="flex items-center mt-2">
                <CreditCard className="h-4 w-4 mr-1" />
                <span className={`text-sm ${
                  booking.paymentStatus === 'completed' ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {booking.paymentStatus === 'completed' ? 'Paid' : 'Pending'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              booking.status === 'completed' ? 'bg-green-100 text-green-800' :
              booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}