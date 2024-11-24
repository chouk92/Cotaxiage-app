import React from 'react';
import { Check, MapPin, Calendar, Users, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useBookingStore } from '../../stores/bookingStore';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

export default function BookingConfirmation() {
  const { user } = useAuth();
  const { pickup, dropoff, date, passengers, fare } = useBookingStore();

  const handleStartChat = async () => {
    if (!user) return;

    try {
      const chatRef = await addDoc(collection(db, 'chats'), {
        participants: [user.uid, 'DRIVER_ID'],
        bookingId: 'BOOKING_ID',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      toast.success('Discussion démarrée avec votre chauffeur');
    } catch (error) {
      toast.error('Échec du démarrage de la discussion');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-center mb-6">
        <div className="bg-green-100 rounded-full p-3">
          <Check className="h-6 w-6 text-green-600" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-center mb-6">Réservation confirmée !</h2>

      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <MapPin className="h-5 w-5 text-blue-600 mt-1" />
          <div>
            <p className="font-medium">Départ</p>
            <p className="text-gray-600">{pickup?.address}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <MapPin className="h-5 w-5 text-red-600 mt-1" />
          <div>
            <p className="font-medium">Arrivée</p>
            <p className="text-gray-600">{dropoff?.address}</p>
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
            <p className="text-gray-600">{passengers}</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <div className="flex justify-between items-center">
            <span className="font-medium">Tarif total</span>
            <span className="text-xl font-bold">{fare.toFixed(2)}€</span>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <button
          onClick={handleStartChat}
          className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <MessageCircle className="h-5 w-5" />
          <span>Contacter le chauffeur</span>
        </button>
      </div>
    </div>
  );
}