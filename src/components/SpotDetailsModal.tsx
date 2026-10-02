import React, { useState } from 'react';
import { ArrowLeft, Clock, CheckCircle2, Map, Car, Trash2, ZoomIn, X, Camera, Edit3 } from 'lucide-react';
import { ParkingSpot } from '../types';
import { formatHistoryDate, compressImageFile } from '../utils/geo';
import { MapView } from './MapView';

interface SpotDetailsModalProps {
  spot: ParkingSpot;
  onBack: () => void;
  onFindMyCar: (spot: ParkingSpot) => void;
  onDeleteSpot: (spotId: string) => void;
  onViewOnMap: (spot: ParkingSpot) => void;
  onUpdatePhoto: (spotId: string, newPhotoUri: string) => void;
}

export const SpotDetailsModal: React.FC<SpotDetailsModalProps> = ({
  spot,
  onBack,
  onFindMyCar,
  onDeleteSpot,
  onViewOnMap,
  onUpdatePhoto,
}) => {
  const [isPhotoZoomed, setIsPhotoZoomed] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImageFile(file, 960, 0.75);
        onUpdatePhoto(spot.id, compressed);
      } catch (err) {
        console.error('Failed to compress photo:', err);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-[#FAF7F2] overflow-y-auto flex flex-col animate-fade-in pb-10 select-none">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3.5 bg-white/95 backdrop-blur-md border-b border-stone-200/60">
        <button
          onClick={onBack}
          className="p-2 -ml-1 text-stone-700 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-[#FF5A36]" />
        </button>
        <h1 className="text-lg font-bold text-stone-900 font-display">
          Spot Details
        </h1>
        <div className="w-10" />
      </header>

      {/* Main Content */}
      <div className="max-w-md w-full mx-auto flex-1 flex flex-col">
        {/* Photo Section with Zoom Button */}
        <div className="relative w-full h-64 sm:h-72 bg-stone-200 overflow-hidden">
          {spot.photoUri ? (
            <img
              src={spot.photoUri}
              alt="Parking spot location"
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setIsPhotoZoomed(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-400 p-6 text-center">
              <Camera className="w-12 h-12 mb-2 text-stone-300" />
              <p className="text-sm font-medium">No spot photo attached</p>
              <label className="mt-3 px-4 py-2 bg-white border border-stone-300 rounded-full text-xs font-semibold text-stone-700 cursor-pointer shadow-xs hover:bg-stone-50">
                <span>Take or Upload Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {spot.photoUri && (
            <div className="absolute bottom-4 right-4 flex space-x-2">
              <label className="w-11 h-11 rounded-full bg-white/95 text-stone-700 flex items-center justify-center shadow-lg hover:scale-105 transition-transform cursor-pointer">
                <Camera className="w-5 h-5 text-stone-600" />
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
              <button
                onClick={() => setIsPhotoZoomed(true)}
                className="w-11 h-11 rounded-full bg-white/95 text-stone-700 flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                title="Zoom Photo"
              >
                <ZoomIn className="w-5 h-5 text-[#FF5A36]" />
              </button>
            </div>
          )}
        </div>

        {/* Details Body */}
        <div className="px-5 pt-6 pb-8 space-y-5">
          {/* Street Address & Saved Time */}
          <div>
            <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
              {spot.address || 'Parked Location'}
            </h2>
            <div className="flex items-center space-x-1.5 text-stone-500 text-sm mt-1">
              <Clock className="w-4 h-4 text-stone-400" />
              <span>Saved {formatHistoryDate(spot.savedAt)}</span>
            </div>
          </div>

          {/* SPOT NOTES Card */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-3">
            <h3 className="text-xs font-bold tracking-wider text-stone-400 uppercase">
              Spot Notes & Garage Location
            </h3>
            <p className="text-stone-800 text-base font-medium">
              {spot.note || `${spot.levelOrSection || 'Ground Lot'}${spot.pillarNumber ? `, near pillar ${spot.pillarNumber}` : ''}`}
            </p>

            <div className="pt-1 flex items-center">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#FDF2F0] border border-[#FDE2DE] rounded-full text-xs font-medium text-stone-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FF5A36]" />
                <span>Confirmed Location</span>
              </span>
            </div>
          </div>

          {/* Mini Map View Preview Card */}
          <div className="relative rounded-2xl overflow-hidden border border-stone-200/80 shadow-xs h-36 bg-stone-100">
            <MapView
              userLocation={null}
              savedSpot={spot}
              interactive={false}
              className="h-full w-full pointer-events-none opacity-90"
            />
            <div className="absolute inset-0 bg-stone-900/10 backdrop-blur-[0.5px] flex items-center justify-center">
              <button
                onClick={() => onViewOnMap(spot)}
                className="flex items-center space-x-2 px-4 py-2 bg-white/95 hover:bg-white text-stone-900 text-xs font-bold rounded-full shadow-md transition-all hover:scale-105"
              >
                <Map className="w-4 h-4 text-[#FF5A36]" />
                <span>View on Map</span>
              </button>
            </div>
          </div>

          {/* Primary Action Button: Find My Car */}
          <button
            onClick={() => onFindMyCar(spot)}
            className="w-full py-4 rounded-full bg-[#FF5A36] hover:bg-[#e84e2c] text-white text-base font-bold flex items-center justify-center space-x-2 shadow-md shadow-[#FF5A36]/25 transition-transform active:scale-[0.98]"
          >
            <Car className="w-5 h-5" />
            <span>Find My Car</span>
          </button>

          {/* Delete Save Button */}
          {!showConfirmDelete ? (
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="w-full py-2.5 text-stone-500 hover:text-red-600 text-sm font-semibold flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Save</span>
            </button>
          ) : (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-center space-y-3">
              <p className="text-xs text-red-700 font-medium">
                Are you sure you want to remove this saved spot?
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowConfirmDelete(false)}
                  className="flex-1 py-2 text-xs font-semibold bg-white border border-stone-200 rounded-xl text-stone-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onDeleteSpot(spot.id)}
                  className="flex-1 py-2 text-xs font-bold bg-red-600 text-white rounded-xl shadow-xs"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Photo Lightbox Modal */}
      {isPhotoZoomed && spot.photoUri && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setIsPhotoZoomed(false)}
            className="absolute top-6 right-6 p-3 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={spot.photoUri}
            alt="Zoomed parking spot"
            className="max-h-[85vh] max-w-full rounded-xl object-contain shadow-2xl"
          />
          <div className="mt-4 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
            {spot.note || spot.address}
          </div>
        </div>
      )}
    </div>
  );
};
