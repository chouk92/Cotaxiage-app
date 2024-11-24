import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrips } from '../hooks/useTrips';
import { useBookingStore } from '../stores/bookingStore';
import { validateRoute } from '../utils/validation';
import TripList from '../components/trip/TripList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { toast } from 'react-hot-toast';

export default function TripsPage() {
  const navigate = useNavigate();
  const { pickup, dropoff, date, passengers } = useBookingStore();

  React.useEffect(() => {
    if (!pickup || !dropoff || !date) {
      navigate('/');
      return;
    }

    const routeValidation = validateRoute(pickup.id!, dropoff.id!);
    if (!routeValidation.valid) {
      toast.error(routeValidation.error);
      navigate('/');
    }
  }, [pickup, dropoff, date, navigate]);

  const { trips, loading, error } = useTrips({
    pickup: pickup?.id,
    dropoff: dropoff?.id,
    fromDate: date,
    availableSeats: passengers
  });

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Trajets disponibles</h1>
        <p className="mt-2 text-gray-600">
          De {pickup?.name} à {dropoff?.name} le {date.toLocaleDateString('fr-FR')}
        </p>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600 mb-4">Aucun trajet disponible pour vos critères de recherche</p>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Essayer une autre recherche
          </button>
        </div>
      ) : (
        <TripList trips={trips} />
      )}
    </div>
  );
}