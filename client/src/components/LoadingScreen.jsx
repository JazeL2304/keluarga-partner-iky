import React, { useEffect, useState } from 'react';

export default function LoadingScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalDuration = 1800;
    const startTime = performance.now();
    let animFrame;

    const animateProgress = (currentTime) => {
      const elapsed = currentTime - startTime;
      const pct = Math.min(100, (elapsed / totalDuration) * 100);
      setProgress(pct);

      if (elapsed < totalDuration) {
        animFrame = requestAnimationFrame(animateProgress);
      } else {
        onFinish();
      }
    };

    animFrame = requestAnimationFrame(animateProgress);

    return () => {
      if (animFrame) cancelAnimationFrame(animFrame);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F8FAFC]">
      <div className="flex flex-col items-center w-full max-w-sm px-6">
        {/* Lingkaran Loading Effect di Sekitar Logo IKNOWYOU */}
        <div className="relative flex items-center justify-center mb-6 select-none">
          {/* Background Ring Track */}
          <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full border-2 border-slate-200/60" />

          {/* Spinning Loading Ring */}
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#FF4081] border-r-[#1E3A8A] animate-spin"
            style={{ animationDuration: '0.9s' }}
          />

          {/* White Card containing the Official Logo in the center of the ring */}
          <div className="absolute inset-2 sm:inset-2.5 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center p-3.5">
            <img
              src="/logo-iknowyou.png"
              alt="IKNOWYOU by Miss Hiday"
              className="w-24 sm:w-28 h-auto object-contain drop-shadow-2xs"
            />
          </div>
        </div>

        {/* Brand Hierarchy & Well Identified Family */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-pink-50 border border-pink-100 text-[#FF4081] text-[11px] font-bold tracking-wide mb-1 shadow-2xs">
            Well Identified Family
          </div>
          <p className="text-xs font-medium text-slate-500">
            Portal Kemitraan Keluarga STIFIn
          </p>
        </div>

        {/* Minimal Hairline Progress with Brand Dual-Color Gradient */}
        <div className="w-full bg-slate-200/80 h-[3px] rounded-full overflow-hidden mb-3 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-[#1E3A8A] via-[#FF4081] to-[#E02868] transition-all duration-75 ease-out rounded-full"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* Tabular Progress Counter & Status */}
        <div className="flex items-center justify-between w-full text-[11px] text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF4081] animate-ping" />
            Memuat sistem...
          </span>
          <span className="font-mono tabular-nums text-slate-700 font-semibold">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  );
}
