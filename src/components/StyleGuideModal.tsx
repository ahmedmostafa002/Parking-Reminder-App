import React from 'react';
import {
  MapPin,
  User,
  Info,
  CheckCircle2,
  AlertTriangle,
  X,
  Navigation,
  SlidersHorizontal,
  ChevronLeft,
} from 'lucide-react';

interface StyleGuideModalProps {
  onClose: () => void;
}

export const StyleGuideModal: React.FC<StyleGuideModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#FAF7F2] overflow-y-auto pb-20 animate-fade-in">
      {/* Top Header matching Image 13 */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-5 py-3.5 bg-white/95 backdrop-blur-md border-b border-stone-200/60 shadow-xs">
        <button
          onClick={onClose}
          className="p-2 -ml-1 text-stone-700 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-[#FF5A36]" />
        </button>
        <h1 className="text-xl font-bold tracking-tight text-[#B83E26] font-display">
          SpotSaver
        </h1>
        <button
          onClick={onClose}
          className="p-2 text-stone-500 hover:text-stone-900 rounded-full hover:bg-stone-100"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Main Container */}
      <div className="max-w-md mx-auto px-5 py-6 space-y-8">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-stone-900 font-display">
            Style Guide
          </h2>
          <p className="text-stone-500 text-sm mt-0.5">
            SpotSaver Component Preview
          </p>
        </div>

        {/* SECTION 1: Buttons (Matches Image 13) */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-stone-900 border-b border-stone-200 pb-1.5">
            Buttons
          </h3>

          <div className="space-y-3 pt-1">
            {/* Primary Filled Button: Save Location */}
            <button className="w-full py-4 rounded-full bg-[#FF5A36] hover:bg-[#e84e2c] text-white text-sm font-bold flex items-center justify-center space-x-2 shadow-md shadow-[#FF5A36]/25 transition-transform active:scale-[0.98]">
              <MapPin className="w-4 h-4" />
              <span>Save Location</span>
            </button>

            {/* Secondary Outline Button: Find Vehicle */}
            <button className="w-full py-3.5 rounded-full border-2 border-[#FF5A36] text-[#FF5A36] bg-white hover:bg-orange-50/50 text-sm font-bold flex items-center justify-center space-x-2 shadow-xs transition-transform active:scale-[0.98]">
              <User className="w-4 h-4" />
              <span>Find Vehicle</span>
            </button>

            {/* Tertiary Link: Cancel Action */}
            <div className="text-center pt-1">
              <button className="text-stone-600 hover:text-stone-900 text-xs font-semibold">
                Cancel Action
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 2: Status Pills (Matches Image 13) */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-stone-900 border-b border-stone-200 pb-1.5">
            Status Pills
          </h3>

          <div className="flex flex-wrap gap-2.5 pt-1">
            {/* Neutral Status */}
            <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[#E5E7EB] text-[#4B5563] text-xs font-medium">
              <Info className="w-3.5 h-3.5" />
              <span>Neutral Status</span>
            </span>

            {/* Location Saved */}
            <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[#D4F6ED] text-[#0D9488] text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Location Saved</span>
            </span>

            {/* Meter Expiring */}
            <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-[#FFE4E1] text-[#E11D48] text-xs font-semibold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Meter Expiring</span>
            </span>
          </div>
        </div>

        {/* SECTION 3: Card Component (Matches Image 13) */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-stone-900 border-b border-stone-200 pb-1.5">
            Card Component
          </h3>

          {/* Current Parking Card */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs flex items-center justify-between">
            <div className="flex items-center space-x-3.5">
              {/* Parking 'P' circle badge */}
              <div className="w-11 h-11 rounded-full bg-orange-100/90 text-[#FF5A36] flex items-center justify-center font-bold text-lg">
                P
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">
                  Current Parking
                </h4>
                <p className="text-xs text-stone-600 font-medium">
                  123 Market Street, Level 4
                </p>
                <span className="text-[11px] text-stone-400">
                  Saved 2h ago
                </span>
              </div>
            </div>

            <button className="text-xs font-bold text-[#FF5A36] hover:underline">
              View Map
            </button>
          </div>

          {/* Dotted Grid Route Component (Matches Image 13) */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs relative overflow-hidden h-36 flex items-center justify-center">
            {/* Dotted background matrix */}
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  'radial-gradient(#a8a29e 1.5px, transparent 1.5px)',
                backgroundSize: '16px 16px',
              }}
            />

            {/* Diagonal dashed trajectory line with target puck */}
            <div className="relative w-full flex items-center justify-center">
              <div className="w-full h-0.5 border-t-2 border-dashed border-[#FF5A36] rotate-[-12deg] relative flex items-center justify-center">
                {/* Center pulsing target */}
                <div className="w-6 h-6 rounded-full bg-white border-4 border-[#FF5A36] shadow-md flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#FF5A36]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dismiss button */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-full bg-stone-900 text-white text-xs font-bold shadow-md hover:bg-stone-800 transition-colors"
        >
          Close Style Guide
        </button>
      </div>
    </div>
  );
};
