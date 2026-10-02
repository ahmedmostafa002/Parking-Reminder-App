import React, { useState } from 'react';
import {
  Bell,
  Map,
  ChevronRight,
  Bluetooth,
  Volume2,
  Check,
  Shield,
  Trash2,
  Car,
  Mail,
} from 'lucide-react';
import { AppSettings, MapViewType } from '../types';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onSimulateBluetooth: () => void;
  onOpenPrivacyPolicy: () => void;
  onClearAllData: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onSimulateBluetooth,
  onOpenPrivacyPolicy,
  onClearAllData,
}) => {
  const [showMapViewModal, setShowMapViewModal] = useState(false);
  const [isEditingVehicle, setIsEditingVehicle] = useState(false);
  const [vehicleNameInput, setVehicleNameInput] = useState(settings.userProfile.vehicleName || 'My Car');

  const toggleTimerAlerts = () => {
    onUpdateSettings({ timerAlertsEnabled: !settings.timerAlertsEnabled });
  };

  const toggleSound = () => {
    onUpdateSettings({ soundAlerts: !settings.soundAlerts });
  };

  const toggleBluetooth = () => {
    onUpdateSettings({ autoBluetoothDetection: !settings.autoBluetoothDetection });
  };

  const handleSaveVehicleName = () => {
    onUpdateSettings({
      userProfile: {
        ...settings.userProfile,
        vehicleName: vehicleNameInput,
      },
    });
    setIsEditingVehicle(false);
  };

  return (
    <div className="flex-1 w-full h-full bg-[#FAF7F2] overflow-y-auto pt-16 pb-24 px-4 sm:px-6 select-none">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header Title */}
        <div className="pt-2 pb-1 text-center relative">
          <h2 className="text-xl font-bold text-stone-900 font-display">
            Settings & Preferences
          </h2>
        </div>

        {/* SECTION 1: Preferences */}
        <div className="space-y-2.5">
          <h3 className="text-sm font-bold text-stone-700">
            Alerts & Map Style
          </h3>

          <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs divide-y divide-stone-100 overflow-hidden">
            {/* Parking Timer Alerts Switch */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-full bg-orange-50 text-[#FF5A36] flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">
                    Meter Expiry Alerts
                  </h4>
                  <p className="text-xs text-stone-500">
                    Notify {settings.notifyBeforeMinutes} min before meter expires
                  </p>
                </div>
              </div>

              <button
                onClick={toggleTimerAlerts}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                  settings.timerAlertsEnabled ? 'bg-[#FF5A36]' : 'bg-stone-300'
                }`}
                aria-label="Toggle meter timer alerts"
              >
                <span
                  className={`inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white transition-transform ${
                    settings.timerAlertsEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                >
                  {settings.timerAlertsEnabled && (
                    <Check className="w-3 h-3 text-[#FF5A36] stroke-[3]" />
                  )}
                </span>
              </button>
            </div>

            {/* Sound Alerts */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-full bg-orange-50 text-[#FF5A36] flex items-center justify-center">
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">
                    Audio Chimes
                  </h4>
                  <p className="text-xs text-stone-500">
                    Play tone when saving or finding car
                  </p>
                </div>
              </div>

              <button
                onClick={toggleSound}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                  settings.soundAlerts ? 'bg-[#FF5A36]' : 'bg-stone-300'
                }`}
                aria-label="Toggle sound chimes"
              >
                <span
                  className={`inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white transition-transform ${
                    settings.soundAlerts ? 'translate-x-6' : 'translate-x-1'
                  }`}
                >
                  {settings.soundAlerts && (
                    <Check className="w-3 h-3 text-[#FF5A36] stroke-[3]" />
                  )}
                </span>
              </button>
            </div>

            {/* Map View Selector */}
            <button
              onClick={() => setShowMapViewModal(true)}
              className="w-full flex items-center justify-between p-4 hover:bg-stone-50 transition-colors text-left"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-full bg-orange-50 text-[#FF5A36] flex items-center justify-center">
                  <Map className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-stone-900">
                  Map Style
                </h4>
              </div>
              <div className="flex items-center space-x-1.5 text-stone-500 text-sm font-medium capitalize">
                <span>{settings.mapView}</span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </div>
            </button>
          </div>
        </div>

        {/* SECTION 2: Vehicle Profile */}
        <div className="space-y-2.5">
          <h3 className="text-sm font-bold text-stone-700">
            Vehicle Profile
          </h3>

          <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-orange-100 text-[#FF5A36] flex items-center justify-center">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">
                    {settings.userProfile.vehicleName || 'My Vehicle'}
                  </h4>
                  <p className="text-xs text-stone-400">
                    Support: {settings.userProfile.email}
                  </p>
                </div>
              </div>

              {!isEditingVehicle && (
                <button
                  onClick={() => setIsEditingVehicle(true)}
                  className="text-xs font-bold text-[#FF5A36] hover:underline"
                >
                  Edit Name
                </button>
              )}
            </div>

            {isEditingVehicle && (
              <div className="flex space-x-2 pt-2 border-t border-stone-100">
                <input
                  type="text"
                  value={vehicleNameInput}
                  onChange={(e) => setVehicleNameInput(e.target.value)}
                  placeholder="e.g. Blue Honda Civic"
                  className="flex-1 text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5A36]"
                />
                <button
                  onClick={handleSaveVehicleName}
                  className="px-3 py-2 bg-[#FF5A36] text-white text-xs font-bold rounded-xl"
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 3: Smart Detection (V2 Features) */}
        <div className="space-y-2.5">
          <h3 className="text-sm font-bold text-stone-700">
            Smart Detection (V2)
          </h3>

          <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs divide-y divide-stone-100 overflow-hidden">
            {/* Bluetooth Auto-Park Switch */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Bluetooth className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">
                    Car Bluetooth Disconnect
                  </h4>
                  <p className="text-xs text-stone-500">
                    Auto-save spot when audio disconnects
                  </p>
                </div>
              </div>

              <button
                onClick={toggleBluetooth}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                  settings.autoBluetoothDetection ? 'bg-[#FF5A36]' : 'bg-stone-300'
                }`}
                aria-label="Toggle Bluetooth auto-detection"
              >
                <span
                  className={`inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white transition-transform ${
                    settings.autoBluetoothDetection ? 'translate-x-6' : 'translate-x-1'
                  }`}
                >
                  {settings.autoBluetoothDetection && (
                    <Check className="w-3 h-3 text-[#FF5A36] stroke-[3]" />
                  )}
                </span>
              </button>
            </div>

            {/* Test Simulation Button */}
            <button
              onClick={onSimulateBluetooth}
              className="w-full flex items-center justify-between p-4 hover:bg-stone-50 text-left text-xs font-semibold text-stone-700"
            >
              <span>Test Disconnect Simulation</span>
              <span className="text-[#FF5A36] font-bold">Simulate &rarr;</span>
            </button>
          </div>
        </div>

        {/* SECTION 4: Legal, Privacy & Data Safety (Google Play Compliance) */}
        <div className="space-y-2.5">
          <h3 className="text-sm font-bold text-stone-700">
            Legal, Privacy & Data Safety
          </h3>

          <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs divide-y divide-stone-100 overflow-hidden">
            {/* Privacy Policy & Terms Modal Button */}
            <button
              onClick={onOpenPrivacyPolicy}
              className="w-full flex items-center justify-between p-4 hover:bg-stone-50 transition-colors text-left"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">
                    Privacy Policy & Terms
                  </h4>
                  <p className="text-xs text-stone-500">
                    On-device data safety & disclosures
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-stone-400" />
            </button>

            {/* Support Email */}
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">
                    Developer Support
                  </h4>
                  <a
                    href="mailto:Myworkemail2023@gmail.com"
                    className="text-xs text-[#FF5A36] underline font-medium"
                  >
                    Myworkemail2023@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Clear All App Data (Play Store requirement) */}
            <button
              onClick={onClearAllData}
              className="w-full py-4 text-center font-bold text-red-600 hover:bg-red-50 text-xs transition-colors flex items-center justify-center space-x-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Erase All Saved Spots & Reset App</span>
            </button>
          </div>
        </div>
      </div>

      {/* Map View Selection Modal */}
      {showMapViewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl border border-stone-200 space-y-4">
            <h3 className="text-base font-bold text-stone-900">Choose Map Style</h3>
            <div className="space-y-2">
              {(['flat', 'street', 'satellite'] as MapViewType[]).map((style) => (
                <button
                  key={style}
                  onClick={() => {
                    onUpdateSettings({ mapView: style });
                    setShowMapViewModal(false);
                  }}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold text-left flex items-center justify-between border transition-all ${
                    settings.mapView === style
                      ? 'border-[#FF5A36] bg-orange-50/50 text-[#FF5A36]'
                      : 'border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="capitalize">{style} Map</span>
                  {settings.mapView === style && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowMapViewModal(false)}
              className="w-full py-2 text-xs font-semibold text-stone-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
