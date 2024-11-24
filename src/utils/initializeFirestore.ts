import { collection, doc, setDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ALL_STATIONS } from '../data/stations';
import { toast } from 'react-hot-toast';

export async function initializeFirestore(uid: string) {
  const batch = writeBatch(db);

  try {
    // Initialize admin user document
    await setDoc(doc(db, 'users', uid), {
      email: 'admin@cotaxiage.com',
      displayName: 'Administrator',
      isAdmin: true,
      isSuperAdmin: true,
      createdAt: serverTimestamp(),
      lastLoginAt: serverTimestamp(),
      settings: {
        isPublic: false,
        emailNotifications: true,
        pushNotifications: true
      }
    }, { merge: true });

    // Initialize admin system document
    await setDoc(doc(db, 'admin', 'system'), {
      initialized: true,
      lastInitializedBy: uid,
      lastInitializedAt: serverTimestamp(),
      version: '1.0.0',
      superAdminId: uid
    });

    // Initialize stations collection
    ALL_STATIONS.forEach(station => {
      const stationRef = doc(collection(db, 'stations'), station.id);
      batch.set(stationRef, {
        ...station,
        isActive: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    });

    // Create initial trip for testing
    const tripRef = doc(collection(db, 'trips'));
    batch.set(tripRef, {
      creatorId: uid,
      participants: [uid],
      pickup: ALL_STATIONS[0],
      dropoff: ALL_STATIONS[1],
      scheduledFor: new Date(Date.now() + 86400000), // Tomorrow
      maxPassengers: 4,
      currentPassengers: 1,
      status: 'open',
      fare: 50,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    await batch.commit();
    toast.success('Database initialized successfully');
    return true;
  } catch (error: any) {
    console.error('Error initializing Firestore:', error);
    toast.error(
      error.code === 'permission-denied'
        ? 'You do not have permission to initialize the database'
        : 'Failed to initialize database'
    );
    throw error;
  }
}