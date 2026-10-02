import React, { useState, useEffect } from 'react';
import { Bluetooth, Check, Car, X, Radio, ArrowRight, Smartphone, RefreshCw } from 'lucide-react';

interface BluetoothSimModalProps {
  vehicleName?: string;
  onSimulateDisconnect: (customDeviceName?: string) => void;
  onClose: () => void;
}

export const BluetoothSimModal: React.FC<BluetoothSimModalProps> = ({
  vehicleName = 'My Car',
  onSimulateDisconnect,
  onClose,
}) => {
  const [deviceName, setDeviceName] = useState(() => {
    const saved = localStorage.getItem('spotsaver_bt_device');
    return saved || `${vehicleName} HandsFree / Audio`;
  });
  const [isEditingDevice, setIsEditingDevice] = useState(false);
  const [deviceState, setDeviceState] = useState<'connected' | 'disconnecting' | 'saved'>('connected');
  const [isScanningRealBT, setIsScanningRealBT] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Connected & Monitoring');

  const handleSaveDeviceName = (name: string) => {
    setDeviceName(name);
    localStorage.setItem('spotsaver_bt_device', name);
    setIsEditingDevice(false);
  };

  // Real Web Bluetooth Scanner (if supported by device browser)
  const handleScanRealBluetooth = async () => {
    if ('bluetooth' in navigator) {
      try {
        setIsScanningRealBT(true);
        // @ts-ignore
        const device = await navigator.bluetooth.requestDevice({
          acceptAllDevices: true,
        });
        if (device && device.name) {
          handleSaveDeviceName(device.name);
          setStatusMessage(`Paired with ${device.name}`);
        }
      } catch (err: any) {
        console.debug('Bluetooth scan notice:', err.message);
      } finally {
        setIsScanningRealBT(false);
      }
    } else {
      setIsEditingDevice(true);
    }
  };

  const handleSimulate = () => {
    setDeviceState('disconnecting');
    setStatusMessage('Car audio disconnected. Capturing high-precision GPS...');
    setTimeout(() => {
      setDeviceState('saved');
      setStatusMessage('GPS spot recorded successfully!');
      setTimeout(() => {
        onSimulateDisconnect(deviceName);
        onClose();
      }, 900);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-md p-4 animate-fade-in select-none">
      <div className="relative w-full max-w-sm bg-[#FAF7F2] rounded-3xl p-6 shadow-2xl border border-stone-200/90 flex flex-col items-center text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Animated Bluetooth Glowing Icon */}
        <div className="relative mb-3 mt-1">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Bluetooth className="w-8 h-8 animate-pulse" />
          </div>
          <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center">
            <Check className="w-3 h-3 text-white stroke-[3]" />
          </span>
        </div>

        <h3 className="text-xl font-bold text-stone-900 font-display mb-1">
          Auto-Save via Bluetooth
        </h3>
        <p className="text-xs text-stone-500 mb-5 leading-relaxed">
          SpotSaver continuously detects when your phone disconnects from your vehicle's audio or Android Auto, instantly locking your exact parking coordinates.
        </p>

        {/* Dynamic Paired Car Device Card */}
        <div className="w-full bg-white rounded-2xl p-4 border border-stone-200 text-left space-y-3 mb-5 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0 pr-2">
              <Radio className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="text-xs font-bold text-stone-900 truncate">
                {deviceName}
              </span>
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-wide text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
              {deviceState === 'connected' ? 'Paired' : deviceState === 'disconnecting' ? 'Disconnecting' : 'Saved'}
            </span>
          </div>

          {/* Quick Edit or Real Scan Button */}
          {!isEditingDevice ? (
            <div className="flex items-center justify-between pt-1 border-t border-stone-100 text-[11px]">
              <span className="text-stone-400">Trigger: Engine Shut-Off</span>
              <button
                onClick={() => setIsEditingDevice(true)}
                className="text-blue-600 font-bold hover:underline"
              >
                Change Device
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-stone-100 space-y-2">
              <input
                type="text"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
                placeholder="Enter your car's Bluetooth name"
                className="w-full text-xs px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => handleSaveDeviceName(deviceName)}
                  className="flex-1 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-xl"
                >
                  Save Device
                </button>
                <button
                  onClick={handleScanRealBluetooth}
                  disabled={isScanningRealBT}
                  className="px-3 py-1.5 bg-stone-100 text-stone-700 text-xs font-bold rounded-xl border border-stone-200 flex items-center space-x-1"
                >
                  <RefreshCw className={`w-3 h-3 ${isScanningRealBT ? 'animate-spin' : ''}`} />
                  <span>Scan</span>
                </button>
              </div>
            </div>
          )}

          {/* Real-Time Live Status Pill */}
          <div className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-xl border border-stone-100 flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${deviceState === 'connected' ? 'bg-emerald-500' : 'bg-orange-500 animate-ping'}`} />
            <span className="truncate">{statusMessage}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          disabled={deviceState !== 'connected'}
          onClick={handleSimulate}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF5A36] to-[#E04826] hover:from-[#e84e2c] hover:to-[#c83c1c] text-white text-sm font-bold flex items-center justify-center space-x-2 shadow-lg shadow-[#FF5A36]/25 transition-transform active:scale-[0.98] disabled:opacity-50 cursor-pointer"
        >
          <Car className="w-4 h-4" />
          <span>{deviceState === 'connected' ? 'Test Disconnect & Auto-Save' : 'Auto-Saving Spot...'}</span>
        </button>
      </div>
    </div>
  );
};
