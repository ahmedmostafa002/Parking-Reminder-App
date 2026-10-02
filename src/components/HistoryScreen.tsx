import React, { useState } from 'react';
import { Trash2, MapPin } from 'lucide-react';
import { ParkingSpot } from '../types';
import { formatHistoryDate } from '../utils/geo';

interface HistoryScreenProps {
  history: ParkingSpot[];
  onSelectSpot: (spot: ParkingSpot) => void;
  onDeleteSpot: (spotId: string) => void;
  onClearAll: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  history,
  onSelectSpot,
  onDeleteSpot,
  onClearAll,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  return (
    <div className="flex-1 w-full h-full bg-[#FAF7F2] overflow-y-auto pt-16 pb-36 px-4 sm:px-6 select-none font-['Outfit']">
      <div className="max-w-md mx-auto">
        {/* Top Section Header with Clear All */}
        <div className="flex items-center justify-between pt-1 pb-3">
          <div>
            <h2 className="text-xl font-black text-stone-900 tracking-tight font-display">
              Parking History
            </h2>
            <p className="text-xs text-stone-400 font-semibold">
              {history.length} {history.length === 1 ? 'saved spot' : 'saved spots'}
            </p>
          </div>
          {history.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="text-xs font-bold text-[#FF5A36] hover:text-[#e84e2c] transition-colors px-3 py-1.5 rounded-full hover:bg-orange-50"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Clear All Confirmation Box */}
        {showClearConfirm && (
          <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center space-y-2 animate-fade-in shadow-xs">
            <p className="text-xs text-amber-900 font-bold">
              Are you sure you want to clear all {history.length} saved parking logs?
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2 text-xs font-semibold bg-white border border-stone-200 rounded-xl text-stone-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearAll();
                  setShowClearConfirm(false);
                }}
                className="flex-1 py-2 text-xs font-bold bg-[#FF5A36] text-white rounded-xl shadow-xs"
              >
                Clear History
              </button>
            </div>
          </div>
        )}

        {/* List of History Items or Empty State */}
        {history.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            {/* Coral Car Outline Vector Graphic */}
            <div className="w-28 h-28 mb-4 flex items-center justify-center text-[#FF5A36]">
              <svg
                viewBox="0 0 100 80"
                className="w-24 h-20 fill-none stroke-current stroke-[3] stroke-linecap-round stroke-linejoin-round"
              >
                <path d="M25 35 L35 15 L65 15 L75 35 Z" />
                <path d="M15 35 Q10 35 10 45 L10 55 Q10 60 18 60 L22 60 Q26 60 28 66 L30 72 Q31 75 35 75 L40 75 Q44 75 44 70 L44 60 L56 60 L56 70 Q56 75 60 75 L65 75 Q69 75 70 72 L72 66 Q74 60 78 60 L82 60 Q90 60 90 55 L90 45 Q90 35 85 35 Z" />
                <circle cx="28" cy="48" r="4" className="fill-current" />
                <circle cx="72" cy="48" r="4" className="fill-current" />
                <line x1="20" y1="52" x2="80" y2="52" strokeWidth="2" />
              </svg>
            </div>

            <p className="text-stone-800 text-sm font-bold">
              No parking history yet
            </p>
            <p className="text-stone-400 text-xs mt-1 max-w-xs leading-relaxed font-medium">
              When you save parking locations with 1-Tap Park Here, your past spots will appear here.
            </p>
          </div>
        ) : (
          /* Cards List */
          <div className="space-y-3">
            {history.map((spot) => (
              <div
                key={spot.id}
                onClick={() => onSelectSpot(spot)}
                className="group relative flex items-center p-3.5 bg-white hover:bg-stone-50/90 rounded-2xl border border-stone-200/80 shadow-xs transition-all cursor-pointer active:scale-[0.99]"
              >
                {/* Mini Map/Pin Thumbnail */}
                <div className="w-14 h-14 rounded-xl bg-stone-100 border border-stone-200/70 relative flex items-center justify-center shrink-0 overflow-hidden mr-3.5 shadow-2xs">
                  {spot.photoUri ? (
                    <img
                      src={spot.photoUri}
                      alt="Spot"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#FF5A36]/10 text-[#FF5A36]">
                      <MapPin className="w-4 h-4 text-[#FF5A36]" />
                    </div>
                  )}
                </div>

                {/* Spot Details Text */}
                <div className="flex-1 min-w-0 pr-2">
                  <h3 className="text-sm font-bold text-stone-900 truncate">
                    {formatHistoryDate(spot.savedAt)}
                  </h3>
                  <p className="text-xs text-stone-500 truncate mt-0.5 font-medium">
                    {spot.address || 'Saved Location'}
                  </p>
                  {spot.levelOrSection && (
                    <span className="inline-block text-[10px] font-bold text-[#0F766E] bg-emerald-50 px-2 py-0.5 rounded-md mt-1 truncate">
                      {spot.levelOrSection} {spot.pillarNumber ? `· Pillar ${spot.pillarNumber}` : ''}
                    </span>
                  )}
                </div>

                {/* Delete Icon Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSpot(spot.id);
                  }}
                  className="p-2 text-stone-400 hover:text-red-600 rounded-full hover:bg-stone-100 transition-colors"
                  title="Delete log"
                  aria-label="Delete saved spot"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
