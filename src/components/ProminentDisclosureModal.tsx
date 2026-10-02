import React from 'react';
import { MapPin, ShieldCheck, Lock, CheckCircle2, X } from 'lucide-react';

interface ProminentDisclosureModalProps {
  onAccept: () => void;
  onDeny: () => void;
}

export const ProminentDisclosureModal: React.FC<ProminentDisclosureModalProps> = ({
  onAccept,
  onDeny,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/70 backdrop-blur-xs p-4 animate-fade-in select-none">
      <div className="relative w-full max-w-sm bg-[#FCF9F6] rounded-3xl p-6 shadow-2xl border border-stone-200 flex flex-col items-center text-center">
        {/* Location Icon Circle */}
        <div className="w-16 h-16 rounded-2xl bg-orange-100 text-[#FF5A36] flex items-center justify-center mb-3 mt-1 shadow-inner">
          <MapPin className="w-9 h-9" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-stone-900 font-display mb-2">
          Location & Privacy Notice
        </h3>

        {/* Prominent Disclosure Body (Google Play Mandate) */}
        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-4">
          SpotSaver requires access to your device's <strong>precise location (GPS)</strong> even while the app is in use to:
        </p>

        {/* Feature Explanations */}
        <div className="w-full bg-white rounded-2xl p-3.5 border border-stone-200 text-left space-y-2.5 mb-4 shadow-xs">
          <div className="flex items-start space-x-2.5 text-xs text-stone-700">
            <CheckCircle2 className="w-4 h-4 text-[#FF5A36] shrink-0 mt-0.5" />
            <span>Pinpoint and auto-save the exact coordinates where your vehicle is parked.</span>
          </div>

          <div className="flex items-start space-x-2.5 text-xs text-stone-700">
            <CheckCircle2 className="w-4 h-4 text-[#FF5A36] shrink-0 mt-0.5" />
            <span>Calculate live walking distance and compass bearing back to your car.</span>
          </div>
        </div>

        {/* Local Storage Pledge */}
        <div className="w-full bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 text-left flex items-start space-x-2 mb-5">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <p className="text-[11px] text-emerald-800 leading-tight">
            <strong>100% On-Device Privacy:</strong> Your location coordinates and garage photos are stored locally on your device only. We never upload, track, or sell your location data.
          </p>
        </div>

        {/* Accept Button */}
        <button
          onClick={onAccept}
          className="w-full py-3.5 rounded-full bg-[#FF5A36] hover:bg-[#e84e2c] text-white text-sm font-bold flex items-center justify-center space-x-2 shadow-md shadow-[#FF5A36]/30 transition-transform active:scale-[0.98] mb-2"
        >
          <span>Enable Location Access</span>
        </button>

        {/* Skip / Continue Without Location Button */}
        <button
          onClick={onDeny}
          className="text-xs text-stone-400 hover:text-stone-700 py-1.5 font-semibold"
        >
          Continue with manual entry only
        </button>
      </div>
    </div>
  );
};
