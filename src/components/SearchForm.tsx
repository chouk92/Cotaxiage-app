import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { useBookingStore } from '../stores/bookingStore';
import { ALL_STATIONS, AIRPORTS, TRAIN_STATIONS, TAXI_STATIONS } from '../data/stations';
import { toast } from 'react-hot-toast';
import { validateRoute } from '../utils/validation';
import { calculateFare, calculatePerPersonFare } from '../utils/fareCalculator';

export default function SearchForm() {
  const navigate = useNavigate();
  const [direction, setDirection] = useState<'toAirport' | 'fromAirport'>('toAirport');
  const [formData, setFormData] = useState({
    pickup: '',
    dropoff: '',
    date: '',
    passengers: 1
  });
  const [estimatedFare, setEstimatedFare] = useState<number>(0);
  const { setPickup, setDropoff, setDate, setPassengers } = useBookingStore();

  useEffect(() => {
    if (formData.pickup && formData.dropoff) {
      const pickupStation = ALL_STATIONS.find(s => s.id === formData.pickup);
      const dropoffStation = ALL_STATIONS.find(s => s.id === formData.dropoff);
      
      if (pickupStation && dropoffStation) {
        const routeValidation = validateRoute(formData.pickup, formData.dropoff);
        if (routeValidation.valid) {
          const fare = calculateFare(pickupStation, dropoffStation);
          setEstimatedFare(fare);
        }
      }
    }
  }, [formData.pickup, formData.dropoff]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { pickup, dropoff, date, passengers } = formData;

    if (!pickup || !dropoff || !date) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }

    const pickupStation = ALL_STATIONS.find(s => s.id === pickup);
    const dropoffStation = ALL_STATIONS.find(s => s.id === dropoff);

    if (!pickupStation || !dropoffStation) {
      toast.error('Points de départ ou d\'arrivée invalides');
      return;
    }

    const routeValidation = validateRoute(pickup, dropoff);
    if (!routeValidation.valid) {
      toast.error(routeValidation.error);
      return;
    }

    setPickup({
      id: pickupStation.id,
      name: pickupStation.name,
      address: pickupStation.address,
      lat: pickupStation.location.lat,
      lng: pickupStation.location.lng
    });

    setDropoff({
      id: dropoffStation.id,
      name: dropoffStation.name,
      address: dropoffStation.address,
      lat: dropoffStation.location.lat,
      lng: dropoffStation.location.lng
    });

    setDate(new Date(date));
    setPassengers(passengers);
    navigate('/trips');
  };

  const availablePickupStations = direction === 'toAirport'
    ? [...TRAIN_STATIONS, ...TAXI_STATIONS]
    : AIRPORTS;

  const availableDropoffStations = direction === 'toAirport'
    ? AIRPORTS
    : [...TRAIN_STATIONS, ...TAXI_STATIONS];

  const perPersonFare = calculatePerPersonFare(estimatedFare, formData.passengers);

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
              <span>Nombre de passagers</span>
            </div>
          </label>
          <select
            value={formData.passengers}
            onChange={(e) => setFormData(prev => ({ ...prev, passengers: Number(e.target.value) }))}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            {[1, 2, 3].map(num => (
              <option key={num} value={num}>{num} passager{num !== 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
      </div>

      {estimatedFare > 0 && (
        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-700">Tarif estimé</p>
              <p className="text-xs text-gray-500">Par personne</p>
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
        className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
      >
        <Search className="h-5 w-5" />
        <span>Rechercher des trajets</span>
      </button>
    </form>
  );
}