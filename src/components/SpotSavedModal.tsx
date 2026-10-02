import React, { useState, useRef } from 'react';
import { Check, Camera, Clock, X, MapPin, Layers, Hash, Image as ImageIcon } from 'lucide-react';
import { ParkingSpot } from '../types';
import { compressImageFile } from '../utils/geo';

interface SpotSavedModalProps {
  spot: ParkingSpot;
  onClose: () => void;
  onAddPhoto: () => void;
  onSetTimer: () => void;
  onUpdateSpotNotes: (notes: {
    note?: string;
    levelOrSection?: string;
    floorNumber?: string;
    colorTag?: ParkingSpot['colorTag'];
    pillarNumber?: string;
    photoUri?: string;
  }) => void;
}

export const SpotSavedModal: React.FC<SpotSavedModalProps> = ({
  spot,
  onClose,
  onAddPhoto,
  onSetTimer,
  onUpdateSpotNotes,
}) => {
  const [isAddingDetails, setIsAddingDetails] = useState(false);
  const [level, setLevel] = useState(spot.levelOrSection || '');
  const [pillar, setPillar] = useState(spot.pillarNumber || '');
  const [note, setNote] = useState(spot.note || '');
  const [colorTag, setColorTag] = useState<ParkingSpot['colorTag']>(spot.colorTag || 'blue');
  const [localPhoto, setLocalPhoto] = useState<string | undefined>(spot.photoUri);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImageFile(file, 960, 0.75);
        setLocalPhoto(compressed);
        onUpdateSpotNotes({ photoUri: compressed });
      } catch (err) {
        console.error('Photo capture error:', err);
      }
    }
  };

  const handleSaveDetails = () => {
    const combinedNote = note || (level ? `${level}${pillar ? `, Pillar ${pillar}` : ''}` : 'Parked spot');
    onUpdateSpotNotes({
      levelOrSection: level || undefined,
      pillarNumber: pillar || undefined,
      note: combinedNote,
      colorTag,
      photoUri: localPhoto,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 animate-fade-in select-none">
      <div className="relative w-full max-w-sm bg-[#FCF9F6] rounded-3xl p-6 shadow-2xl border border-stone-200 flex flex-col items-center text-center">
        {/* Hidden Camera File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhotoCapture}
          className="hidden"
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Big Coral Success Checkmark Circle or Photo Thumbnail */}
        {localPhoto ? (
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#FF5A36] shadow-lg mt-4 mb-4">
            <img src={localPhoto} alt="Captured Parking Spot" className="w-full h-full object-cover" />
            <div className="absolute top-1 right-1 bg-emerald-500 text-white rounded-full p-1 shadow-xs">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>
        ) : (
          <div className="w-20 h-20 rounded-full bg-[#FF5A36] text-white flex items-center justify-center shadow-lg shadow-[#FF5A36]/30 mt-4 mb-4">
            <Check className="w-10 h-10 stroke-[3]" />
          </div>
        )}

        {/* Title & Subtitle */}
        <h2 className="text-2xl font-bold tracking-tight text-stone-900 mb-1 font-display">
          Spot Saved!
        </h2>
        <p className="text-stone-500 text-xs mb-4">
          Location locked & stored safely on your device
        </p>

        {/* Address Badge */}
        <div className="w-full flex items-center justify-center space-x-1.5 px-3 py-2 bg-stone-100/90 rounded-xl text-xs text-stone-700 font-medium mb-4">
          <MapPin className="w-3.5 h-3.5 text-[#FF5A36] shrink-0" />
          <span className="truncate">{spot.address || 'GPS Coordinates Captured'}</span>
        </div>

        {/* Secondary Action Buttons (Add Photo / Set Timer) */}
        <div className="grid grid-cols-2 gap-2.5 w-full mb-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center space-x-1.5 py-3 px-3 rounded-full border-2 border-[#FF5A36] text-[#FF5A36] bg-white hover:bg-orange-50/50 text-xs font-bold transition-all shadow-2xs"
          >
            <Camera className="w-4 h-4" />
            <span>{localPhoto ? 'Retake Photo' : 'Snap Photo'}</span>
          </button>

          <button
            onClick={onSetTimer}
            className="flex items-center justify-center space-x-1.5 py-3 px-3 rounded-full border-2 border-[#FF5A36] text-[#FF5A36] bg-white hover:bg-orange-50/50 text-xs font-bold transition-all shadow-2xs"
          >
            <Clock className="w-4 h-4" />
            <span>Meter Timer</span>
          </button>
        </div>

        {/* Optional Garage Detail Drawer */}
        {!isAddingDetails ? (
          <button
            onClick={() => setIsAddingDetails(true)}
            className="text-xs font-bold text-[#FF5A36] hover:underline mb-4"
          >
            + Add garage floor, pillar or stall notes
          </button>
        ) : (
          <div className="w-full bg-white p-3.5 rounded-2xl border border-stone-200 text-left mb-4 space-y-2.5 animate-fade-in">
            <div>
              <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                Floor / Section (e.g. Level 3, Blue Zone)
              </label>
              <input
                type="text"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                placeholder="e.g. Level 3, North Deck"
                className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5A36]"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                  Pillar / Stall #
                </label>
                <input
                  type="text"
                  value={pillar}
                  onChange={(e) => setPillar(e.target.value)}
                  placeholder="e.g. B-12"
                  className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5A36]"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                  Color Tag
                </label>
                <select
                  value={colorTag}
                  onChange={(e) => setColorTag(e.target.value as any)}
                  className="w-full text-xs px-2.5 py-2 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5A36]"
                >
                  <option value="blue">Blue</option>
                  <option value="red">Red</option>
                  <option value="green">Green</option>
                  <option value="yellow">Yellow</option>
                  <option value="orange">Orange</option>
                  <option value="purple">Purple</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Primary Done Button */}
        <button
          onClick={isAddingDetails ? handleSaveDetails : onClose}
          className="w-full py-3.5 rounded-full bg-[#FF5A36] hover:bg-[#e84e2c] text-white text-base font-bold shadow-md shadow-[#FF5A36]/25 transition-transform active:scale-[0.98]"
        >
          Done
        </button>
      </div>
    </div>
  );
};
