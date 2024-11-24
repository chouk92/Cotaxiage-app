import { collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ALL_STATIONS } from '../data/stations';

export async function initializeCollections() {
  try {
    const batch = writeBatch(db);

    // Initialize stations collection
    const stationsRef = collection(db, 'stations');
    ALL_STATIONS.forEach(station => {
      const stationDoc = doc(stationsRef, station.id);
      batch.set(stationDoc, {
        ...station,
        isActive: true,
        capacity: station.type === 'taxi' ? 5 : 10,
        operatingHours: {
          open: '00:00',
          close: '23:59'
        },
        createdAt: new Date(),
        updatedAt: new Date()
      });
    });

    // Initialize trips collection with example data
    const tripsRef = collection(db, 'trips');
    const exampleTrip = doc(tripsRef);
    batch.set(exampleTrip, {
      creatorId: 'system',
      participants: [],
      pickup: ALL_STATIONS[0].location,
      dropoff: ALL_STATIONS[1].location,
      scheduledFor: new Date(),
      maxPassengers: 4,
      currentPassengers: 0,
      status: 'open',
      fare: 50,
      perPersonFare: 25,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Initialize messages collection with example data
    const messagesRef = collection(db, 'messages');
    const exampleMessage = doc(messagesRef);
    batch.set(exampleMessage, {
      tripId: exampleTrip.id,
      senderId: 'system',
      content: 'Welcome to CoTaxiage!',
      timestamp: new Date(),
      read: false
    });

    await batch.commit();
    console.log('Collections initialized successfully');
  } catch (error) {
    console.error('Error initializing collections:', error);
    throw error;
  }
}