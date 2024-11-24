import React from 'react';
import { useBookingStore } from '../../stores/bookingStore';
import InteractiveMap from '../map/InteractiveMap';
import { Location } from '../../types/booking';

export default function BookingMap() {
  const { pickup, dropoff, setPickup, setDropoff } = useBookingStore();

  const handleLocationSelect = (location: Location, type: 'pickup' | 'dropoff') => {
    if (type === 'pickup') {
      setPickup(location);
    } else {
      setDropoff(location);
    }
  };

  return (
    <div className="h-[600px] rounded-lg overflow-hidden shadow-lg">
      <InteractiveMap
        selectedStation={pickup?.id || dropoff?.id}
        onStationSelect={(stationId) => {
          // Handle station selection logic
          console.log('Selected station:', stationId);
        }}
        showAllStations={true}
      />
    </div>
  );
}