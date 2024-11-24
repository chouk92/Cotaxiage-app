import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useBookingStore } from '../../stores/bookingStore';
import LoadingSpinner from '../common/LoadingSpinner';
import SearchStep from './steps/SearchStep';
import BookingStep from './steps/BookingStep';
import ConfirmationStep from './steps/ConfirmationStep';

export default function BookingFlow() {
  const { pickup, dropoff, date } = useBookingStore();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route index element={<SearchStep />} />
          <Route
            path="book"
            element={
              pickup && dropoff && date ? (
                <BookingStep />
              ) : (
                <Navigate to="/booking" replace />
              )
            }
          />
          <Route
            path="confirmation"
            element={
              pickup && dropoff && date ? (
                <ConfirmationStep />
              ) : (
                <Navigate to="/booking" replace />
              )
            }
          />
        </Routes>
      </Suspense>
    </div>
  );
}