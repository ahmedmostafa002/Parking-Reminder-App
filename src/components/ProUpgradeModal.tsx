import React from 'react';
import { Sparkles, Check, X, Shield, Camera, History, Zap } from 'lucide-react';

interface ProUpgradeModalProps {
  onUpgrade: () => void;
  onClose: () => void;
}

export const ProUpgradeModal: React.FC<ProUpgradeModalProps> = ({
  onUpgrade,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="relative w-full max-w-sm bg-[#FCF9F6] rounded-3xl p-6 shadow-2xl border border-stone-200/90 flex flex-col items-center text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Pro Badge Icon */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center mb-4 mt-2 shadow-lg shadow-orange-500/25">
          <Sparkles className="w-8 h-8 fill-current" />
        </div>

        <h3 className="text-2xl font-black text-stone-900 font-display mb-1">
          SpotSaver Pro
        </h3>
        <p className="text-xs text-stone-500 mb-5">
          One-time purchase · Lifetime access · No subscriptions
        </p>

        {/* Benefits List */}
        <div className="w-full bg-white rounded-2xl p-4 border border-stone-200 text-left space-y-3 mb-6 shadow-xs">
          <div className="flex items-start space-x-3 text-xs text-stone-800">
            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <div>
              <strong className="font-bold block">100% Ad-Free Experience</strong>
              <span className="text-stone-500 text-[11px]">Remove banner ads from parking history permanently.</span>
            </div>
          </div>

          <div className="flex items-start space-x-3 text-xs text-stone-800">
            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <div>
              <strong className="font-bold block">Unlimited History Logs</strong>
              <span className="text-stone-500 text-[11px]">Keep a lifetime archive of all your parking trips.</span>
            </div>
          </div>

          <div className="flex items-start space-x-3 text-xs text-stone-800">
            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <div>
              <strong className="font-bold block">High-Res Indoor Garage Photos</strong>
              <span className="text-stone-500 text-[11px]">Snap pillars, floor markings, and stall numbers.</span>
            </div>
          </div>
        </div>

        {/* Purchase Button */}
        <button
          onClick={() => {
            onUpgrade();
            onClose();
          }}
          className="w-full py-4 rounded-full bg-[#FF5A36] hover:bg-[#e84e2c] text-white text-base font-bold flex items-center justify-center space-x-2 shadow-md shadow-[#FF5A36]/30 transition-transform active:scale-[0.98]"
        >
          <span>Unlock Forever for $1.99</span>
        </button>

        <p className="text-[11px] text-stone-400 mt-3">
          Restorable on all your devices with Google Play Family Library.
        </p>
      </div>
    </div>
  );
};
