import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, MapPin, Calendar, Users, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useBookingStore } from '../../../stores/bookingStore';
import { useChatStore } from '../../../stores/chatStore';
import { db } from '../../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

export default function ConfirmationStep() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { pickup, dropoff, date, passengers, fare, reset } = useBookingStore();
  const { setActiveChat } = useChatStore();

  useEffect(() => {
    if (!pickup || !dropoff || !date || !fare) {
      navigate('/booking');
    }
  }, [pickup, dropoff, date, fare, navigate]);

  const handleStartChat = async () => {
    if (!user) {
      toast.error('Veuillez vous connecter pour démarrer une discussion');
      navigate('/login');
      return;
    }

    try {
      const chatRef = await addDoc(collection(db, 'chats'), {
        participants: [user.uid],
        type: 'booking',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      setActiveChat({
        id: chatRef.id,
        participants: [user.uid],
        updatedAt: new Date(),
      });

      toast.success('Discussion démarrée avec succès');
    } catch (error) {
      console.error('Erreur lors du démarrage de la discussion:', error);
      toast.error('Échec du démarrage de la discussion');
    }
  };

  const handleFinish = () => {
    reset();
    navigate('/');
  };

  if (!pickup || !dropoff || !date) return null;

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
            <p className="text-gray-600">{pickup.address}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <MapPin className="h-5 w-5 text-red-600 mt-1" />
          <div>
            <p className="font-medium">Arrivée</p>
            <p className="text-gray-600">{dropoff.address}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Calendar className="h-5 w-5 text-gray-400" />
          <div>
            <p className="font-medium">Date et heure</p>
            <p className="text-gray-600">{format(date, 'PPp', { locale: fr })}</p>
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
            <span className="font-medium">Total payé</span>
            <span className="text-xl font-bold">{fare.toFixed(2)}€</span>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <button
          onClick={handleStartChat}
          className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
        >
          <MessageCircle className="h-5 w-5" />
          <span>Contacter le chauffeur</span>
        </button>

        <button
          onClick={handleFinish}
          className="w-full py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}