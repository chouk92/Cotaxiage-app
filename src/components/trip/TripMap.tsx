import React from 'react';
import { MapPin } from 'lucide-react';
import { Location } from '../../types/booking';

interface TripMapProps {
  pickup: Location;
  dropoff: Location;
}

export default function TripMap({ pickup, dropoff }: TripMapProps) {
  return (
    <div className="w-full h-full bg-gray-100 relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-gray-500">Map view coming soon</div>
      </div>
      
      <div className="absolute bottom-4 left-4 space-y-2">
        <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow">
          <MapPin className="h-4 w-4 text-blue-600" />
          <span className="text-sm">{pickup.address}</span>
        </div>
        <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg shadow">
          <MapPin className="h-4 w-4 text-red-600" />
          <span className="text-sm">{dropoff.address}</span>
        </div>
      </div>
    </div>
  );
}