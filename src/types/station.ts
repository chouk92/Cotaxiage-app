export interface TaxiStation {
  id: string;
  name: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  capacity: number;
  isActive: boolean;
  district: string;
  operatingHours: {
    open: string;
    close: string;
  };
}