import { ParkingSpot, AppSettings } from '../types';

// Default clean production states - No fake mock data
export const INITIAL_ACTIVE_SPOT: ParkingSpot | null = null;

export const INITIAL_PARKING_HISTORY: ParkingSpot[] = [];

export const INITIAL_SETTINGS: AppSettings = {
  hasCompletedOnboarding: false,
  hasAgreedToLocationDisclosure: false,
  admobConsent: 'undecided',
  timerAlertsEnabled: true,
  mapView: 'flat',
  locationPermission: 'while_using',
  cameraPermission: 'granted',
  autoBluetoothDetection: false,
  isProUser: false,
  notifyBeforeMinutes: 10,
  soundAlerts: true,
  userProfile: {
    name: 'Driver',
    email: 'Myworkemail2023@gmail.com',
    vehicleName: 'My Car',
  },
};

// Optional developer helper for testing features in the style guide
export function getDemoSampleSpot(): ParkingSpot {
  return {
    id: `spot-sample-${Date.now()}`,
    latitude: 37.7749,
    longitude: -122.4194,
    address: '123 Market Street, San Francisco',
    note: 'Level 3, Blue Section, near elevator',
    levelOrSection: 'Level 3, Blue Section',
    floorNumber: '3',
    colorTag: 'blue',
    pillarNumber: 'B-14',
    savedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    isFound: false,
    accuracy: 3.5,
  };
}
