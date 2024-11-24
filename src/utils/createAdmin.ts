import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export async function createAdminAccount() {
  const email = 'admin@cotaxiage.com';
  const password = 'CoTaxiage2024!';

  try {
    // Check if admin system document exists
    const systemDoc = await getDoc(doc(db, 'admin', 'system'));
    if (systemDoc.exists()) {
      throw new Error('Admin account already exists');
    }

    // Create admin user with email/password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;

    // Set up admin user document
    await setDoc(doc(db, 'users', user.uid), {
      email: email,
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
    });

    // Set up admin system document
    await setDoc(doc(db, 'admin', 'system'), {
      initialized: true,
      lastInitializedBy: user.uid,
      lastInitializedAt: serverTimestamp(),
      version: '1.0.0',
      superAdminId: user.uid
    });

    return user;
  } catch (error) {
    console.error('Error creating admin account:', error);
    throw error;
  }
}