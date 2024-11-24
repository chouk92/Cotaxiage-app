import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookingStore } from '../../../stores/bookingStore';
import { useAuth } from '../../../contexts/AuthContext';
import { db } from '../../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { calculateFare } from '../../../utils/fareCalculator';
import { validateDateTime } from '../../../utils/validation';
import RideSelection from '../RideSelection';
import { MapPin, Calendar, Users, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function BookingStep() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { pickup, dropoff, date, passengers, setFare } = useBookingStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    if (!user) {
      toast.error('Veuillez vous connecter pour réserver');
      navigate('/login');
      return;
    }

    if (!pickup || !dropoff || !date) {
      toast.error('Veuillez remplir tous les champs requis');
      return;
    }

    const dateValidation = validateDateTime(date);
    if (!dateValidation.valid) {
      toast.error(dateValidation.error);
      return;
    }

    setIsProcessing(true);
    try {
      const fare = calculateFare(pickup, dropoff);
      setFare(fare);

      const bookingData = {
        userId: user.uid,
        pickup,
        dropoff,
        scheduledFor: date,
        passengers,
        fare,
        status: 'pending',
        paymentStatus: 'pending',
        createdAt: serverTimestamp(),
      };

      const bookingRef = await addDoc(collection(db, 'bookings'), bookingData);
      
      navigate(`/booking/payment/${bookingRef.id}`);
    } catch (error) {
      console.error('Erreur de réservation:', error);
      toast.error('Échec de la réservation. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Détails de la réservation</h2>

        <div className="space-y-6">
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-blue-600 mt-1" />
            <div>
              <p className="font-medium">Point de départ</p>
              <p className="text-gray-600">{pickup?.name}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-red-600 mt-1" />
            <div>
              <p className="font-medium">Point d'arrivée</p>
              <p className="text-gray-600">{dropoff?.name}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="font-medium">Date et heure</p>
              <p className="text-gray-600">{format(date!, 'PPp', { locale: fr })}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Users className="h-5 w-5 text-gray-400" />
            <div>
              <p className="font-medium">Passagers</p>
              <p className="text-gray-600">{passengers} {passengers > 1 ? 'personnes' : 'personne'}</p>
            </div>
          </div>
        </div>
      </div>

      <RideSelection />

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-medium">Paiement sécurisé</h3>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleConfirm}
            disabled={isProcessing}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                <span>Traitement en cours...</span>
              </>
            ) : (
              <span>Continuer vers le paiement</span>
            )}
          </button>

          <button
            onClick={() => navigate('/booking')}
            disabled={isProcessing}
            className="w-full py-3 text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-300"
          >
            Modifier la réservation
          </button>
        </div>
      </div>
    </div>
  );
}