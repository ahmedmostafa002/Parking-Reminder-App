import React from 'react';
import { ShieldCheck, Check, Sparkles } from 'lucide-react';

interface AdMobConsentBannerProps {
  onConsent: (choice: 'granted' | 'non_personalized') => void;
  onOpenPrivacyPolicy: () => void;
  onOpenPro: () => void;
}

export const AdMobConsentBanner: React.FC<AdMobConsentBannerProps> = ({
  onConsent,
  onOpenPrivacyPolicy,
  onOpenPro,
}) => {
  return (
    <div className="fixed bottom-16 left-3 right-3 z-40 max-w-md mx-auto bg-stone-900/95 text-white backdrop-blur-md rounded-2xl p-4 border border-stone-700 shadow-2xl animate-fade-in select-none">
      <div className="flex items-start space-x-3">
        <div className="w-8 h-8 rounded-full bg-[#FF5A36] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
          <ShieldCheck className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-bold text-white mb-0.5">
            Ad Preferences & Privacy (EU/GDPR)
          </h4>
          <p className="text-[11px] text-stone-300 leading-snug">
            We use Google AdMob to show ads on the History tab. You can choose personalized ads or non-personalized ads. Learn more in our{' '}
            <button
              onClick={onOpenPrivacyPolicy}
              className="text-[#FF8F6B] underline font-medium hover:text-white"
            >
              Privacy Policy
            </button>.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 mt-3">
            <button
              onClick={() => onConsent('granted')}
              className="flex-1 py-1.5 px-2.5 bg-[#FF5A36] hover:bg-[#e84e2c] text-white text-[11px] font-bold rounded-lg transition-transform active:scale-95 shadow-xs"
            >
              Accept Personalized
            </button>

            <button
              onClick={() => onConsent('non_personalized')}
              className="flex-1 py-1.5 px-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] font-bold rounded-lg border border-stone-600 transition-colors"
            >
              Non-Personalized
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
