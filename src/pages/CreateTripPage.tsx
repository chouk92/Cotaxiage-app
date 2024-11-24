import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import CreateTripForm from '../components/trip/CreateTripForm';
import { useAuth } from '../contexts/AuthContext';

export default function CreateTripPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    toast.error('Please sign in to create a trip');
    navigate('/login');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create a Trip</h1>
        <p className="mt-2 text-gray-600">Share your taxi ride with others and split the fare</p>
      </div>
      <CreateTripForm />
    </div>
  );
}