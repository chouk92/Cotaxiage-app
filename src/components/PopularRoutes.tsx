import React from 'react';
import { MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBookingStore } from '../stores/bookingStore';
import { ALL_STATIONS } from '../data/stations';

const routes = [
  {
    from: "gare-du-nord",
    to: "cdg",
    price: "€56",
    image: "https://images.unsplash.com/photo-1431274172761-fca41d930114?auto=format&fit=crop&q=80&w=400"
  },
  {
    from: "saint-germain",
    to: "orly",
    price: "€36",
    image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&q=80&w=400"
  },
  {
    from: "bastille",
    to: "cdg",
    price: "€56",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=400"
  }
];

export default function PopularRoutes() {
  const navigate = useNavigate();
  const { setPickup, setDropoff, setDate } = useBookingStore();

  const handleRouteClick = (fromId: string, toId: string) => {
    const pickupStation = ALL_STATIONS.find(s => s.id === fromId);
    const dropoffStation = ALL_STATIONS.find(s => s.id === toId);

    if (!pickupStation || !dropoffStation) return;

    setPickup({
      id: pickupStation.id,
      name: pickupStation.name,
      address: pickupStation.address,
      lat: pickupStation.location.lat,
      lng: pickupStation.location.lng
    });

    setDropoff({
      id: dropoffStation.id,
      name: dropoffStation.name,
      address: dropoffStation.address,
      lat: dropoffStation.location.lat,
      lng: dropoffStation.location.lng
    });

    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    setDate(tomorrow);

    navigate('/trips');
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">Popular Routes</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {routes.map((route, index) => {
          const fromStation = ALL_STATIONS.find(s => s.id === route.from);
          const toStation = ALL_STATIONS.find(s => s.id === route.to);

          if (!fromStation || !toStation) return null;

          return (
            <div 
              key={index} 
              className="group relative overflow-hidden rounded-xl shadow-lg transition-all hover:shadow-xl cursor-pointer"
              onClick={() => handleRouteClick(route.from, route.to)}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 z-10" />
              <img
                src={route.image}
                alt={fromStation.name}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{fromStation.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold">To: {toStation.name}</p>
                    <p className="text-sm opacity-90">Starting from {route.price}</p>
                  </div>
                  <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}