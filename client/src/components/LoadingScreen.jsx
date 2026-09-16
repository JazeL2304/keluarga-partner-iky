import React, { useEffect, useState } from 'react';

export default function LoadingScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const duration = 1800; // 1.8 detik untuk isi progres, total 2.0 detik selesai
    const intervalTime = 25;
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

    // Fade out dimulai pada detik ke 1.8
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 1800);

    // Redirect / unmount tepat pada detik ke 2.0
    const completeTimer = setTimeout(() => {
      onFinish();
    }, 2050);

    return () => {
      clearInterval(timer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-white via-slate-50 to-[#EFF6FF] transition-opacity duration-300 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center max-w-sm px-6 text-center">
        {/* ========================================================= */}
        {/* ANIMASI BULAT (Circular Spinner Ring + Logo Center)      */}
        {/* ========================================================= */}
        <div className="relative mb-6 flex items-center justify-center">
          {/* Outer Glow Effect */}
          <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-brand-navy via-brand-pink to-blue-500 opacity-20 blur-xl animate-pulse" />

          {/* Circular Spinner Ring 1 (Putaran Searah Jarum Jam) */}
          <div className="w-28 h-28 rounded-full border-4 border-slate-100 border-t-brand-navy border-r-brand-pink animate-spin" style={{ animationDuration: '1.2s' }} />

          {/* Circular Spinner Ring 2 (Putaran Berlawanan - Halus) */}
          <div className="absolute w-24 h-24 rounded-full border-2 border-dashed border-brand-pink/50 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }} />

          {/* Logo Badge di Tengah Lingkaran */}
          <div className="absolute w-16 h-16 rounded-2xl bg-brand-navy flex items-center justify-center text-white shadow-xl shadow-blue-950/30">
            <span className="text-xl font-black tracking-wider">IKY</span>
          </div>
        </div>

        {/* Brand Title */}
        <h1 className="text-2xl font-extrabold text-brand-slate tracking-tight mb-0.5">
          I Know You
        </h1>
        <div className="text-[11px] font-bold tracking-[0.2em] text-brand-pink uppercase mb-5">
          Partner Family Portal
        </div>

        {/* Loading Spinner Icon Kecil + Teks Status */}
        <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-brand-navy">
          <svg
            className="w-4 h-4 animate-spin text-brand-pink"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Memuat Portal Kemitraan...</span>
        </div>

        {/* Progress Bar Container */}
        <div className="w-64 bg-slate-200/80 h-2 rounded-full overflow-hidden shadow-inner mb-2.5">
          <div
            className="h-full bg-gradient-to-r from-brand-navy via-blue-600 to-brand-pink rounded-full transition-all duration-75 ease-out shadow-sm"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* Progress Percentage */}
        <div className="flex items-center justify-between w-64 text-[11px] font-medium text-brand-muted">
          <span>Menyiapkan sistem...</span>
          <span className="font-mono font-bold text-brand-navy">
            {Math.round(progress)}%
          </span>
        </div>

        {/* Tag Sertifikasi Digital */}
        <div className="mt-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-xs text-[11px] text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Sertifikasi Kemitraan Berbasis STIFIn</span>
        </div>
      </div>
    </div>
  );
}
