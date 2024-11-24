import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookingStore } from '../../../stores/bookingStore';
import SearchForm from '../../SearchForm';

export default function SearchStep() {
  const navigate = useNavigate();
  const { pickup, dropoff, date } = useBookingStore();

  React.useEffect(() => {
    if (pickup && dropoff && date) {
      navigate('/booking/payment');
    }
  }, [pickup, dropoff, date, navigate]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Book Your Ride</h2>
      <p className="text-gray-600">Enter your trip details to get started</p>
      <SearchForm />
    </div>
  );
}