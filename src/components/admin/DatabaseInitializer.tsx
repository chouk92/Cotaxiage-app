import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { initializeFirestore } from '../../utils/initializeFirestore';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function DatabaseInitializer() {
  const [initializing, setInitializing] = useState(false);
  const { user } = useAuth();

  const handleInitialize = async () => {
    if (!user?.email?.endsWith('@cotaxiage.com')) {
      toast.error('Only administrators can initialize the database');
      return;
    }

    if (!confirm('This will initialize the database with required collections. Continue?')) {
      return;
    }

    setInitializing(true);
    try {
      // Check if admin system document already exists
      const adminDoc = await getDoc(doc(db, 'admin', 'system'));
      if (adminDoc.exists()) {
        toast.error('Database is already initialized');
        return;
      }

      await initializeFirestore(user.uid);
      window.location.reload();
    } catch (error: any) {
      console.error('Error:', error);
      if (error.code === 'permission-denied') {
        toast.error('You do not have permission to initialize the database');
      } else {
        toast.error('Failed to initialize database');
      }
    } finally {
      setInitializing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Database Initialization</h2>
      <p className="text-gray-600 mb-6">
        Initialize the database with required collections and sample data.
      </p>
      <button
        onClick={handleInitialize}
        disabled={initializing || !user?.email?.endsWith('@cotaxiage.com')}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {initializing ? 'Initializing...' : 'Initialize Database'}
      </button>
    </div>
  );
}