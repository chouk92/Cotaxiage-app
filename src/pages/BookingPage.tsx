import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useBookingStore } from '../stores/bookingStore';
import SearchStep from '../components/booking/steps/SearchStep';
import TripList from '../components/trip/TripList';
import { useTrips } from '../hooks/useTrips';

export default function BookingPage() {
  const { pickup, dropoff, date, passengers } = useBookingStore();
  const { trips, loading, error } = useTrips({
    pickup: pickup?.id,
    dropoff: dropoff?.id,
    fromDate: date,
    availableSeats: passengers
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Routes>
        <Route index element={<SearchStep />} />
        <Route
          path="trips"
          element={
            pickup && dropoff && date ? (
              <div>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900">Available Trips</h1>
                  <p className="mt-2 text-gray-600">
                    From {pickup.name} to {dropoff.name} on {date.toLocaleDateString()}
                  </p>
                </div>
                <TripList trips={trips} loading={loading} error={error} />
              </div>
            ) : (
              <Navigate to="/booking" replace />
            )
          }
        />
      </Routes>
    </div>
  );
}