import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { initializeCollections } from '../../utils/initializeCollections';

export default function InitializeButton() {
  const [initializing, setInitializing] = useState(false);

  const handleInitialize = async () => {
    setInitializing(true);
    try {
      await initializeCollections();
      toast.success('Firebase collections initialized successfully');
    } catch (error) {
      console.error('Initialization error:', error);
      toast.error('Failed to initialize collections');
    } finally {
      setInitializing(false);
    }
  };

  return (
    <button
      onClick={handleInitialize}
      disabled={initializing}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
    >
      {initializing ? 'Initializing...' : 'Initialize Collections'}
    </button>
  );
}