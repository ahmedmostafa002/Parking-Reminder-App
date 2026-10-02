import React, { useEffect, useState } from 'react';

interface FullScreenSplashProps {
  onFinish: () => void;
}

export const FullScreenSplash: React.FC<FullScreenSplashProps> = ({ onFinish }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Show full-screen splash image for 1.8 seconds then fade out smoothly
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => {
        onFinish();
      }, 400);
    }, 1800);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[100] w-full h-full bg-[#0A0D18] flex items-center justify-center overflow-hidden transition-opacity duration-400 select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Full-Screen Edge-to-Edge Splash Artwork */}
      <img
        src="/spotsaver_splash.png"
        alt="SpotSaver Splash"
        className="w-full h-full object-cover animate-scale-in"
      />

      {/* Subtle Bottom Loading Indicator */}
      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center justify-center space-y-2 pointer-events-none">
        <div className="w-24 h-1 bg-white/20 rounded-full overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-[#FF5A36] to-[#FF8F6B] rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};
