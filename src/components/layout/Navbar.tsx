import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Car, User, LogIn, LogOut, Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import NotificationBell from '../notifications/NotificationBell';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Déconnexion réussie');
      navigate('/');
    } catch (error) {
      toast.error('Échec de la déconnexion');
    }
  };

  return (
    <nav className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Car className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">CoTaxiage</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <NotificationBell />
                <Link
                  to="/create-trip"
                  className={`flex items-center space-x-1 px-4 py-2 text-sm font-medium ${
                    location.pathname === '/create-trip'
                      ? 'text-blue-600'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <Plus className="h-4 w-4" />
                  <span>Créer un trajet</span>
                </Link>
                <Link
                  to="/booking"
                  className={`px-4 py-2 text-sm font-medium ${
                    location.pathname.startsWith('/booking')
                      ? 'text-blue-600'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Réserver
                </Link>
                <Link
                  to={`/profile/${user.uid}`}
                  className={`flex items-center space-x-1 px-4 py-2 text-sm font-medium ${
                    location.pathname.startsWith('/profile')
                      ? 'text-blue-600'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>Profil</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Déconnexion</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`flex items-center space-x-1 px-4 py-2 text-sm font-medium ${
                    location.pathname === '/login'
                      ? 'text-blue-600'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <LogIn className="h-4 w-4" />
                  <span>Connexion</span>
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}