import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useAuth } from '../../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { CreditCard, Lock } from 'lucide-react';
import LoadingSpinner from '../../common/LoadingSpinner';

export default function PaymentStep() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [booking, setBooking] = useState<any>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId || !user) return;

      try {
        const bookingDoc = await getDoc(doc(db, 'bookings', bookingId));
        if (!bookingDoc.exists()) {
          toast.error('Réservation introuvable');
          navigate('/booking');
          return;
        }

        const bookingData = bookingDoc.data();
        if (bookingData.userId !== user.uid) {
          toast.error('Accès non autorisé');
          navigate('/booking');
          return;
        }

        setBooking(bookingData);
      } catch (error) {
        console.error('Erreur lors du chargement de la réservation:', error);
        toast.error('Impossible de charger la réservation');
        navigate('/booking');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, user, navigate]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking || !bookingId) return;

    // Validation basique
    if (!cardNumber.trim() || !expiryDate.trim() || !cvc.trim()) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setProcessing(true);
    try {
      // Simuler un traitement de paiement
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mettre à jour le statut de la réservation
      await updateDoc(doc(db, 'bookings', bookingId), {
        status: 'confirmed',
        paymentStatus: 'completed',
        updatedAt: new Date()
      });

      toast.success('Paiement effectué avec succès');
      navigate('/booking/confirmation');
    } catch (error) {
      console.error('Erreur de paiement:', error);
      toast.error('Le paiement a échoué. Veuillez réessayer.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Lock className="h-5 w-5 text-green-600" />
          <h2 className="text-xl font-bold">Paiement sécurisé</h2>
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Montant total</span>
            <span className="text-xl font-bold">{booking?.fare.toFixed(2)}€</span>
          </div>
        </div>

        <form onSubmit={handlePayment} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Numéro de carte
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                placeholder="1234 5678 9012 3456"
                className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                maxLength={16}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date d'expiration
              </label>
              <input
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="MM/AA"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                maxLength={4}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVC
              </label>
              <input
                type="text"
                value={cvc}
                onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                placeholder="123"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                maxLength={3}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={processing}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {processing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                <span>Traitement en cours...</span>
              </>
            ) : (
              <span>Payer {booking?.fare.toFixed(2)}€</span>
            )}
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-4">
          Paiement sécurisé par Stripe. Nous ne stockons pas vos informations de carte.
        </p>
      </div>
    </div>
  );
}