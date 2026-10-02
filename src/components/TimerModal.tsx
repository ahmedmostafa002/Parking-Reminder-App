import React, { useState } from 'react';
import { Clock, Bell, X, Plus, AlertCircle, Play, StopCircle, RefreshCw } from 'lucide-react';
import { MeterTimer } from '../types';

interface TimerModalProps {
  activeTimer: MeterTimer | null;
  spotId: string;
  onSetTimer: (durationMinutes: number, notifyBeforeMinutes: number) => void;
  onExtendTimer: (additionalMinutes: number) => void;
  onCancelTimer: () => void;
  onClose: () => void;
}

export const TimerModal: React.FC<TimerModalProps> = ({
  activeTimer,
  spotId,
  onSetTimer,
  onExtendTimer,
  onCancelTimer,
  onClose,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(60);
  const [notifyBefore, setNotifyBefore] = useState<number>(10);

  const presets = [
    { label: '15 min', value: 15 },
    { label: '30 min', value: 30 },
    { label: '45 min', value: 45 },
    { label: '1 hour', value: 60 },
    { label: '2 hours', value: 120 },
    { label: '3 hours', value: 180 },
  ];

  const handleStart = () => {
    onSetTimer(selectedDuration, notifyBefore);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-sm bg-[#FCF9F6] rounded-3xl p-6 shadow-2xl border border-stone-200/90 flex flex-col items-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="w-14 h-14 rounded-full bg-orange-100 text-[#FF5A36] flex items-center justify-center mb-3 mt-1">
          <Clock className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-bold text-stone-900 font-display mb-1">
          {activeTimer && activeTimer.isActive ? 'Active Parking Meter' : 'Set Parking Timer'}
        </h3>
        <p className="text-stone-500 text-xs mb-5 text-center">
          Get notified before your meter expires to avoid parking tickets.
        </p>

        {activeTimer && activeTimer.isActive ? (
          /* Active Timer Management View */
          <div className="w-full space-y-4">
            <div className="p-4 bg-white rounded-2xl border border-stone-200 text-center shadow-xs">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-1">
                Expires At
              </span>
              <span className="text-2xl font-black text-stone-900">
                {new Date(activeTimer.expiresAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <p className="text-xs text-stone-500 mt-1">
                Alert set for {activeTimer.notifyBeforeMinutes} min before expiry
              </p>
            </div>

            {/* Quick Extension Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => onExtendTimer(15)}
                className="py-2.5 px-3 bg-white border border-[#FF5A36] text-[#FF5A36] rounded-xl text-xs font-bold hover:bg-orange-50 transition-colors flex items-center justify-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add 15 min</span>
              </button>
              <button
                onClick={() => onExtendTimer(30)}
                className="py-2.5 px-3 bg-white border border-[#FF5A36] text-[#FF5A36] rounded-xl text-xs font-bold hover:bg-orange-50 transition-colors flex items-center justify-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add 30 min</span>
              </button>
            </div>

            {/* Cancel Meter Timer */}
            <button
              onClick={() => {
                onCancelTimer();
                onClose();
              }}
              className="w-full py-3 text-red-600 hover:bg-red-50 rounded-full text-xs font-bold transition-colors flex items-center justify-center space-x-1.5"
            >
              <StopCircle className="w-4 h-4" />
              <span>Cancel / Stop Timer</span>
            </button>
          </div>
        ) : (
          /* New Timer Duration Picker */
          <div className="w-full space-y-4">
            {/* Quick Presets Grid */}
            <div className="grid grid-cols-3 gap-2">
              {presets.map((p) => {
                const isSelected = selectedDuration === p.value;
                return (
                  <button
                    key={p.value}
                    onClick={() => setSelectedDuration(p.value)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-[#FF5A36] text-white border-[#FF5A36] shadow-sm'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>

            {/* Custom Minutes Stepper */}
            <div className="bg-white p-3.5 rounded-2xl border border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-stone-700 block">
                  Duration
                </span>
                <span className="text-xs text-stone-400">Total meter time</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedDuration(Math.max(5, selectedDuration - 15))}
                  className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold flex items-center justify-center"
                >
                  -
                </button>
                <span className="text-sm font-bold text-stone-900 w-12 text-center">
                  {selectedDuration}m
                </span>
                <button
                  onClick={() => setSelectedDuration(selectedDuration + 15)}
                  className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Alert Before Expiry */}
            <div className="bg-white p-3.5 rounded-2xl border border-stone-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold text-stone-700">
                  Notify Me Before
                </span>
              </div>
              <select
                value={notifyBefore}
                onChange={(e) => setNotifyBefore(Number(e.target.value))}
                className="text-xs font-bold text-stone-800 bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                <option value={5}>5 min prior</option>
                <option value={10}>10 min prior</option>
                <option value={15}>15 min prior</option>
                <option value={20}>20 min prior</option>
              </select>
            </div>

            {/* Start Timer Button */}
            <button
              onClick={handleStart}
              className="w-full py-4 rounded-full bg-[#FF5A36] hover:bg-[#e84e2c] text-white text-base font-bold flex items-center justify-center space-x-2 shadow-md shadow-[#FF5A36]/25 transition-transform active:scale-[0.98]"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Meter Timer</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
