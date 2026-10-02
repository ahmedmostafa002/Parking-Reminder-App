import React, { useState } from 'react';
import {
  Car,
  MapPin,
  Navigation,
  Clock,
  LocateFixed,
  Eye,
  ChevronUp,
  ChevronDown,
  Camera,
  Layers,
  Sparkles,
  Compass,
  Share2,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { ParkingSpot, UserLocation, MeterTimer, MapViewType } from '../types';
import {
  formatRelativeSavedTime,
  calculateDistanceMeters,
  shareSpotLocation,
  triggerHapticFeedback,
} from '../utils/geo';
import { MapView } from './MapView';

interface HomeScreenProps {
  userLocation: UserLocation;
  savedSpot: ParkingSpot | null;
  meterTimer: MeterTimer | null;
  mapViewType: MapViewType;
  onParkHereClick: () => void;
  onViewSpotDetails: (spot: ParkingSpot) => void;
  onFindMyCar: (spot: ParkingSpot) => void;
  onOpenTimerModal: () => void;
  onRecenterMap?: () => void;
}

type SheetState = 'collapsed' | 'default' | 'expanded';

export const HomeScreen: React.FC<HomeScreenProps> = ({
  userLocation,
  savedSpot,
  meterTimer,
  mapViewType,
  onParkHereClick,
  onViewSpotDetails,
  onFindMyCar,
  onOpenTimerModal,
  onRecenterMap,
}) => {
  const [sheetState, setSheetState] = useState<SheetState>('default');
  const [copiedShareToast, setCopiedShareToast] = useState(false);

  // Calculate live meter remaining time if timer active
  const getTimerRemainingText = () => {
    if (!meterTimer || !meterTimer.isActive) return null;
    const diffMs = meterTimer.expiresAt - Date.now();
    if (diffMs <= 0) return 'Meter Expired!';
    const mins = Math.ceil(diffMs / (1000 * 60));
    if (mins >= 60) {
      const hrs = Math.floor(mins / 60);
      const remMins = mins % 60;
      return `${hrs}h ${remMins}m left`;
    }
    return `${mins}m left`;
  };

  const timerRemaining = getTimerRemainingText();

  const handleToggleSheet = () => {
    triggerHapticFeedback('light');
    setSheetState((prev) => {
      if (prev === 'collapsed') return 'default';
      if (prev === 'default') return 'expanded';
      return 'collapsed';
    });
  };

  const handleShare = async (spot: ParkingSpot, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHapticFeedback('medium');
    const shared = await shareSpotLocation(spot);
    if (shared) {
      setCopiedShareToast(true);
      setTimeout(() => setCopiedShareToast(false), 2500);
    }
  };

  const distanceMeters = savedSpot
    ? calculateDistanceMeters(
        userLocation.latitude,
        userLocation.longitude,
        savedSpot.latitude,
        savedSpot.longitude
      )
    : null;

  // Weak GPS signal indicator (common in underground basements/garages)
  const isUndergroundOrWeakGps = userLocation.accuracy && userLocation.accuracy > 20;

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden font-['Outfit']">
      {/* Top Floating Status Pills */}
      <div className="absolute top-16 left-0 right-0 z-20 flex flex-col items-center pointer-events-none px-4 space-y-2">
        {/* Share Feedback Toast */}
        {copiedShareToast && (
          <div className="pointer-events-auto flex items-center space-x-1.5 px-4 py-2 bg-stone-900 text-white rounded-full text-xs font-bold shadow-xl animate-fade-in border border-white/20">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Spot link shared / copied to clipboard!</span>
          </div>
        )}

        {/* Underground / Weak GPS Signal Helper */}
        {isUndergroundOrWeakGps && !savedSpot && (
          <div className="pointer-events-auto flex items-center space-x-2 px-3.5 py-1.5 bg-amber-500/90 text-stone-950 backdrop-blur-md rounded-full text-xs font-bold shadow-md border border-amber-300 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5 text-stone-950" />
            <span>Underground / Weak GPS — Add floor photo or note</span>
          </div>
        )}

        {/* Saved Spot Status Pill */}
        {savedSpot && !savedSpot.isFound && (
          <div className="flex items-center space-x-2 pointer-events-auto">
            <button
              onClick={() => {
                triggerHapticFeedback('light');
                onViewSpotDetails(savedSpot);
              }}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#D2F4E8] hover:bg-[#c2eddE] text-[#0F766E] rounded-full text-xs font-bold shadow-xs border border-[#b2e5d3] transition-all hover:scale-105 active:scale-95"
            >
              <MapPin className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>{formatRelativeSavedTime(savedSpot.savedAt)}</span>
            </button>

            {/* 1-Tap Share Button */}
            <button
              onClick={(e) => handleShare(savedSpot, e)}
              className="flex items-center space-x-1 px-3 py-1.5 bg-white/95 text-stone-700 hover:text-stone-950 rounded-full text-xs font-bold shadow-xs border border-stone-300 transition-all hover:scale-105 active:scale-95"
              title="Share spot with friends or family"
            >
              <Share2 className="w-3.5 h-3.5 text-[#FF5A36]" />
              <span>Share</span>
            </button>
          </div>
        )}

        {/* Active Meter Banner Pill */}
        {meterTimer && meterTimer.isActive && (
          <button
            onClick={() => {
              triggerHapticFeedback('light');
              onOpenTimerModal();
            }}
            className={`pointer-events-auto flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-xs border transition-all hover:scale-105 ${
              (meterTimer.expiresAt - Date.now()) < 10 * 60 * 1000
                ? 'bg-rose-100 text-rose-800 border-rose-200 animate-pulse'
                : 'bg-amber-100 text-amber-800 border-amber-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-current" />
            <span>Meter: {timerRemaining}</span>
          </button>
        )}
      </div>

      {/* Main Interactive Map Canvas */}
      <div className="relative flex-1 w-full bg-[#f4f1ea]">
        <MapView
          userLocation={userLocation}
          savedSpot={savedSpot}
          showRoute={false}
          mapViewType={mapViewType}
          interactive={true}
          className="w-full h-full"
        />

        {/* Re-center / Locate Me Button */}
        <button
          onClick={() => {
            triggerHapticFeedback('light');
            onRecenterMap?.();
          }}
          className="absolute bottom-52 right-4 z-20 w-12 h-12 bg-white/95 rounded-2xl shadow-xl border border-stone-200/90 flex items-center justify-center text-stone-700 hover:text-[#FF5A36] hover:scale-105 active:scale-95 transition-transform"
          title="Current GPS Location"
        >
          <LocateFixed className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Floating Action Card with Expand/Collapse Bottom Sheet */}
      <div
        className={`relative z-20 bg-white/95 backdrop-blur-xl rounded-t-3xl border-t border-stone-200/80 shadow-2xl px-5 max-w-md w-full mx-auto transition-all duration-300 ease-in-out ${
          sheetState === 'collapsed'
            ? 'pb-24 pt-2'
            : sheetState === 'expanded'
            ? 'pb-28 pt-2.5 max-h-[75vh] overflow-y-auto'
            : 'pb-28 pt-2.5'
        }`}
      >
        {/* Interactive Drag/Click Handle Bar */}
        <button
          onClick={handleToggleSheet}
          className="w-full py-2 flex flex-col items-center justify-center cursor-pointer group focus:outline-hidden"
          title={sheetState === 'expanded' ? 'Collapse panel' : 'Expand panel'}
          aria-label="Toggle panel height"
        >
          <div className="flex items-center space-x-1 text-stone-400 group-hover:text-stone-600 transition-colors">
            {sheetState === 'expanded' ? (
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-600" />
            ) : sheetState === 'collapsed' ? (
              <ChevronUp className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-600" />
            ) : null}
            <div className="w-12 h-1.5 bg-stone-300 group-hover:bg-stone-400 rounded-full transition-colors" />
            {sheetState === 'default' && (
              <ChevronUp className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-600" />
            )}
          </div>
          <span className="text-[10px] font-bold text-stone-400 mt-0.5 group-hover:text-stone-600 transition-colors">
            {sheetState === 'collapsed'
              ? 'Tap to expand'
              : sheetState === 'expanded'
              ? 'Tap to collapse'
              : 'Tap to see more'}
          </span>
        </button>

        {/* 1. COLLAPSED VIEW */}
        {sheetState === 'collapsed' ? (
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-2xl bg-orange-50 text-[#FF5A36] flex items-center justify-center">
                <Car className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-stone-900">
                  {savedSpot ? 'Active Spot Saved' : 'Ready to Park'}
                </p>
                <p className="text-[11px] text-stone-500 font-medium">
                  {distanceMeters !== null
                    ? `${distanceMeters}m away`
                    : 'Tap Park Here to save GPS'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                triggerHapticFeedback('success');
                onParkHereClick();
              }}
              className="py-2 px-5 rounded-2xl bg-[#FF5A36] hover:bg-[#e84e2c] text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-[#FF5A36]/30 active:scale-95 transition-transform"
            >
              <Car className="w-3.5 h-3.5" />
              <span>Park Here</span>
            </button>
          </div>
        ) : sheetState === 'default' ? (
          /* 2. DEFAULT STANDARD VIEW */
          <div className="space-y-3">
            {/* Distance / Status Header */}
            <div className="flex items-center justify-center space-x-2 text-stone-500 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5 text-stone-400" />
              <span>
                {distanceMeters !== null
                  ? `${distanceMeters}m from your saved car`
                  : '1-Tap GPS Auto-Save Ready'}
              </span>
            </div>

            {/* Primary Action Button */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  triggerHapticFeedback('success');
                  onParkHereClick();
                }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF5A36] via-[#FF6D4A] to-[#FF8F6B] text-white text-base font-extrabold flex items-center justify-center space-x-2 shadow-lg shadow-[#FF5A36]/35 transition-transform active:scale-[0.98]"
              >
                <Car className="w-5 h-5" />
                <span>Park Here</span>
              </button>

              {/* Quick Action Buttons if Active Spot Exists */}
              {savedSpot && !savedSpot.isFound && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      triggerHapticFeedback('medium');
                      onFindMyCar(savedSpot);
                    }}
                    className="flex-1 py-3 px-3 rounded-2xl border border-stone-300 hover:border-stone-400 bg-stone-50 hover:bg-stone-100 text-stone-900 text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors active:scale-95"
                  >
                    <Navigation className="w-3.5 h-3.5 text-[#FF5A36]" />
                    <span>Navigate to Car</span>
                  </button>

                  <button
                    onClick={(e) => handleShare(savedSpot, e)}
                    className="py-3 px-4 rounded-2xl border border-stone-300 hover:border-stone-400 bg-stone-50 hover:bg-stone-100 text-stone-900 text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors active:scale-95"
                    title="Share spot with friends"
                  >
                    <Share2 className="w-3.5 h-3.5 text-stone-700" />
                    <span>Share</span>
                  </button>

                  <button
                    onClick={() => {
                      triggerHapticFeedback('light');
                      onViewSpotDetails(savedSpot);
                    }}
                    className="py-3 px-3.5 rounded-2xl border border-stone-300 hover:border-stone-400 bg-stone-50 hover:bg-stone-100 text-stone-900 text-xs font-bold flex items-center justify-center transition-colors active:scale-95"
                    title="Spot Details"
                  >
                    <Eye className="w-4 h-4 text-stone-700" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* 3. EXPANDED FULL VIEW: Rich Spot Dashboard */
          <div className="space-y-3.5 pt-1">
            {savedSpot && !savedSpot.isFound ? (
              <>
                {/* Active Spot Card Preview */}
                <div className="bg-stone-50 rounded-2xl p-3.5 border border-stone-200/90 flex items-start space-x-3">
                  <div className="w-14 h-14 rounded-xl bg-white border border-stone-200 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                    {savedSpot.photoUri ? (
                      <img
                        src={savedSpot.photoUri}
                        alt="Spot"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Car className="w-6 h-6 text-[#FF5A36]" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#0F766E] bg-emerald-100/70 px-2 py-0.5 rounded-full">
                        Active Spot
                      </span>
                      <span className="text-[11px] text-stone-400 font-medium">
                        {formatRelativeSavedTime(savedSpot.savedAt)}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-stone-900 truncate mt-1">
                      {savedSpot.address || 'Saved GPS Location'}
                    </h4>

                    {savedSpot.levelOrSection && (
                      <p className="text-[11px] text-stone-600 truncate mt-0.5 font-semibold">
                        📍 Floor/Section: {savedSpot.levelOrSection}
                      </p>
                    )}
                  </div>
                </div>

                {/* Quick Action Matrix */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      triggerHapticFeedback('medium');
                      onFindMyCar(savedSpot);
                    }}
                    className="py-3 px-3 rounded-2xl bg-[#FF5A36] text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-xs hover:bg-[#e84e2c] active:scale-95 transition-transform"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>Navigate ({distanceMeters !== null ? `${distanceMeters}m` : 'Live'})</span>
                  </button>

                  <button
                    onClick={(e) => handleShare(savedSpot, e)}
                    className="py-3 px-3 rounded-2xl bg-white border border-stone-200 text-stone-800 text-xs font-bold flex items-center justify-center space-x-2 hover:bg-stone-50 active:scale-95 transition-colors"
                  >
                    <Share2 className="w-4 h-4 text-[#FF5A36]" />
                    <span>Share Location</span>
                  </button>
                </div>

                {/* Meter Timer Shortcut */}
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-900">
                        {meterTimer?.isActive ? `Meter: ${timerRemaining}` : 'Parking Meter Timer'}
                      </p>
                      <p className="text-[11px] text-stone-500 font-medium">
                        {meterTimer?.isActive ? 'Alerts before expiration' : 'Set a reminder for meters'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      triggerHapticFeedback('light');
                      onOpenTimerModal();
                    }}
                    className="text-xs font-bold text-amber-800 bg-white border border-amber-300 px-3 py-1.5 rounded-xl hover:bg-amber-50"
                  >
                    {meterTimer?.isActive ? 'Adjust' : 'Set Timer'}
                  </button>
                </div>

                {/* Secondary Save New Spot */}
                <button
                  onClick={() => {
                    triggerHapticFeedback('medium');
                    onParkHereClick();
                  }}
                  className="w-full py-2.5 rounded-xl text-stone-500 hover:text-stone-900 text-xs font-bold hover:bg-stone-100 transition-colors"
                >
                  Parked in a new spot? Overwrite & Save
                </button>
              </>
            ) : (
              /* No Active Spot Expanded State */
              <>
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-center space-y-2">
                  <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#FF5A36] flex items-center justify-center mx-auto">
                    <Compass className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-stone-800">
                    Auto-Save GPS & Smart Detection Ready
                  </p>
                  <p className="text-[11px] text-stone-500 font-medium">
                    SpotSaver captures your exact coordinates, accuracy range, and garage details in one tap.
                  </p>
                </div>

                <button
                  onClick={() => {
                    triggerHapticFeedback('success');
                    onParkHereClick();
                  }}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF5A36] to-[#FF7A59] text-white text-base font-extrabold flex items-center justify-center space-x-2 shadow-lg shadow-[#FF5A36]/35 transition-transform active:scale-[0.98]"
                >
                  <Car className="w-5 h-5" />
                  <span>Park Here Now</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
