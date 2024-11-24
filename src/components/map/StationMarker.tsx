import React, { useState } from 'react';
import { Marker, Popup } from 'react-map-gl';
import { MapPin, Train, Plane, Car } from 'lucide-react';

interface StationMarkerProps {
  station: {
    id: string;
    name: string;
    type: 'train' | 'taxi' | 'airport';
    location: {
      lat: number;
      lng: number;
    };
    address: string;
  };
  onClick?: () => void;
}

export default function StationMarker({ station, onClick }: StationMarkerProps) {
  const [showPopup, setShowPopup] = useState(false);

  const getIcon = () => {
    switch (station.type) {
      case 'train':
        return <Train className="h-6 w-6" />;
      case 'airport':
        return <Plane className="h-6 w-6" />;
      case 'taxi':
        return <Car className="h-6 w-6" />;
      default:
        return <MapPin className="h-6 w-6" />;
    }
  };

  const getColor = () => {
    switch (station.type) {
      case 'train':
        return 'bg-green-500';
      case 'airport':
        return 'bg-blue-500';
      case 'taxi':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <>
      <Marker
        longitude={station.location.lng}
        latitude={station.location.lat}
        anchor="bottom"
        onClick={(e) => {
          e.originalEvent.stopPropagation();
          setShowPopup(true);
          onClick?.();
        }}
      >
        <div
          className={`${getColor()} p-2 rounded-full text-white cursor-pointer transform transition-transform hover:scale-110`}
        >
          {getIcon()}
        </div>
      </Marker>
      
      {showPopup && (
        <Popup
          longitude={station.location.lng}
          latitude={station.location.lat}
          anchor="top"
          offset={25}
          onClose={() => setShowPopup(false)}
        >
          <div className="p-2">
            <h3 className="font-medium">{station.name}</h3>
            <p className="text-sm text-gray-600">{station.address}</p>
          </div>
        </Popup>
      )}
    </>
  );
}