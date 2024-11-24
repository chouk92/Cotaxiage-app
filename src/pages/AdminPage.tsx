import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import CreateAdminButton from '../components/admin/CreateAdminButton';
import DatabaseInitializer from '../components/admin/DatabaseInitializer';
import SystemStatus from '../components/admin/SystemStatus';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function AdminPage() {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkInitialization = async () => {
      try {
        const systemDoc = await getDoc(doc(db, 'admin', 'system'));
        setInitialized(systemDoc.exists());
      } catch (error) {
        console.error('Error checking system status:', error);
        toast.error('Failed to check system status');
      } finally {
        setLoading(false);
      }
    };

    checkInitialization();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!initialized) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <CreateAdminButton />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
      
      <div className="space-y-8">
        <DatabaseInitializer />
        <SystemStatus />
      </div>
    </div>
  );
}