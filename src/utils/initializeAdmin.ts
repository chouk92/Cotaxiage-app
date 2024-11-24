import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-hot-toast';

const ADMIN_EMAIL = 'admin@cotaxiage.com';
const ADMIN_PASSWORD = 'CoTaxiage2024!'; // Strong password with special characters

export async function initializeAdmin(uid: string) {
  try {
    // Create admin auth account if it doesn't exist
    try {
      await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
      toast.success('Admin account created successfully');
    } catch (error) {
      if (error.code !== 'auth/email-already-in-use') {
        throw error;
      }
    }

    // Set up admin user document
    const adminRef = doc(db, 'users', uid);
    await setDoc(adminRef, {
      email: ADMIN_EMAIL,
      displayName: 'Super Admin',
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

    // Create admin system document
    const adminSystemRef = doc(db, 'admin', 'system');
    await setDoc(adminSystemRef, {
      initialized: true,
      lastInitializedBy: uid,
      lastInitializedAt: serverTimestamp(),
      version: '1.0.0',
      superAdminId: uid
    });

    return true;
  } catch (error) {
    console.error('Error initializing admin:', error);
    toast.error('Failed to initialize admin account');
    throw error;
  }
}