import React, { useEffect, useState } from 'react';

export default function LoadingScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const duration = 2800; // ~3 seconds
    const intervalTime = 30;
    const stepIncrement = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + stepIncrement;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    // Trigger fade-out animation at 2.8s and unmount at 3.1s
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2800);

    const completeTimer = setTimeout(() => {
      onFinish();
    }, 3200);

    return () => {
      clearInterval(timer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-white via-slate-50 to-[#EFF6FF] transition-opacity duration-500 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center max-w-sm px-6 text-center">
        {/* Glowing Pulsing Ring */}
        <div className="relative mb-6">
          <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-brand-navy via-brand-pink to-blue-600 opacity-25 blur-lg animate-pulse" />
          
          {/* Logo Badge */}
          <div className="relative w-20 h-20 rounded-2xl bg-brand-navy flex items-center justify-center text-white shadow-2xl shadow-blue-950/30 transform transition-transform hover:scale-105">
            <span className="text-2xl font-black tracking-wider">IKY</span>
          </div>
        </div>

        {/* Brand Title */}
        <h1 className="text-2xl font-extrabold text-brand-slate tracking-tight mb-1">
          I Know You
        </h1>
        <div className="text-xs font-bold tracking-[0.2em] text-brand-pink uppercase mb-6">
          Partner Family Portal
        </div>

        {/* Progress Bar Container */}
        <div className="w-64 bg-slate-200/80 h-2 rounded-full overflow-hidden shadow-inner mb-3">
          <div
            className="h-full bg-gradient-to-r from-brand-navy via-blue-600 to-brand-pink rounded-full transition-all duration-75 ease-out shadow-sm"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* Progress Percentage & Status */}
        <div className="flex items-center justify-between w-64 text-[11px] font-medium text-brand-muted">
          <span>Menyiapkan portal kemitraan...</span>
          <span className="font-mono font-bold text-brand-navy">
            {Math.round(progress)}%
          </span>
        </div>

        {/* Decorative Badge */}
        <div className="mt-8 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-slate-200/80 shadow-xs text-[11px] text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Sistem Sertifikasi Digital Berbasis STIFIn</span>
        </div>
      </div>
    </div>
  );
}
