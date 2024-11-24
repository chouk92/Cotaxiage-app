import React from 'react';
import Map, { NavigationControl, Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin } from 'lucide-react';
import { ALL_STATIONS } from '../../data/stations';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const MAPBOX_STYLE = import.meta.env.VITE_MAPBOX_STYLE;

const PARIS_BOUNDS = {
  north: 48.9021449,
  south: 48.8155755,
  east: 2.4699208,
  west: 2.2241989
};

const INITIAL_VIEW_STATE = {
  longitude: 2.3522,
  latitude: 48.8566,
  zoom: 11,
  bearing: 0,
  pitch: 0
};

interface MapProps {
  selectedStation?: string;
  onStationSelect?: (stationId: string) => void;
  showAllStations?: boolean;
}

export default function InteractiveMap({ 
  selectedStation,
  onStationSelect,
  showAllStations = true
}: MapProps) {
  const [popupInfo, setPopupInfo] = React.useState<{
    id: string;
    name: string;
    location: { lat: number; lng: number };
    address: string;
  } | null>(null);

  return (
    <Map
      mapboxAccessToken={MAPBOX_TOKEN}
      initialViewState={INITIAL_VIEW_STATE}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      maxBounds={[
        [PARIS_BOUNDS.west, PARIS_BOUNDS.south],
        [PARIS_BOUNDS.east, PARIS_BOUNDS.north]
      ]}
      minZoom={10}
      maxZoom={16}
      reuseMaps
    >
      <NavigationControl position="top-right" />
      
      {showAllStations && ALL_STATIONS.map(station => (
        <Marker
          key={station.id}
          longitude={station.location.lng}
          latitude={station.location.lat}
          anchor="bottom"
          onClick={e => {
            e.originalEvent.stopPropagation();
            setPopupInfo(station);
            onStationSelect?.(station.id);
          }}
        >
          <div className={`
            p-2 rounded-full text-white cursor-pointer transform transition-transform hover:scale-110
            ${station.type === 'airport' ? 'bg-blue-500' : 
              station.type === 'train' ? 'bg-green-500' : 
              'bg-yellow-500'}
            shadow-md
          `}>
            <MapPin className="h-5 w-5" />
          </div>
        </Marker>
      ))}

      {popupInfo && (
        <Popup
          anchor="top"
          longitude={popupInfo.location.lng}
          latitude={popupInfo.location.lat}
          onClose={() => setPopupInfo(null)}
          closeButton={true}
          closeOnClick={false}
          className="rounded-lg shadow-lg"
        >
          <div className="p-2">
            <h3 className="font-medium text-gray-900">{popupInfo.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{popupInfo.address}</p>
          </div>
        </Popup>
      )}
    </Map>
  );
}