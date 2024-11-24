import React from 'react';
import { useParams } from 'react-router-dom';
import TripDetails from '../components/trip/TripDetails';

export default function TripDetailsPage() {
  const { tripId } = useParams<{ tripId: string }>();

  if (!tripId) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Trip ID is required</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <TripDetails tripId={tripId} />
    </div>
  );
}