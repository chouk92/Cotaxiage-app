import { create } from 'zustand';
import { Location } from '../types/booking';

interface BookingState {
  pickup: Location | null;
  dropoff: Location | null;
  date: Date | null;
  passengers: number;
  fare: number;
  setPickup: (location: Location | null) => void;
  setDropoff: (location: Location | null) => void;
  setDate: (date: Date | null) => void;
  setPassengers: (count: number) => void;
  setFare: (amount: number) => void;
  reset: () => void;
}

const initialState = {
  pickup: null,
  dropoff: null,
  date: null,
  passengers: 1,
  fare: 0,
};

export const useBookingStore = create<BookingState>((set) => ({
  ...initialState,
  setPickup: (location) => set({ pickup: location }),
  setDropoff: (location) => set({ dropoff: location }),
  setDate: (date) => set({ date }),
  setPassengers: (count) => {
    if (count >= 1 && count <= 3) {
      set({ passengers: count });
    }
  },
  setFare: (amount) => set({ fare: amount }),
  reset: () => set(initialState),
}));