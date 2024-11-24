import { collection, doc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { TaxiStation } from '../types/station';

// Collection references
export const usersCollection = collection(db, 'users');
export const stationsCollection = collection(db, 'stations');
export const tripsCollection = collection(db, 'trips');
export const messagesCollection = collection(db, 'messages');

// Helper function to initialize taxi stations (admin only)
export async function initializeTaxiStations(stations: TaxiStation[]) {
  const batch = db.batch();
  
  stations.forEach(station => {
    const stationRef = doc(stationsCollection, station.id);
    batch.set(stationRef, {
      ...station,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
  });

  await batch.commit();
}