import React from 'react';
import { SearchX } from 'lucide-react';

export default function NoTripsFound() {
  return (
    <div className="text-center py-12 bg-white rounded-lg shadow-md">
      <SearchX className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Aucun trajet trouvé
      </h3>
      <p className="text-gray-600">
        Ajustez vos critères de recherche ou créez un nouveau trajet
      </p>
    </div>
  );
}