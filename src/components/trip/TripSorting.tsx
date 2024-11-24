import React from 'react';
import { ArrowUpDown } from 'lucide-react';

interface TripSortingProps {
  sortBy: 'date' | 'price';
  onSortChange: (sort: 'date' | 'price') => void;
}

export default function TripSorting({ sortBy, onSortChange }: TripSortingProps) {
  return (
    <div className="flex items-center space-x-4 mb-4">
      <span className="text-sm text-gray-600">Sort by:</span>
      <button
        onClick={() => onSortChange('date')}
        className={`text-sm px-3 py-1 rounded-md ${
          sortBy === 'date'
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <div className="flex items-center space-x-1">
          <span>Date</span>
          <ArrowUpDown className="h-4 w-4" />
        </div>
      </button>
      <button
        onClick={() => onSortChange('price')}
        className={`text-sm px-3 py-1 rounded-md ${
          sortBy === 'price'
            ? 'bg-blue-100 text-blue-700'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        <div className="flex items-center space-x-1">
          <span>Price</span>
          <ArrowUpDown className="h-4 w-4" />
        </div>
      </button>
    </div>
  );
}