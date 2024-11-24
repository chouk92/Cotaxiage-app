import React, { Suspense } from 'react';
import { MapProvider } from 'react-map-gl';
import LoadingSpinner from '../common/LoadingSpinner';

const InteractiveMap = React.lazy(() => import('./InteractiveMap'));

interface MapContainerProps {
  selectedStation?: string;
  onStationSelect?: (stationId: string) => void;
  showAllStations?: boolean;
  className?: string;
}

export default function MapContainer({ className = "h-[400px]", ...props }: MapContainerProps) {
  return (
    <div className={`relative rounded-lg overflow-hidden shadow-lg ${className}`}>
      <MapProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <InteractiveMap {...props} />
        </Suspense>
      </MapProvider>
    </div>
  );
}