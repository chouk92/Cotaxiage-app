import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookingStore } from '../../../stores/bookingStore';
import RideSelection from '../RideSelection';

export default function SelectionStep() {
  const navigate = useNavigate();
  const { fare } = useBookingStore();

  const handleContinue = () => {
    if (!fare) return;
    navigate('/booking/payment');
  };

  return (
    <div className="space-y-6">
      <RideSelection />
      
      <div className="flex justify-between">
        <button
          onClick={() => navigate('/booking')}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={!fare}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}