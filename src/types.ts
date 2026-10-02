export interface ParkingSpot {
  id: string;
  latitude: number;
  longitude: number;
  address: string;
  photoUri?: string;
  note?: string;
  levelOrSection?: string;
  floorNumber?: string;
  colorTag?: 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'orange';
  pillarNumber?: string;
  savedAt: string; // ISO string
  isFound: boolean;
  foundAt?: string;
  accuracy?: number;
}

export interface MeterTimer {
  id: string;
  spotId: string;
  durationMinutes: number;
  startsAt: number; // timestamp
  expiresAt: number; // timestamp
  notifyBeforeMinutes: number;
  isNotified: boolean;
  isActive: boolean;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  heading?: number | null;
  speed?: number | null;
  timestamp: number;
  address?: string;
}

export type MapViewType = 'flat' | 'satellite' | 'street';

export interface AppSettings {
  hasCompletedOnboarding: boolean;
  hasAgreedToLocationDisclosure: boolean;
  admobConsent: 'granted' | 'non_personalized' | 'undecided';
  timerAlertsEnabled: boolean;
  mapView: MapViewType;
  locationPermission: 'granted' | 'while_using' | 'denied';
  cameraPermission: 'granted' | 'denied';
  autoBluetoothDetection: boolean;
  isProUser: boolean;
  notifyBeforeMinutes: number;
  soundAlerts: boolean;
  userProfile: {
    name: string;
    email: string;
    vehicleName?: string;
  };
}

export type NavigationTab = 'map' | 'history' | 'settings';

export interface WalkingDirections {
  distanceMeters: number;
  walkingMinutes: number;
  bearingDegrees: number;
  cardinalDirection: string;
  streetInstruction: string;
  userLat: number;
  userLng: number;
  carLat: number;
  carLng: number;
}
