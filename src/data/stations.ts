// Paris Train Stations
export const TRAIN_STATIONS = [
  {
    id: 'gare-de-lyon',
    name: 'Gare de Lyon',
    type: 'train',
    location: { lat: 48.84414213061917, lng: 2.3768609563012624 },
    address: '20 Boulevard Diderot, 75012 Paris'
  },
  {
    id: 'gare-austerlitz',
    name: 'Gare d\'Austerlitz',
    type: 'train',
    location: { lat: 48.842782176737195, lng: 2.366443239664965 },
    address: '85 Quai d\'Austerlitz, 75013 Paris'
  },
  {
    id: 'gare-montparnasse',
    name: 'Gare Montparnasse',
    type: 'train',
    location: { lat: 48.841098835106344, lng: 2.317884809279539 },
    address: '17 Boulevard de Vaugirard, 75015 Paris'
  }
] as const;

// Paris Airports
export const AIRPORTS = [
  {
    id: 'cdg',
    name: 'Charles de Gaulle Airport',
    type: 'airport',
    location: { lat: 49.009691, lng: 2.547925 },
    address: '95700 Roissy-en-France',
    terminals: ['Terminal 1', 'Terminal 2', 'Terminal 3']
  },
  {
    id: 'orly',
    name: 'Paris Orly Airport',
    type: 'airport',
    location: { lat: 48.725278, lng: 2.359444 },
    address: '94390 Orly',
    terminals: ['Terminal 1', 'Terminal 2', 'Terminal 3', 'Terminal 4']
  }
] as const;

// Paris Taxi Stations - Right Bank (Rive Droite)
export const RIGHT_BANK_STATIONS = [
  {
    id: 'haussmann-chaussee-antin',
    name: 'Haussmann / Chaussée d\'Antin',
    type: 'taxi',
    location: { lat: 48.872837984471694, lng: 2.3335711538224615 },
    address: '23 Boulevard Haussmann',
    district: 'right-bank'
  },
  {
    id: 'opera',
    name: 'Opéra',
    type: 'taxi',
    location: { lat: 48.86802072101611, lng: 2.3336487113910276 },
    address: '30 Avenue de l\'Opéra',
    district: 'right-bank'
  },
  // ... Add all other Right Bank stations here
] as const;

// Paris Taxi Stations - Left Bank (Rive Gauche)
export const LEFT_BANK_STATIONS = [
  {
    id: 'saint-antoine',
    name: 'Rue Saint Antoine',
    type: 'taxi',
    location: { lat: 48.85336439015277, lng: 2.3667863819295443 },
    address: '13 Rue Saint-Antoine',
    district: 'left-bank'
  },
  {
    id: 'breteuil-hauy',
    name: 'Place de Breteuil / Valentin Hauy',
    type: 'taxi',
    location: { lat: 48.84718552920911, lng: 2.3110011131633645 },
    address: '4 Place de Breteuil',
    district: 'left-bank'
  },
  // ... Add all other Left Bank stations here
] as const;

// Combined taxi stations
export const TAXI_STATIONS = [...RIGHT_BANK_STATIONS, ...LEFT_BANK_STATIONS] as const;

// All stations combined
export const ALL_STATIONS = [...TRAIN_STATIONS, ...AIRPORTS, ...TAXI_STATIONS] as const;

export type Station = typeof ALL_STATIONS[number];
export type TaxiStation = typeof TAXI_STATIONS[number];
export type TrainStation = typeof TRAIN_STATIONS[number];
export type Airport = typeof AIRPORTS[number];