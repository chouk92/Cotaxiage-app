import React from 'react';
import { format, addMinutes } from 'date-fns';
import { Users, Clock, Luggage, MapPin } from 'lucide-react';
import { useBookingStore } from '../../stores/bookingStore';
import { calculateFare, getEstimatedDuration } from '../../utils/fareCalculator';

const SHARING_OPTION = {
  id: 'shared',
  name: 'Shared Taxi',
  description: 'Share a standard taxi with others, split the fare (max 4 people total)',
  maxPassengers: 4,
  currentPassengers: 0,
  multiplier: 1,
  luggageSpace: '1 medium suitcase per person',
  status: 'available' as const
};

export default function RideSelection() {
  const { pickup, dropoff, date, passengers, setFare } = useBookingStore();

  React.useEffect(() => {
    if (pickup && dropoff) {
      const baseFare = calculateFare(pickup, dropoff);
      const totalPassengers = SHARING_OPTION.currentPassengers + passengers;
      const farePerPerson = baseFare / totalPassengers;
      setFare(farePerPerson);
    }
  }, [pickup, dropoff, passengers, setFare]);

  if (!pickup || !dropoff || !date) {
    return null;
  }

  const estimatedDuration = getEstimatedDuration(pickup, dropoff);
  const estimatedArrival = addMinutes(date, estimatedDuration);
  const remainingSeats = SHARING_OPTION.maxPassengers - SHARING_OPTION.currentPassengers;
  const totalPassengers = SHARING_OPTION.currentPassengers + passengers;
  const pricePerPerson = calculateFare(pickup, dropoff) / totalPassengers;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Taxi Sharing Details</h3>
        
        <div className="space-y-6">
          <div className={`w-full p-6 rounded-lg border-2 transition-all ${
            remainingSeats >= passengers
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 opacity-50'
          }`}>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-left">
                    <h4 className="font-medium text-lg">{SHARING_OPTION.name}</h4>
                    <p className="text-sm text-gray-600">{SHARING_OPTION.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold">€{pricePerPerson.toFixed(2)}</span>
                  <p className="text-sm text-gray-600">per person</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>Meet at taxi station</span>
                </div>
                <div className="flex items-center space-x-2 justify-end">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span>{remainingSeats} seats available</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="flex items-center space-x-1 text-sm bg-gray-100 px-2 py-1 rounded">
                  <Luggage className="h-4 w-4" />
                  <span>{SHARING_OPTION.luggageSpace}</span>
                </div>
                {SHARING_OPTION.currentPassengers > 0 && (
                  <div className="flex items-center space-x-1 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    <Users className="h-4 w-4" />
                    <span>{SHARING_OPTION.currentPassengers} others joined</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 border-t text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <div>
                    <p>Departure: {format(date, 'HH:mm')}</p>
                    <p>Estimated arrival: {format(estimatedArrival, 'HH:mm')}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full ${
                  remainingSeats >= passengers
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {remainingSeats >= passengers ? 'Available' : 'Not enough seats'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Estimated duration: {estimatedDuration} min</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>{passengers} passenger(s)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}