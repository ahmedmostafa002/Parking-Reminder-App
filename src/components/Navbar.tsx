import React from 'react';
import { Settings, Clock } from 'lucide-react';
import { NavigationTab, MeterTimer } from '../types';

interface NavbarProps {
  currentTab: NavigationTab;
  onOpenSettings: () => void;
  meterTimer: MeterTimer | null;
  onOpenTimerModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onOpenSettings,
  meterTimer,
  onOpenTimerModal,
}) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 sm:px-5 py-3 bg-white/90 backdrop-blur-xl border-b border-stone-200/80 shadow-xs select-none">
      {/* Brand Logo & Catchy Luxury Typography */}
      <div
        className="flex items-center space-x-2.5 cursor-pointer group transition-transform active:scale-95"
        onClick={() => window.location.reload()}
      >
        {/* Clean 3D Glowing Coral Emblem (No Dark Box) */}
        <div className="w-10 h-10 flex items-center justify-center shrink-0">
          <img
            src="/spotsaver_nav_icon.png"
            alt="SpotSaver Icon"
            className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform"
          />
        </div>

        {/* Catchy Styled Automotive Logotype */}
        <div className="flex flex-col text-left">
          <div className="flex items-center space-x-0.5 font-['Outfit']">
            <span className="text-[22px] font-black tracking-tight text-stone-900 leading-none">
              Spot
            </span>
            <span className="text-[22px] font-black tracking-tight bg-gradient-to-r from-[#FF5A36] to-[#FF7A59] bg-clip-text text-transparent leading-none">
              Saver
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A36] ml-1 mb-0.5 animate-pulse" />
          </div>

          <div className="flex items-center space-x-1.5 mt-0.5">
            <span className="text-[9.5px] font-extrabold text-stone-400 tracking-widest uppercase font-['Plus_Jakarta_Sans']">
              Smart GPS Reminder
            </span>
          </div>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center space-x-2">
        {/* Quick Meter Indicator if Active */}
        {meterTimer && meterTimer.isActive && (
          <button
            onClick={onOpenTimerModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 rounded-2xl border border-amber-300/80 transition-all active:scale-95 shadow-2xs"
            title="View Active Meter Timer"
          >
            <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin-slow" />
            <span className="font-extrabold font-mono">
              {Math.max(1, Math.ceil((meterTimer.expiresAt - Date.now()) / (1000 * 60)))}m
            </span>
          </button>
        )}

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="w-10 h-10 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 transition-all active:scale-95 border border-stone-200/80 flex items-center justify-center shadow-2xs"
          title="App Settings & Data Safety"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5 text-stone-700 transition-transform active:rotate-45" />
        </button>
      </div>
    </header>
  );
};
