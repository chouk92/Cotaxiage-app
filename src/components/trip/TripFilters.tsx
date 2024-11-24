import React from 'react';
import { format } from 'date-fns';
import { Filter, Calendar, MapPin, X } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ALL_STATIONS } from '../../data/stations';

interface TripFiltersProps {
  selectedDate: Date | null;
  selectedLocation: string | null;
  onDateChange: (date: Date | null) => void;
  onLocationChange: (location: string | null) => void;
  tripCount: number;
}

export default function TripFilters({
  selectedDate,
  selectedLocation,
  onDateChange,
  onLocationChange,
  tripCount
}: TripFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="flex flex-wrap gap-4">
          {/* Date Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date) => onDateChange(date)}
              dateFormat="MMM d, yyyy"
              minDate={new Date()}
              placeholderText="Select date"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {selectedDate && (
              <button
                onClick={() => onDateChange(null)}
                className="absolute inset-y-0 right-2 flex items-center"
                title="Clear date"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Location Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={selectedLocation || ''}
              onChange={(e) => onLocationChange(e.target.value || null)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All locations</option>
              {ALL_STATIONS.map(station => (
                <option key={station.id} value={station.id}>
                  {station.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Filter className="h-4 w-4" />
          <span>
            {tripCount} {tripCount === 1 ? 'trip' : 'trips'} available
          </span>
        </div>
      </div>
    </div>
  );
}