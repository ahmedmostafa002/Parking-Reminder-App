import React, { useState } from 'react';
import { ArrowLeft, Shield, FileText, Mail, ExternalLink, Trash2, CheckCircle2, Lock } from 'lucide-react';

interface PrivacyPolicyModalProps {
  onClose: () => void;
  onClearAllData: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  onClose,
  onClearAllData,
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-[#FAF7F2] flex flex-col animate-fade-in">
      {/* Top Navbar */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3.5 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
        <button
          onClick={onClose}
          className="p-2 -ml-1 text-stone-700 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-[#FF5A36]" />
        </button>
        <h1 className="text-lg font-bold text-stone-900 font-display">
          Legal & Privacy Center
        </h1>
        <div className="w-10" />
      </header>

      {/* Tab Switcher */}
      <div className="bg-white border-b border-stone-200 px-4 py-2 flex space-x-2">
        <button
          onClick={() => setActiveTab('privacy')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
            activeTab === 'privacy'
              ? 'bg-[#FF5A36] text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Privacy Policy</span>
        </button>

        <button
          onClick={() => setActiveTab('terms')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
            activeTab === 'terms'
              ? 'bg-[#FF5A36] text-white shadow-xs'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Terms of Service</span>
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5 max-w-lg mx-auto w-full text-stone-800 text-xs sm:text-sm leading-relaxed">
        {activeTab === 'privacy' ? (
          <>
            {/* Privacy Header */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-1">
              <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
                <Lock className="w-4 h-4" />
                <span>On-Device Privacy Pledge</span>
              </div>
              <p className="text-emerald-900 text-xs">
                SpotSaver never uploads, synchronizes, or sells your parking coordinates, photos, or personal data. Everything stays on your phone.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-2">
                1. Information We Access
              </h3>
              <p className="text-stone-600 mb-2">
                <strong>Precise GPS Location:</strong> Used solely to capture your parked vehicle's coordinates and guide you back. Saved in device memory only.
              </p>
              <p className="text-stone-600 mb-2">
                <strong>Camera & Photos:</strong> Optional access to photograph your parking stall, garage level, or pillar number. Stored locally.
              </p>
              <p className="text-stone-600">
                <strong>Notifications:</strong> Local alarms to warn you before parking meter timer expiration.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-2">
                2. Advertising (Google AdMob)
              </h3>
              <p className="text-stone-600">
                We display non-intrusive ads on the History screen via Google AdMob. AdMob may process device identifiers (such as Android Advertising ID) to deliver relevant or non-personalized ads in accordance with Google's Advertising Policies.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-2">
                3. User Rights & Data Deletion
              </h3>
              <p className="text-stone-600 mb-3">
                In compliance with Google Play Store 2024+ policies, you can wipe all stored parking records and settings with one tap below.
              </p>

              {!showClearConfirm ? (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Erase All App Data & History</span>
                </button>
              ) : (
                <div className="p-3 bg-red-100 border border-red-300 rounded-2xl text-center space-y-2">
                  <p className="text-xs text-red-900 font-bold">
                    Permanently delete all saved spots and preferences?
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="flex-1 py-2 bg-white rounded-xl text-xs font-bold text-stone-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        onClearAllData();
                        setShowClearConfirm(false);
                        onClose();
                      }}
                      className="flex-1 py-2 bg-red-600 text-white rounded-xl text-xs font-bold shadow-xs"
                    >
                      Confirm Delete
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-stone-100 rounded-2xl p-4 space-y-1">
              <h4 className="font-bold text-stone-900 text-xs">Privacy Questions & Support</h4>
              <p className="text-stone-600 text-xs">
                Contact Developer Support at: <a href="mailto:Myworkemail2023@gmail.com" className="text-[#FF5A36] underline font-bold">Myworkemail2023@gmail.com</a>
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Terms of Service View */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-1">
              <h4 className="text-amber-900 font-bold text-xs">Driver Responsibility Notice</h4>
              <p className="text-amber-800 text-xs">
                Never interact with the application while actively driving. Always park safely before recording your spot.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-2">
                1. GPS & Navigation Disclaimer
              </h3>
              <p className="text-stone-600 mb-2">
                GPS and compass accuracy may vary based on environmental factors, high-rise buildings, underground parking garages, and hardware capabilities.
              </p>
              <p className="text-stone-600">
                SpotSaver is a memory aid and does not replace driver attentiveness or municipal parking signage.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-2">
                2. Parking Meter Timers
              </h3>
              <p className="text-stone-600">
                You remain solely responsible for adhering to all local parking regulations, meter rates, street cleaning schedules, and time restrictions. SpotSaver is not liable for parking citations or towing charges.
              </p>
            </div>

            <div className="bg-stone-100 rounded-2xl p-4 space-y-1">
              <h4 className="font-bold text-stone-900 text-xs">Support Contact</h4>
              <p className="text-stone-600 text-xs">
                Questions? Email us at: <a href="mailto:Myworkemail2023@gmail.com" className="text-[#FF5A36] underline font-bold">Myworkemail2023@gmail.com</a>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
