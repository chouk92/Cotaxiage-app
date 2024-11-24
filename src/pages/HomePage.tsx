import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SearchForm from '../components/SearchForm';
import PopularRoutes from '../components/PopularRoutes';

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCreateTrip = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/create-trip');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            Partagez votre taxi vers les aéroports de Paris
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Trouvez et rejoignez des trajets en taxi ou créez le vôtre
          </p>
        </div>
        <button
          onClick={handleCreateTrip}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Créer un trajet
        </button>
      </div>

      <SearchForm />
      <PopularRoutes />
    </div>
  );
}