import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Transition } from '@headlessui/react';
import DatePicker from 'react-datepicker';
import { ALL_STATIONS } from '../../data/stations';
import "react-datepicker/dist/react-datepicker.css";

interface SearchFilters {
  pickup?: string;
  dropoff?: string;
  date?: Date;
  maxPrice?: number;
  availableSeats?: number;
}

interface AdvancedTripSearchProps {
  onSearch: (filters: SearchFilters) => void;
}

export default function AdvancedTripSearch({ onSearch }: AdvancedTripSearchProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const clearFilters = () => {
    setFilters({});
    onSearch({});
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {/* Basic Search */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pickup Location
              </label>
              <select
                value={filters.pickup || ''}
                onChange={(e) => setFilters(f => ({ ...f, pickup: e.target.value || undefined }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any location</option>
                {ALL_STATIONS.map(station => (
                  <option key={station.id} value={station.id}>
                    {station.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dropoff Location
              </label>
              <select
                value={filters.dropoff || ''}
                onChange={(e) => setFilters(f => ({ ...f, dropoff: e.target.value || undefined }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any location</option>
                {ALL_STATIONS.map(station => (
                  <option key={station.id} value={station.id}>
                    {station.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <DatePicker
                selected={filters.date}
                onChange={(date: Date) => setFilters(f => ({ ...f, date }))}
                dateFormat="MMMM d, yyyy"
                minDate={new Date()}
                placeholderText="Select date"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <Filter className="h-4 w-4" />
              <span>{showFilters ? 'Hide filters' : 'Show more filters'}</span>
            </button>

            {Object.keys(filters).length > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm text-red-600 hover:text-red-700 flex items-center space-x-1"
              >
                <X className="h-4 w-4" />
                <span>Clear filters</span>
              </button>
            )}
          </div>

          <Transition
            show={showFilters}
            enter="transition-opacity duration-150"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Price (€)
                </label>
                <input
                  type="number"
                  min="0"
                  value={filters.maxPrice || ''}
                  onChange={(e) => setFilters(f => ({ 
                    ...f, 
                    maxPrice: e.target.value ? Number(e.target.value) : undefined 
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Any price"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Available Seats
                </label>
                <select
                  value={filters.availableSeats || ''}
                  onChange={(e) => setFilters(f => ({ 
                    ...f, 
                    availableSeats: e.target.value ? Number(e.target.value) : undefined 
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any number of seats</option>
                  {[1, 2, 3].map(num => (
                    <option key={num} value={num}>{num} seat{num !== 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>
          </Transition>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Search className="h-5 w-5" />
              <span>Search Trips</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}