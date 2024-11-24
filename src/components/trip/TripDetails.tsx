import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MapPin, Users, Clock, Share2 } from 'lucide-react';
import { useTrip } from '../../hooks/useTrip';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { calculatePerPersonFare } from '../../utils/fareCalculator';
import { shareTrip } from '../../utils/social-share';
import LoadingSpinner from '../common/LoadingSpinner';
import ParticipantsList from './ParticipantsList';
import TripMap from './TripMap';

interface TripDetailsProps {
  tripId: string;
}

export default function TripDetails({ tripId }: TripDetailsProps) {
  const navigate = useNavigate();
  const { trip, loading, error, joinTrip } = useTrip(tripId);
  const { user } = useAuth();
  const [joining, setJoining] = React.useState(false);

  const handleJoin = async () => {
    if (!user) {
      toast.error('Veuillez vous connecter pour rejoindre ce trajet');
      navigate('/login');
      return;
    }

    if (!trip) return;

    if (trip.creatorId === user.uid) {
      toast.error('Vous ne pouvez pas rejoindre votre propre trajet');
      return;
    }

    if (trip.participants.includes(user.uid)) {
      toast.error('Vous avez déjà rejoint ce trajet');
      return;
    }

    setJoining(true);
    try {
      await joinTrip(user.uid);
      await shareTrip(trip);
      toast.success('Vous avez rejoint le trajet avec succès !');
    } catch (error) {
      toast.error('Échec de la participation au trajet');
    } finally {
      setJoining(false);
    }
  };

  const handleShare = async () => {
    if (!trip) return;
    
    try {
      const shared = await shareTrip(trip);
      if (shared) {
        toast.success('Trajet partagé avec succès !');
      }
    } catch (error) {
      toast.error('Échec du partage du trajet');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !trip) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || 'Trajet non trouvé'}</p>
      </div>
    );
  }

  const perPersonFare = calculatePerPersonFare(trip.fare, trip.currentPassengers);
  const availableSeats = trip.maxPassengers - trip.currentPassengers;
  const isPastTrip = trip.scheduledFor < new Date();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="h-64 rounded-lg overflow-hidden shadow-md">
        <TripMap pickup={trip.pickup} dropoff={trip.dropoff} />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <p className="font-medium">Départ</p>
                <p className="text-gray-600">{trip.pickup.name}</p>
              </div>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-red-600 mr-2" />
              <div>
                <p className="font-medium">Arrivée</p>
                <p className="text-gray-600">{trip.dropoff.name}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <p className="font-medium">Départ</p>
                <p className="text-gray-600">{format(trip.scheduledFor, 'PPp', { locale: fr })}</p>
              </div>
            </div>

            <div className="flex items-center">
              <Users className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <p className="font-medium">Passagers</p>
                <p className="text-gray-600">
                  {trip.currentPassengers} / {trip.maxPassengers} inscrits
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Tarif du trajet</p>
                <p className="text-sm text-gray-600">Par personne</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{perPersonFare}€</p>
                <p className="text-sm text-gray-600">Total : {trip.fare}€</p>
              </div>
            </div>
          </div>

          <ParticipantsList participants={trip.participants} />

          <div className="flex items-center justify-end space-x-3 pt-6 border-t">
            <button
              onClick={handleShare}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
            >
              <Share2 className="h-4 w-4" />
              <span>Partager</span>
            </button>

            <button
              onClick={handleJoin}
              disabled={
                joining ||
                availableSeats === 0 ||
                trip.creatorId === user?.uid ||
                trip.participants.includes(user?.uid || '') ||
                isPastTrip
              }
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {joining ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white" />
                  <span>Inscription...</span>
                </>
              ) : (
                <>
                  <Users className="h-4 w-4" />
                  <span>
                    {trip.creatorId === user?.uid ? 'Votre trajet' :
                     trip.participants.includes(user?.uid || '') ? 'Déjà inscrit' :
                     availableSeats === 0 ? 'Complet' :
                     isPastTrip ? 'Terminé' :
                     'Rejoindre'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}