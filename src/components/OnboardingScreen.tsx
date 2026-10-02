import React, { useState } from 'react';
import {
  Car,
  ShieldCheck,
  Clock,
  Camera,
  MapPin,
  Compass,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Share2,
} from 'lucide-react';
import { triggerHapticFeedback } from '../utils/geo';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 'gps-save',
      tag: '1-Tap GPS & App Shortcuts',
      title: 'Never Lose Your Parked Car Again',
      description:
        'Save your exact parking spot instantly with 1-tap GPS, or long-press the SpotSaver home screen icon for instant 1-second auto-save.',
      badgeColor: 'bg-orange-500/20 text-[#FF8F6B] border-orange-500/40',
      glowColor: 'from-[#FF5A36] to-[#E04826]',
      icon: (
        <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[#FF5A36]/20 animate-ping" />
          <div className="absolute inset-2 rounded-full bg-[#FF5A36]/30 blur-md" />
          <div className="relative w-18 h-18 rounded-3xl bg-gradient-to-tr from-[#FF5A36] via-[#FF7A59] to-[#FF9B80] text-white flex items-center justify-center shadow-2xl shadow-[#FF5A36]/50 border border-white/30">
            <Car className="w-10 h-10 drop-shadow-md" />
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center border-2 border-stone-900 shadow-lg">
            <MapPin className="w-4 h-4" />
          </div>
        </div>
      ),
      bullets: [
        'Instant 1-tap coordinate & street capture',
        'Android home screen long-press shortcuts',
        'Haptic double-pulse vibration confirmation',
      ],
    },
    {
      id: 'anti-overwrite',
      tag: 'Anti-Overwrite Lock',
      title: 'Smart Spot Protection System',
      description:
        'Competitor apps erase your spot if tapped twice. SpotSaver locks your spot safely until you return to your vehicle.',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      glowColor: 'from-emerald-500 to-teal-600',
      icon: (
        <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
          <div className="absolute inset-2 rounded-full bg-emerald-500/30 blur-md" />
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-400 text-white flex items-center justify-center shadow-2xl shadow-emerald-500/40 border border-white/30">
            <ShieldCheck className="w-11 h-11 drop-shadow-md" />
          </div>
          <div className="absolute bottom-1 -right-1 w-8 h-8 rounded-full bg-[#FF5A36] text-white flex items-center justify-center border-2 border-stone-900 shadow-lg">
            <Car className="w-4 h-4" />
          </div>
        </div>
      ),
      bullets: [
        'Active spot protection lock',
        'Bluetooth handsfree disconnect auto-detection',
        '1-Tap "Share Spot" via WhatsApp & SMS',
      ],
    },
    {
      id: 'meter-timer',
      tag: 'Meter Timer & Alerts',
      title: 'Avoid Costly Parking Tickets',
      description:
        'Set quick countdown meter alarms. Receive notification alerts before time runs out so you never get ticketed.',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      glowColor: 'from-amber-500 to-orange-500',
      icon: (
        <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
          <div className="absolute inset-2 rounded-full bg-amber-500/30 blur-md" />
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 text-white flex items-center justify-center shadow-2xl shadow-amber-500/40 border border-white/30">
            <Clock className="w-11 h-11 drop-shadow-md" />
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center border-2 border-stone-900 shadow-lg text-xs font-black">
            !
          </div>
        </div>
      ),
      bullets: [
        '15 / 30 / 60 min quick presets',
        'Sound chimes & notification alarms',
        '1-tap quick time extension',
      ],
    },
    {
      id: 'garage-notes',
      tag: 'Indoor Garages & Photos',
      title: 'Floor, Pillar & Photo Notes',
      description:
        'Parking in airport decks or multi-level garages? Snap photos of your pillar, pick floor colors, and log stall numbers.',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
      glowColor: 'from-blue-600 to-indigo-600',
      icon: (
        <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
          <div className="absolute inset-2 rounded-full bg-blue-500/30 blur-md" />
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 text-white flex items-center justify-center shadow-2xl shadow-blue-500/40 border border-white/30">
            <Camera className="w-11 h-11 drop-shadow-md" />
          </div>
          <div className="absolute -bottom-1 -left-1 w-8 h-8 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center border-2 border-stone-900 shadow-lg text-[11px] font-black">
            P3
          </div>
        </div>
      ),
      bullets: [
        'High-res pillar & stall camera photos',
        'Underground weak GPS signal helper',
        'Live compass walking navigation guide',
      ],
    },
  ];

  const handleNext = () => {
    triggerHapticFeedback('light');
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      triggerHapticFeedback('success');
      onComplete();
    }
  };

  const current = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-[#0F172A] via-[#1E1B4B] to-[#0B0F19] text-white flex flex-col justify-between p-6 overflow-y-auto animate-fade-in select-none font-['Outfit']">
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#FF5A36]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between pt-2">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#FF5A36] to-[#FF8F6B] text-white flex items-center justify-center shadow-lg shadow-[#FF5A36]/40 p-0.5 border border-white/20">
            <Car className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-white tracking-tight font-display text-lg">
            SpotSaver
          </span>
        </div>

        {currentSlide < slides.length - 1 && (
          <button
            onClick={() => {
              triggerHapticFeedback('light');
              onComplete();
            }}
            className="text-xs font-bold text-stone-400 hover:text-white px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            Skip
          </button>
        )}
      </div>

      {/* Main Slide Card */}
      <div className="relative z-10 my-auto max-w-sm w-full mx-auto text-center space-y-6 py-4">
        {/* Dynamic Graphic */}
        <div className="py-2">{current.icon}</div>

        {/* Feature Pill Badge */}
        <div className="inline-flex">
          <span
            className={`px-4 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md shadow-lg ${current.badgeColor}`}
          >
            {current.tag}
          </span>
        </div>

        {/* Title & Description */}
        <div className="space-y-2.5">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
            {current.title}
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-xs mx-auto">
            {current.description}
          </p>
        </div>

        {/* Feature Checkpoints Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-left space-y-2.5 shadow-xl">
          {current.bullets.map((bullet, idx) => (
            <div key={idx} className="flex items-center space-x-2.5 text-xs text-stone-200 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#FF8F6B] shrink-0" />
              <span>{bullet}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Controls & Progress */}
      <div className="relative z-10 max-w-sm w-full mx-auto space-y-5 pb-2">
        {/* Dot Indicators */}
        <div className="flex items-center justify-center space-x-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                triggerHapticFeedback('light');
                setCurrentSlide(idx);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx
                  ? 'w-8 bg-gradient-to-r from-[#FF5A36] to-[#FF8F6B]'
                  : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Next / Get Started Action Button */}
        <button
          onClick={handleNext}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF5A36] via-[#FF6D4A] to-[#E04826] hover:from-[#e84e2c] hover:to-[#c83c1c] text-white text-base font-black flex items-center justify-center space-x-2 shadow-xl shadow-[#FF5A36]/40 transition-transform active:scale-[0.98] border border-white/20 cursor-pointer"
        >
          <span>{currentSlide === slides.length - 1 ? 'Get Started' : 'Continue'}</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
