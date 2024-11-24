import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Trip } from '../types/trip';

export async function createTripNotification(
  userId: string,
  tripId: string,
  type: 'trip_update' | 'trip_cancelled' | 'participant_joined' | 'participant_left',
  trip: Trip
) {
  const notificationData = {
    userId,
    tripId,
    type,
    title: getNotificationTitle(type),
    message: getNotificationMessage(type, trip),
    read: false,
    createdAt: serverTimestamp()
  };

  try {
    await addDoc(collection(db, 'notifications'), notificationData);
  } catch (error) {
    console.error('Erreur lors de la création de la notification:', error);
  }
}

function getNotificationTitle(type: string): string {
  switch (type) {
    case 'trip_update':
      return 'Trajet modifié';
    case 'trip_cancelled':
      return 'Trajet annulé';
    case 'participant_joined':
      return 'Nouveau participant';
    case 'participant_left':
      return 'Participant parti';
    default:
      return 'Notification de trajet';
  }
}

function getNotificationMessage(type: string, trip: Trip): string {
  switch (type) {
    case 'trip_update':
      return `Les détails du trajet de ${trip.pickup.address} à ${trip.dropoff.address} ont été mis à jour`;
    case 'trip_cancelled':
      return `Le trajet de ${trip.pickup.address} à ${trip.dropoff.address} a été annulé`;
    case 'participant_joined':
      return `Un nouveau participant a rejoint votre trajet vers ${trip.dropoff.address}`;
    case 'participant_left':
      return `Un participant a quitté votre trajet vers ${trip.dropoff.address}`;
    default:
      return 'Il y a eu une mise à jour de votre trajet';
  }
}