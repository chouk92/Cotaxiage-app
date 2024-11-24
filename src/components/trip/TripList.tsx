import React from 'react';
import { Trip } from '../../types/trip';
import TripCard from './TripCard';
import LoadingSpinner from '../common/LoadingSpinner';

interface TripListProps {
  trips: Trip[];
  loading?: boolean;
  error?: string | null;
}

export default function TripList({ trips = [], loading, error }: TripListProps) {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-blue-600 hover:text-blue-700 underline"
        >
          Réessayer
        </button>
      </div>
    );
  }

  if (!trips.length) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-600">Aucun trajet disponible pour vos critères de recherche</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {trips.map((trip) => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </div>
  );
}