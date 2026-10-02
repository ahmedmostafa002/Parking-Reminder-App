import React, { useState, useEffect } from 'react';
import { ArrowLeft, Navigation, CheckCircle2, Compass, ExternalLink, RefreshCw, Volume2, Footprints, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ParkingSpot, UserLocation, WalkingDirections } from '../types';
import { getWalkingDirections, playNotificationTone } from '../utils/geo';
import { MapView } from './MapView';

interface FindMyCarScreenProps {
  spot: ParkingSpot;
  userLocation: UserLocation;
  onBack: () => void;
  onFoundCar: (spotId: string) => void;
  soundAlertsEnabled: boolean;
}

export const FindMyCarScreen: React.FC<FindMyCarScreenProps> = ({
  spot,
  userLocation,
  onBack,
  onFoundCar,
  soundAlertsEnabled,
}) => {
  const [directions, setDirections] = useState<WalkingDirections>(() =>
    getWalkingDirections(
      userLocation.latitude,
      userLocation.longitude,
      spot.latitude,
      spot.longitude,
      spot.address ? spot.address.split(',')[0] : 'Main St'
    )
  );

  // Update directions when location changes
  useEffect(() => {
    const updated = getWalkingDirections(
      userLocation.latitude,
      userLocation.longitude,
      spot.latitude,
      spot.longitude,
      spot.address ? spot.address.split(',')[0] : 'Main St'
    );
    setDirections(updated);
  }, [userLocation, spot]);

  const handleFoundCarClick = () => {
    if (soundAlertsEnabled) {
      playNotificationTone('found');
    }
    // Trigger confetti celebration
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FF5A36', '#FF8F6B', '#10B981', '#3B82F6', '#F59E0B'],
      });
    } catch (e) {
      console.debug('Confetti effect:', e);
    }
    setTimeout(() => {
      onFoundCar(spot.id);
    }, 450);
  };

  const handleOpenExternalMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.latitude},${userLocation.longitude}&destination=${spot.latitude},${spot.longitude}&travelmode=walking`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-40 bg-[#FAF7F2] flex flex-col animate-fade-in select-none">
      {/* Top Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
        <button
          onClick={onBack}
          className="p-2 -ml-1 text-stone-700 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-6 h-6 text-stone-800" />
        </button>
        <div className="flex flex-col items-center">
          <h1 className="text-base font-extrabold text-stone-900 font-display">
            Find My Car
          </h1>
          <span className="text-[10px] font-bold text-emerald-600 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Live Pedestrian Guidance</span>
          </span>
        </div>
        <button
          onClick={handleOpenExternalMaps}
          title="Open in Google Maps"
          className="p-2 text-stone-600 hover:text-[#FF5A36] rounded-full hover:bg-stone-100 transition-colors"
        >
          <ExternalLink className="w-5 h-5" />
        </button>
      </header>

      {/* Interactive Map Area */}
      <div className="relative flex-1 w-full bg-[#f4f1ea]">
        <MapView
          userLocation={userLocation}
          savedSpot={spot}
          showRoute={true}
          interactive={true}
          className="w-full h-full"
        />

        {/* Floating Compass / Re-center Puck */}
        <button
          onClick={() => {
            const updated = getWalkingDirections(
              userLocation.latitude,
              userLocation.longitude,
              spot.latitude,
              spot.longitude,
              spot.address ? spot.address.split(',')[0] : 'Main St'
            );
            setDirections(updated);
          }}
          className="absolute bottom-6 right-4 z-20 w-12 h-12 bg-white/95 rounded-full shadow-xl border border-stone-200 flex items-center justify-center text-stone-800 hover:text-[#FF5A36] hover:scale-105 active:scale-95 transition-transform"
          title="Recalculate Route"
        >
          <Compass className="w-6 h-6 text-[#FF5A36]" />
        </button>
      </div>

      {/* Bottom Floating Navigation Sheet */}
      <div className="relative z-30 bg-white/95 backdrop-blur-md rounded-t-3xl border-t border-stone-200 shadow-2xl px-5 pt-3 pb-8 max-w-md w-full mx-auto space-y-4">
        {/* Sheet pill handle */}
        <div className="w-12 h-1.5 bg-stone-300 rounded-full mx-auto" />

        {/* Distance and ETA Banner */}
        <div className="flex items-center justify-between bg-orange-50/70 border border-orange-200/80 p-3.5 rounded-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF5A36] text-white flex items-center justify-center shadow-sm">
              <Footprints className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-black text-stone-900 tracking-tight">
                {directions.distanceMeters}m
              </span>
              <p className="text-stone-500 text-xs font-semibold">
                Approx {directions.walkingMinutes} min walking distance
              </p>
            </div>
          </div>

          <div className="w-10 h-10 rounded-full border-2 border-[#FF5A36] flex items-center justify-center text-[#FF5A36] shrink-0 bg-white shadow-xs">
            <Navigation
              className="w-5 h-5 transition-transform duration-300"
              style={{ transform: `rotate(${directions.bearingDegrees}deg)` }}
            />
          </div>
        </div>

        {/* Street Step & Garage Notes */}
        <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200/80 space-y-1">
          <p className="text-xs font-bold text-stone-900">
            {directions.streetInstruction}
          </p>
          {spot.levelOrSection && (
            <p className="text-xs font-medium text-[#0F766E]">
              📍 Destination: {spot.levelOrSection} {spot.pillarNumber ? `· Pillar ${spot.pillarNumber}` : ''}
            </p>
          )}
          {spot.note && (
            <p className="text-[11px] text-stone-500 italic truncate">
              "{spot.note}"
            </p>
          )}
        </div>

        {/* I Found My Car Button */}
        <button
          onClick={handleFoundCarClick}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF5A36] to-[#E04826] hover:from-[#e84e2c] hover:to-[#c83c1c] text-white text-base font-extrabold flex items-center justify-center space-x-2 shadow-lg shadow-[#FF5A36]/30 transition-transform active:scale-[0.98] cursor-pointer"
        >
          <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
          <span>I Found My Car!</span>
        </button>
      </div>
    </div>
  );
};
