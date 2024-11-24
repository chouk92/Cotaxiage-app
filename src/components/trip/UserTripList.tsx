import React from 'react';
import { format } from 'date-fns';
import { useUserTrips } from '../../hooks/useUserTrips';
import LoadingSpinner from '../common/LoadingSpinner';
import { MapPin, Users, Clock } from 'lucide-react';

interface UserTripListProps {
  userId: string;
}

export default function UserTripList({ userId }: UserTripListProps) {
  const { trips, loading, error } = useUserTrips(userId);

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
          Try Again
        </button>
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow">
        <p className="text-gray-600">No trips found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {trips.map((trip) => (
        <div
          key={trip.id}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="space-y-2">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-blue-600 mr-2" />
                  <span>{trip.pickup.address}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 text-red-600 mr-2" />
                  <span>{trip.dropoff.address}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold">
                  €{(trip.fare / trip.currentPassengers).toFixed(2)}
                </span>
                <p className="text-sm text-gray-600">per person</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {format(trip.scheduledFor, 'PPp')}
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {trip.currentPassengers} / {trip.maxPassengers} passengers
              </div>
            </div>

            <div className="pt-4 border-t">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                trip.status === 'open' ? 'bg-green-100 text-green-800' :
                trip.status === 'full' ? 'bg-yellow-100 text-yellow-800' :
                trip.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                'bg-red-100 text-red-800'
              }`}>
                {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}