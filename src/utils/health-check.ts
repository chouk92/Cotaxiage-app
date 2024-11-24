import { getAuth, signInAnonymously } from 'firebase/auth';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'error';
  message: string;
  timestamp: Date;
}

interface SystemHealth {
  firebase: HealthStatus;
  database: HealthStatus;
  pwa: HealthStatus;
}

export async function checkSystemHealth(): Promise<SystemHealth> {
  const health: SystemHealth = {
    firebase: await checkFirebaseHealth(),
    database: await checkDatabaseHealth(),
    pwa: await checkPWAHealth()
  };

  return health;
}

async function checkFirebaseHealth(): Promise<HealthStatus> {
  try {
    const auth = getAuth();
    await signInAnonymously(auth);
    return {
      status: 'healthy',
      message: 'Firebase Authentication is operational',
      timestamp: new Date()
    };
  } catch (error) {
    return {
      status: 'error',
      message: `Firebase Authentication error: ${error.message}`,
      timestamp: new Date()
    };
  }
}

async function checkDatabaseHealth(): Promise<HealthStatus> {
  try {
    const stationsRef = collection(db, 'stations');
    const q = query(stationsRef, limit(1));
    await getDocs(q);
    return {
      status: 'healthy',
      message: 'Firestore connection is operational',
      timestamp: new Date()
    };
  } catch (error) {
    return {
      status: 'error',
      message: `Firestore error: ${error.message}`,
      timestamp: new Date()
    };
  }
}

async function checkPWAHealth(): Promise<HealthStatus> {
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    return {
      status: registration ? 'healthy' : 'degraded',
      message: registration 
        ? 'Service Worker is registered and active' 
        : 'Service Worker is not registered',
      timestamp: new Date()
    };
  } catch (error) {
    return {
      status: 'error',
      message: `PWA error: ${error.message}`,
      timestamp: new Date()
    };
  }
}