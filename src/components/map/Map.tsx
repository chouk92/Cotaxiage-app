import React from 'react';
import Map, { Marker } from 'react-map-gl';
import { MapPin } from 'lucide-react';
import { Location } from '../../types/booking';

interface MapViewProps {
  pickup: Location | null;
  dropoff: Location | null;
  onPickupSelect: (location: Location) => void;
  onDropoffSelect: (location: Location) => void;
}

export default function MapView({ pickup, dropoff, onPickupSelect, onDropoffSelect }: MapViewProps) {
  return (
    <Map
      mapboxAccessToken="YOUR_MAPBOX_TOKEN"
      initialViewState={{
        longitude: 2.3522,
        latitude: 48.8566,
        zoom: 11
      }}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
    >
      {pickup && (
        <Marker longitude={pickup.lng} latitude={pickup.lat}>
          <MapPin className="h-6 w-6 text-blue-600" />
        </Marker>
      )}
      {dropoff && (
        <Marker longitude={dropoff.lng} latitude={dropoff.lat}>
          <MapPin className="h-6 w-6 text-red-600" />
        </Marker>
      )}
    </Map>
  );
}