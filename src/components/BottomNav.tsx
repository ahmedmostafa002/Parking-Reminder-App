import React from 'react';
import { Map, RotateCcw, Settings } from 'lucide-react';
import { NavigationTab } from '../types';

interface BottomNavProps {
  currentTab: NavigationTab;
  onChangeTab: (tab: NavigationTab) => void;
  hasActiveSpot: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onChangeTab,
  hasActiveSpot,
}) => {
  const tabs = [
    {
      id: 'map' as NavigationTab,
      label: 'Map',
      icon: Map,
    },
    {
      id: 'history' as NavigationTab,
      label: 'History',
      icon: RotateCcw,
    },
    {
      id: 'settings' as NavigationTab,
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <div
      className={`fixed left-0 right-0 z-30 pointer-events-none flex justify-center px-4 transition-all duration-300 ${
        currentTab === 'history' ? 'bottom-14' : 'bottom-3'
      }`}
    >
      <nav className="pointer-events-auto w-full max-w-sm bg-white/95 backdrop-blur-xl border border-stone-200/90 shadow-2xl rounded-3xl p-1.5 flex items-center justify-between transition-all">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`relative flex-1 py-2.5 px-3 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 ${
                isActive
                  ? 'bg-gradient-to-tr from-[#FF5A36] to-[#FF7A59] text-white shadow-md shadow-[#FF5A36]/30'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100/60'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.5]' : 'stroke-[2]'
                  }`}
                />
                {tab.id === 'map' && hasActiveSpot && !isActive && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#FF5A36] rounded-full ring-2 ring-white animate-pulse" />
                )}
              </div>
              <span
                className={`text-[11px] mt-0.5 tracking-tight ${
                  isActive ? 'font-black text-white' : 'font-semibold text-stone-600'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
