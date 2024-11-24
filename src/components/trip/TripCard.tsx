import React from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MapPin, Users, Clock, Share2 } from 'lucide-react';
import { Trip } from '../../types/trip';
import { useAuth } from '../../contexts/AuthContext';
import { calculatePerPersonFare } from '../../utils/fareCalculator';
import { toast } from 'react-hot-toast';

interface TripCardProps {
  trip: Trip;
}

export default function TripCard({ trip }: TripCardProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const perPersonFare = calculatePerPersonFare(trip.fare, trip.currentPassengers);
  const availableSeats = trip.maxPassengers - trip.currentPassengers;
  const isPastTrip = trip.scheduledFor < new Date();

  const handleClick = () => {
    if (!user) {
      toast.error('Veuillez vous connecter pour voir les détails du trajet');
      navigate('/login');
      return;
    }
    navigate(`/trip/${trip.id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="space-y-4">
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-sm">{trip.pickup.name}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-red-600 mr-2" />
              <span className="text-sm">{trip.dropoff.name}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold">{perPersonFare}€</span>
            <p className="text-sm text-gray-600">par personne</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {format(trip.scheduledFor, 'PPp', { locale: fr })}
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {availableSeats} {availableSeats === 1 ? 'place' : 'places'} {availableSeats === 1 ? 'disponible' : 'disponibles'}
          </div>
        </div>

        <div className="pt-4 border-t flex justify-between items-center">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            isPastTrip ? 'bg-gray-100 text-gray-800' :
            availableSeats === 0 ? 'bg-red-100 text-red-800' :
            'bg-green-100 text-green-800'
          }`}>
            {isPastTrip ? 'Trajet passé' :
             availableSeats === 0 ? 'Complet' :
             'Disponible'}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Fonctionnalité de partage à implémenter
            }}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}