import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';

export default function CreateAdminButton() {
  const [creating, setCreating] = useState(false);

  const handleCreateAdmin = async () => {
    if (!confirm('This will set up the admin account. Continue?')) {
      return;
    }

    setCreating(true);
    try {
      // Create admin user with email/password
      const { user } = await createUserWithEmailAndPassword(
        auth,
        'admin@cotaxiage.com',
        'CoTaxiage2024!'
      );

      // Create admin user document
      await setDoc(doc(db, 'users', user.uid), {
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
      });

      // Create admin system document
      await setDoc(doc(db, 'admin', 'system'), {
        initialized: true,
        lastInitializedBy: user.uid,
        lastInitializedAt: serverTimestamp(),
        version: '1.0.0',
        superAdminId: user.uid
      });

      toast.success('Admin configuration completed successfully!');
      window.location.reload();
    } catch (error: any) {
      console.error('Admin creation error:', error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Admin account already exists');
      } else {
        toast.error('Failed to create admin account. Please try again.');
      }
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Admin Configuration</h2>
      <p className="text-gray-600 mb-6">
        No admin configuration detected. Set up now to manage the system.
      </p>
      <button
        onClick={handleCreateAdmin}
        disabled={creating}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
      >
        {creating ? 'Setting up admin...' : 'Set Up Admin Account'}
      </button>
    </div>
  );
}