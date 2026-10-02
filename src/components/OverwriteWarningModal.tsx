import React from 'react';
import { AlertTriangle, Car, Navigation, CheckCircle2, X } from 'lucide-react';
import { ParkingSpot } from '../types';
import { formatRelativeSavedTime } from '../utils/geo';

interface OverwriteWarningModalProps {
  existingSpot: ParkingSpot;
  onFoundAndSaveNew: () => void;
  onNavigateToExisting: () => void;
  onForceOverwrite: () => void;
  onCancel: () => void;
}

export const OverwriteWarningModal: React.FC<OverwriteWarningModalProps> = ({
  existingSpot,
  onFoundAndSaveNew,
  onNavigateToExisting,
  onForceOverwrite,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-sm bg-[#FCF9F6] rounded-3xl p-6 shadow-2xl border border-stone-200/90 flex flex-col items-center text-center">
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon Circle */}
        <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4 mt-2 shadow-inner">
          <AlertTriangle className="w-9 h-9 stroke-[2.2]" />
        </div>

        {/* Header Title */}
        <h3 className="text-xl font-bold text-stone-900 tracking-tight mb-2 font-display">
          Active Spot Already Saved!
        </h3>

        {/* Description */}
        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-4">
          You have an active spot saved at{' '}
          <strong className="text-stone-900 font-bold">
            {existingSpot.address || 'your last location'}
          </strong>{' '}
          ({formatRelativeSavedTime(existingSpot.savedAt)}).
        </p>

        {/* Active Spot Preview Box */}
        <div className="w-full bg-white rounded-2xl p-3.5 border border-stone-200 text-left mb-5 space-y-1 shadow-xs">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-stone-700">
            <Car className="w-4 h-4 text-[#FF5A36]" />
            <span className="truncate">{existingSpot.address}</span>
          </div>
          {existingSpot.levelOrSection && (
            <p className="text-[11px] text-stone-500 pl-5">
              {existingSpot.levelOrSection} {existingSpot.pillarNumber ? `· Pillar ${existingSpot.pillarNumber}` : ''}
            </p>
          )}
        </div>

        {/* Action 1: "I Found My Car First" (Best Practice UX) */}
        <button
          onClick={onFoundAndSaveNew}
          className="w-full py-3.5 px-4 rounded-full bg-[#FF5A36] hover:bg-[#e84e2c] text-white text-sm font-bold flex items-center justify-center space-x-2 shadow-md shadow-[#FF5A36]/20 transition-all mb-2.5 active:scale-[0.98]"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>I Found It — Save New Spot</span>
        </button>

        {/* Action 2: "Find Current Car" */}
        <button
          onClick={onNavigateToExisting}
          className="w-full py-3 px-4 rounded-full border-2 border-stone-300 hover:border-stone-400 bg-white text-stone-800 text-sm font-semibold flex items-center justify-center space-x-2 transition-all mb-2.5"
        >
          <Navigation className="w-4 h-4 text-[#FF5A36]" />
          <span>Show Route to Current Car</span>
        </button>

        {/* Action 3: Overwrite Anyway (With safety text) */}
        <button
          onClick={onForceOverwrite}
          className="text-xs text-red-600 hover:text-red-700 font-semibold py-1 hover:underline"
        >
          Discard Old Spot & Overwrite
        </button>
      </div>
    </div>
  );
};
