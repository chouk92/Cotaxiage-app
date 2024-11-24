import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Users, Calendar, MapPin, Info } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCreateTrip } from '../../hooks/useCreateTrip';
import { ALL_STATIONS, AIRPORTS, TRAIN_STATIONS, TAXI_STATIONS } from '../../data/stations';
import { validateRoute } from '../../utils/validation';
import { calculateFare, calculatePerPersonFare } from '../../utils/fareCalculator';
import { fr } from 'date-fns/locale';

export default function CreateTripForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createTrip, loading } = useCreateTrip();
  const [direction, setDirection] = useState<'toAirport' | 'fromAirport'>('toAirport');
  const [formData, setFormData] = useState({
    pickup: '',
    dropoff: '',
    date: '',
    availableSeats: 3,
  });
  const [estimatedFare, setEstimatedFare] = useState<number>(0);

  useEffect(() => {
    if (formData.pickup && formData.dropoff) {
      const pickupStation = ALL_STATIONS.find(s => s.id === formData.pickup);
      const dropoffStation = ALL_STATIONS.find(s => s.id === formData.dropoff);
      
      if (pickupStation && dropoffStation) {
        const fare = calculateFare(pickupStation, dropoffStation);
        setEstimatedFare(fare);
      }
    }
  }, [formData.pickup, formData.dropoff]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Veuillez vous connecter pour créer un trajet');
      return;
    }

    const { pickup, dropoff, date } = formData;

    if (!pickup || !dropoff || !date) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }

    const routeValidation = validateRoute(pickup, dropoff);
    if (!routeValidation.valid) {
      toast.error(routeValidation.error);
      return;
    }

    try {
      const tripId = await createTrip(formData);
      if (tripId) {
        toast.success('Trajet créé avec succès !');
        navigate(`/trip/${tripId}`);
      }
    } catch (error) {
      // L'erreur est gérée dans le hook useCreateTrip
    }
  };

  const availablePickupStations = direction === 'toAirport'
    ? [...TRAIN_STATIONS, ...TAXI_STATIONS]
    : AIRPORTS;

  const availableDropoffStations = direction === 'toAirport'
    ? AIRPORTS
    : [...TRAIN_STATIONS, ...TAXI_STATIONS];

  const perPersonFare = calculatePerPersonFare(estimatedFare, formData.availableSeats + 1);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Créer un trajet</h2>
        <p className="text-gray-600 mt-1">Partagez votre trajet en taxi avec d'autres</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center mb-6">
          <div className="inline-flex rounded-lg border border-gray-200 p-1">
            <button
              type="button"
              onClick={() => {
                setDirection('toAirport');
                setFormData(prev => ({ ...prev, pickup: '', dropoff: '' }));
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                direction === 'toAirport'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Vers l'aéroport
            </button>
            <button
              type="button"
              onClick={() => {
                setDirection('fromAirport');
                setFormData(prev => ({ ...prev, pickup: '', dropoff: '' }));
              }}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                direction === 'fromAirport'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Depuis l'aéroport
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span>Point de départ</span>
              </div>
            </label>
            <select
              value={formData.pickup}
              onChange={(e) => setFormData(prev => ({ ...prev, pickup: e.target.value }))}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionnez un point de départ</option>
              {availablePickupStations.map(station => (
                <option key={station.id} value={station.id}>
                  {station.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-red-600" />
                <span>Point d'arrivée</span>
              </div>
            </label>
            <select
              value={formData.dropoff}
              onChange={(e) => setFormData(prev => ({ ...prev, dropoff: e.target.value }))}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionnez un point d'arrivée</option>
              {availableDropoffStations.map(station => (
                <option key={station.id} value={station.id}>
                  {station.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Date et heure</span>
            </div>
          </label>
          <input
            type="datetime-local"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            min={new Date().toISOString().slice(0, 16)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Places disponibles</span>
            </div>
          </label>
          <select
            value={formData.availableSeats}
            onChange={(e) => setFormData(prev => ({ ...prev, availableSeats: Number(e.target.value) }))}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            {[1, 2, 3].map(num => (
              <option key={num} value={num}>{num} place{num !== 1 ? 's' : ''}</option>
            ))}
          </select>
          <p className="mt-2 text-sm text-gray-500 flex items-center">
            <Info className="h-4 w-4 mr-1" />
            Maximum 3 passagers supplémentaires autorisés
          </p>
        </div>

        {estimatedFare > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-700">Tarif estimé</p>
                <p className="text-xs text-gray-500">Par personne avec capacité maximale</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">{estimatedFare}€</p>
                <p className="text-sm text-gray-600">{perPersonFare}€ par personne</p>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Création en cours...' : 'Créer le trajet'}
        </button>
      </form>
    </div>
  );
}