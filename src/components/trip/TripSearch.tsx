import React, { useState } from 'react';
import { Search, MapPin, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import { ALL_STATIONS } from '../../data/stations';
import "react-datepicker/dist/react-datepicker.css";

interface TripSearchProps {
  onSearch: (filters: {
    location?: string;
    date?: Date;
  }) => void;
}

export default function TripSearch({ onSearch }: TripSearchProps) {
  const [location, setLocation] = useState<string>('');
  const [date, setDate] = useState<Date | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      location: location || undefined,
      date: date || undefined,
    });
  };

  return (
    <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All locations</option>
            {ALL_STATIONS.map(station => (
              <option key={station.id} value={station.id}>
                {station.name}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <DatePicker
            selected={date}
            onChange={(date: Date) => setDate(date)}
            dateFormat="MMMM d, yyyy"
            minDate={new Date()}
            placeholderText="Select date"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Search className="h-5 w-5" />
          <span>Search Trips</span>
        </button>
      </div>
    </form>
  );
}