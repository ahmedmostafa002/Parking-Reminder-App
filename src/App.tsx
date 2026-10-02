import React, { useState, useEffect, useCallback } from 'react';
import {
  ParkingSpot,
  MeterTimer,
  UserLocation,
  AppSettings,
  NavigationTab,
} from './types';
import {
  INITIAL_ACTIVE_SPOT,
  INITIAL_PARKING_HISTORY,
  INITIAL_SETTINGS,
} from './data/mockData';
import { playNotificationTone, reverseGeocodeLocation } from './utils/geo';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { SpotSavedModal } from './components/SpotSavedModal';
import { SpotDetailsModal } from './components/SpotDetailsModal';
import { FindMyCarScreen } from './components/FindMyCarScreen';
import { TimerModal } from './components/TimerModal';
import { OverwriteWarningModal } from './components/OverwriteWarningModal';
import { BluetoothSimModal } from './components/BluetoothSimModal';
import { OnboardingScreen } from './components/OnboardingScreen';
import { ProminentDisclosureModal } from './components/ProminentDisclosureModal';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { AdMobConsentBanner } from './components/AdMobConsentBanner';
import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';

export default function App() {
  // Local storage hydrated states
  const [activeTab, setActiveTab] = useState<NavigationTab>('map');

  const [activeSpot, setActiveSpot] = useState<ParkingSpot | null>(() => {
    const saved = localStorage.getItem('spotsaver_active_spot');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVE_SPOT;
  });

  const [history, setHistory] = useState<ParkingSpot[]>(() => {
    const saved = localStorage.getItem('spotsaver_history');
    return saved ? JSON.parse(saved) : INITIAL_PARKING_HISTORY;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('spotsaver_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...INITIAL_SETTINGS, ...parsed };
      } catch (e) {
        return INITIAL_SETTINGS;
      }
    }
    return INITIAL_SETTINGS;
  });

  const [meterTimer, setMeterTimer] = useState<MeterTimer | null>(() => {
    const saved = localStorage.getItem('spotsaver_meter_timer');
    return saved ? JSON.parse(saved) : null;
  });

  // User live location state
  const [userLocation, setUserLocation] = useState<UserLocation>({
    latitude: 37.7749,
    longitude: -122.4194,
    accuracy: 5,
    heading: 0,
    timestamp: Date.now(),
    address: undefined,
  });

  // Modals state
  const [showSpotSavedModal, setShowSpotSavedModal] = useState(false);
  const [selectedSpotDetails, setSelectedSpotDetails] = useState<ParkingSpot | null>(null);
  const [navigatingToSpot, setNavigatingToSpot] = useState<ParkingSpot | null>(null);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [showOverwriteWarning, setShowOverwriteWarning] = useState(false);
  const [showBluetoothSim, setShowBluetoothSim] = useState(false);
  const [showPrivacyPolicyModal, setShowPrivacyPolicyModal] = useState(false);
  const [showLocationDisclosure, setShowLocationDisclosure] = useState(false);

  // Initialize AdMob on Root Mount
  useEffect(() => {
    try {
      AdMob.initialize({
        initializeForTesting: true,
      });
    } catch (err) {
      console.debug('AdMob init notice:', err);
    }
  }, []);

  // Centralized AdMob Banner Controller: Shows banner ONLY on the main History page
  useEffect(() => {
    async function handleBannerVisibility() {
      if (
        activeTab === 'history' &&
        !selectedSpotDetails &&
        !navigatingToSpot &&
        !showSpotSavedModal &&
        !showTimerModal &&
        !showOverwriteWarning &&
        !showBluetoothSim &&
        !showPrivacyPolicyModal
      ) {
        try {
          await AdMob.showBanner({
            adId: 'ca-app-pub-7634207857522304/7331512878',
            adSize: BannerAdSize.BANNER,
            position: BannerAdPosition.BOTTOM_CENTER,
            margin: 0,
            isTesting: true,
          });
        } catch (e) {
          console.debug('AdMob banner display notice:', e);
        }
      } else {
        try {
          await AdMob.hideBanner();
        } catch (e) {}
      }
    }

    handleBannerVisibility();
  }, [
    activeTab,
    selectedSpotDetails,
    navigatingToSpot,
    showSpotSavedModal,
    showTimerModal,
    showOverwriteWarning,
    showBluetoothSim,
    showPrivacyPolicyModal,
  ]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('spotsaver_active_spot', JSON.stringify(activeSpot));
  }, [activeSpot]);

  useEffect(() => {
    localStorage.setItem('spotsaver_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('spotsaver_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('spotsaver_meter_timer', JSON.stringify(meterTimer));
  }, [meterTimer]);

  // Request location helper
  const triggerLocationRequest = useCallback(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const addr = await reverseGeocodeLocation(lat, lon);

          setUserLocation({
            latitude: lat,
            longitude: lon,
            accuracy: position.coords.accuracy,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: position.timestamp,
            address: addr,
          });
        },
        (error) => {
          console.debug('Geolocation initial lookup notice:', error.message);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  }, []);

  // Real GPS Location Continuous Watcher
  useEffect(() => {
    if (
      'geolocation' in navigator &&
      settings.hasAgreedToLocationDisclosure &&
      settings.locationPermission !== 'denied'
    ) {
      triggerLocationRequest();

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: position.timestamp,
          }));
        },
        (error) => {
          console.debug('Geolocation watch notice:', error.message);
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 6000 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [settings.hasAgreedToLocationDisclosure, settings.locationPermission, triggerLocationRequest]);

  // Meter Timer Interval Watcher & Notification Trigger
  useEffect(() => {
    if (!meterTimer || !meterTimer.isActive) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const remainingMs = meterTimer.expiresAt - now;

      if (
        !meterTimer.isNotified &&
        settings.timerAlertsEnabled &&
        remainingMs <= meterTimer.notifyBeforeMinutes * 60 * 1000 &&
        remainingMs > 0
      ) {
        if (settings.soundAlerts) {
          playNotificationTone('warning');
        }
        setMeterTimer((prev) => (prev ? { ...prev, isNotified: true } : null));

        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('SpotSaver Parking Meter Alert', {
            body: `Your parking meter expires in ${meterTimer.notifyBeforeMinutes} minutes!`,
          });
        }
      }

      if (remainingMs <= 0) {
        if (settings.soundAlerts) {
          playNotificationTone('warning');
        }
        setMeterTimer((prev) => (prev ? { ...prev, isActive: false } : null));
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [meterTimer, settings.timerAlertsEnabled, settings.soundAlerts]);

  // Execute direct spot save
  const executeSaveCurrentSpot = useCallback(
    async (
      photoUri?: string,
      customNotes?: { levelOrSection?: string; note?: string; pillarNumber?: string; colorTag?: ParkingSpot['colorTag'] }
    ) => {
      let spotAddress = userLocation.address;
      if (!spotAddress) {
        spotAddress = await reverseGeocodeLocation(userLocation.latitude, userLocation.longitude);
      }

      const newSpot: ParkingSpot = {
        id: `spot-${Date.now()}`,
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        address: spotAddress || `Spot at (${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)})`,
        photoUri: photoUri,
        note: customNotes?.note,
        levelOrSection: customNotes?.levelOrSection,
        pillarNumber: customNotes?.pillarNumber,
        colorTag: customNotes?.colorTag || 'blue',
        savedAt: new Date().toISOString(),
        isFound: false,
        accuracy: userLocation.accuracy,
      };

      if (settings.soundAlerts) {
        playNotificationTone('success');
      }

      setActiveSpot(newSpot);
      setHistory((prev) => [newSpot, ...prev]);
      setShowSpotSavedModal(true);
    },
    [userLocation, settings.soundAlerts]
  );

  const handleParkHereClick = () => {
    if (!settings.hasAgreedToLocationDisclosure) {
      setShowLocationDisclosure(true);
      return;
    }

    if (activeSpot && !activeSpot.isFound) {
      setShowOverwriteWarning(true);
    } else {
      executeSaveCurrentSpot();
    }
  };

  const handleFoundAndSaveNew = () => {
    if (activeSpot) {
      setHistory((prev) =>
        prev.map((s) => (s.id === activeSpot.id ? { ...s, isFound: true, foundAt: new Date().toISOString() } : s))
      );
    }
    setShowOverwriteWarning(false);
    executeSaveCurrentSpot();
  };

  const handleForceOverwrite = () => {
    setShowOverwriteWarning(false);
    executeSaveCurrentSpot();
  };

  const handleCarFound = (spotId: string) => {
    if (activeSpot && activeSpot.id === spotId) {
      setActiveSpot(null);
    }
    setHistory((prev) =>
      prev.map((s) => (s.id === spotId ? { ...s, isFound: true, foundAt: new Date().toISOString() } : s))
    );
    if (meterTimer && meterTimer.spotId === spotId) {
      setMeterTimer(null);
    }
    setNavigatingToSpot(null);
    setSelectedSpotDetails(null);
  };

  const handleDeleteSpot = (spotId: string) => {
    if (activeSpot && activeSpot.id === spotId) {
      setActiveSpot(null);
    }
    setHistory((prev) => prev.filter((s) => s.id !== spotId));
    if (selectedSpotDetails?.id === spotId) {
      setSelectedSpotDetails(null);
    }
  };

  const handleClearAllHistory = () => {
    setHistory([]);
    setActiveSpot(null);
    setMeterTimer(null);
  };

  const handleFullDataErase = () => {
    localStorage.clear();
    setActiveSpot(null);
    setHistory([]);
    setMeterTimer(null);
    setSettings(INITIAL_SETTINGS);
    alert('All local spot history and settings have been completely erased.');
  };

  const handleSetTimer = (durationMinutes: number, notifyBeforeMinutes: number) => {
    const startsAt = Date.now();
    const expiresAt = startsAt + durationMinutes * 60 * 1000;

    const newTimer: MeterTimer = {
      id: `timer-${Date.now()}`,
      spotId: activeSpot ? activeSpot.id : 'general',
      durationMinutes,
      startsAt,
      expiresAt,
      notifyBeforeMinutes,
      isNotified: false,
      isActive: true,
    };

    setMeterTimer(newTimer);
  };

  const handleExtendTimer = (additionalMinutes: number) => {
    if (!meterTimer) return;
    const newExpiresAt = meterTimer.expiresAt + additionalMinutes * 60 * 1000;
    setMeterTimer({
      ...meterTimer,
      durationMinutes: meterTimer.durationMinutes + additionalMinutes,
      expiresAt: newExpiresAt,
      isNotified: false,
      isActive: true,
    });
  };

  const handleCancelTimer = () => {
    setMeterTimer(null);
  };

  const handleUpdateSpotNotes = (notes: {
    note?: string;
    levelOrSection?: string;
    floorNumber?: string;
    colorTag?: ParkingSpot['colorTag'];
    pillarNumber?: string;
    photoUri?: string;
  }) => {
    if (activeSpot) {
      const updated = { ...activeSpot, ...notes };
      setActiveSpot(updated);
      setHistory((prev) => prev.map((s) => (s.id === activeSpot.id ? updated : s)));
    }
  };

  const handleUpdatePhoto = (spotId: string, newPhotoUri: string) => {
    if (activeSpot && activeSpot.id === spotId) {
      setActiveSpot({ ...activeSpot, photoUri: newPhotoUri });
    }
    setHistory((prev) =>
      prev.map((s) => (s.id === spotId ? { ...s, photoUri: newPhotoUri } : s))
    );
    if (selectedSpotDetails && selectedSpotDetails.id === spotId) {
      setSelectedSpotDetails({ ...selectedSpotDetails, photoUri: newPhotoUri });
    }
  };

  const handleCompleteOnboarding = () => {
    setSettings((prev) => ({ ...prev, hasCompletedOnboarding: true }));
    if (!settings.hasAgreedToLocationDisclosure) {
      setShowLocationDisclosure(true);
    }
  };

  const handleLocationDisclosureAccept = () => {
    setSettings((prev) => ({
      ...prev,
      hasAgreedToLocationDisclosure: true,
      locationPermission: 'while_using',
    }));
    setShowLocationDisclosure(false);
    triggerLocationRequest();
  };

  const handleLocationDisclosureDeny = () => {
    setSettings((prev) => ({
      ...prev,
      hasAgreedToLocationDisclosure: true,
      locationPermission: 'denied',
    }));
    setShowLocationDisclosure(false);
  };

  return (
    <div className="relative w-full h-[100dvh] max-w-lg mx-auto bg-[#FAF7F2] flex flex-col overflow-hidden shadow-2xl">
      {/* 1. First-Run Onboarding Flow */}
      {!settings.hasCompletedOnboarding && (
        <OnboardingScreen onComplete={handleCompleteOnboarding} />
      )}

      {/* 2. Google Play Prominent Location Disclosure Modal */}
      {showLocationDisclosure && (
        <ProminentDisclosureModal
          onAccept={handleLocationDisclosureAccept}
          onDeny={handleLocationDisclosureDeny}
        />
      )}

      {/* Top Navbar */}
      <Navbar
        currentTab={activeTab}
        onOpenSettings={() => setActiveTab('settings')}
        meterTimer={meterTimer}
        onOpenTimerModal={() => setShowTimerModal(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full h-full relative overflow-hidden">
        {activeTab === 'map' && (
          <HomeScreen
            userLocation={userLocation}
            savedSpot={activeSpot}
            meterTimer={meterTimer}
            mapViewType={settings.mapView}
            onParkHereClick={handleParkHereClick}
            onViewSpotDetails={(spot) => setSelectedSpotDetails(spot)}
            onFindMyCar={(spot) => setNavigatingToSpot(spot)}
            onOpenTimerModal={() => setShowTimerModal(true)}
            onRecenterMap={() => {
              if (!settings.hasAgreedToLocationDisclosure) {
                setShowLocationDisclosure(true);
              } else {
                triggerLocationRequest();
              }
            }}
          />
        )}

        {activeTab === 'history' && (
          <HistoryScreen
            history={history}
            onSelectSpot={(spot) => setSelectedSpotDetails(spot)}
            onDeleteSpot={handleDeleteSpot}
            onClearAll={handleClearAllHistory}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsScreen
            settings={settings}
            onUpdateSettings={(updated) => setSettings({ ...settings, ...updated })}
            onSimulateBluetooth={() => setShowBluetoothSim(true)}
            onOpenPrivacyPolicy={() => setShowPrivacyPolicyModal(true)}
            onClearAllData={handleFullDataErase}
          />
        )}
      </main>

      {/* AdMob Consent Banner (EU / GDPR Compliance) */}
      {settings.admobConsent === 'undecided' && settings.hasCompletedOnboarding && (
        <AdMobConsentBanner
          onConsent={(choice) => setSettings({ ...settings, admobConsent: choice })}
          onOpenPrivacyPolicy={() => setShowPrivacyPolicyModal(true)}
          onOpenPro={() => setSettings({ ...settings, admobConsent: 'non_personalized' })}
        />
      )}

      {/* Bottom Floating Navigation Dock */}
      <BottomNav
        currentTab={activeTab}
        onChangeTab={(tab) => {
          setActiveTab(tab);
          setNavigatingToSpot(null);
          setSelectedSpotDetails(null);
        }}
        hasActiveSpot={activeSpot !== null && !activeSpot.isFound}
      />

      {/* Spot Saved Confirmation Modal */}
      {showSpotSavedModal && activeSpot && (
        <SpotSavedModal
          spot={activeSpot}
          onClose={() => setShowSpotSavedModal(false)}
          onAddPhoto={() => {
            setShowSpotSavedModal(false);
            setSelectedSpotDetails(activeSpot);
          }}
          onSetTimer={() => {
            setShowSpotSavedModal(false);
            setShowTimerModal(true);
          }}
          onUpdateSpotNotes={handleUpdateSpotNotes}
        />
      )}

      {/* Spot Details Screen */}
      {selectedSpotDetails && (
        <SpotDetailsModal
          spot={selectedSpotDetails}
          onBack={() => setSelectedSpotDetails(null)}
          onFindMyCar={(spot) => {
            setSelectedSpotDetails(null);
            setNavigatingToSpot(spot);
          }}
          onDeleteSpot={(spotId) => {
            handleDeleteSpot(spotId);
            setSelectedSpotDetails(null);
          }}
          onViewOnMap={() => {
            setSelectedSpotDetails(null);
            setActiveTab('map');
          }}
          onUpdatePhoto={handleUpdatePhoto}
        />
      )}

      {/* Find My Car Walking Directions */}
      {navigatingToSpot && (
        <FindMyCarScreen
          spot={navigatingToSpot}
          userLocation={userLocation}
          onBack={() => setNavigatingToSpot(null)}
          onFoundCar={handleCarFound}
          soundAlertsEnabled={settings.soundAlerts}
        />
      )}

      {/* Overwrite Warning Dialog */}
      {showOverwriteWarning && activeSpot && (
        <OverwriteWarningModal
          existingSpot={activeSpot}
          onFoundAndSaveNew={handleFoundAndSaveNew}
          onNavigateToExisting={() => {
            setShowOverwriteWarning(false);
            setNavigatingToSpot(activeSpot);
          }}
          onForceOverwrite={handleForceOverwrite}
          onCancel={() => setShowOverwriteWarning(false)}
        />
      )}

      {/* Meter Timer Modal */}
      {showTimerModal && (
        <TimerModal
          activeTimer={meterTimer}
          spotId={activeSpot?.id || 'general'}
          onSetTimer={handleSetTimer}
          onExtendTimer={handleExtendTimer}
          onCancelTimer={handleCancelTimer}
          onClose={() => setShowTimerModal(false)}
        />
      )}

      {/* Privacy Policy & Terms Modal */}
      {showPrivacyPolicyModal && (
        <PrivacyPolicyModal
          onClose={() => setShowPrivacyPolicyModal(false)}
          onClearAllData={handleFullDataErase}
        />
      )}

      {/* Bluetooth Auto-Park Simulator Modal */}
      {showBluetoothSim && (
        <BluetoothSimModal
          vehicleName={settings.userProfile.vehicleName}
          onSimulateDisconnect={(deviceName) => {
            executeSaveCurrentSpot(undefined, {
              note: `Auto-saved via ${deviceName || 'Car Bluetooth'} Disconnect`,
              levelOrSection: 'Ground Lot',
            });
          }}
          onClose={() => setShowBluetoothSim(false)}
        />
      )}
    </div>
  );
}
