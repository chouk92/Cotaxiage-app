import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useBookingStore } from '../../stores/bookingStore';
import { calculateFare } from '../../utils/fareCalculator';

export default function BookingForm() {
  const navigate = useNavigate();
  const { pickup, dropoff, date, passengers } = useBookingStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pickup || !dropoff) {
      toast.error('Please select pickup and dropoff locations');
      return;
    }

    if (!date) {
      toast.error('Please select a date and time');
      return;
    }

    navigate('/booking/confirm');
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Book Your Ride</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Passengers
            </label>
            <select
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={passengers}
              onChange={(e) => useBookingStore.getState().setPassengers(Number(e.target.value))}
            >
              {[1, 2, 3, 4].map(num => (
                <option key={num} value={num}>{num} passenger{num !== 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date & Time
            </label>
            <input
              type="datetime-local"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={date?.toISOString().slice(0, 16) || ''}
              onChange={(e) => useBookingStore.getState().setDate(new Date(e.target.value))}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          {pickup && dropoff && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Estimated Fare</span>
                <span className="text-xl font-bold">€{calculateFare(pickup, dropoff).toFixed(2)}</span>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Continue to Booking
          </button>
        </form>
      </div>
    </div>
  );
}