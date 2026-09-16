import React, { useEffect, useState } from 'react';

export default function LoadingScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalDuration = 2000; // 2 detik presisi
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
      <div className="flex flex-col items-center w-full max-w-xs px-6">
        {/* Minimalist Brand Mark & Geometric Spinner */}
        <div className="relative flex items-center justify-center mb-8">
          {/* Subtle Hairline Spinner (Navy + Pink) */}
          <div
            className="w-16 h-16 rounded-full border-[1.5px] border-slate-200 border-t-[#FF4081] border-r-[#1E3A8A] animate-spin"
            style={{ animationDuration: '0.9s' }}
          />
          
          {/* Typographic Monogram */}
          <span className="absolute font-mono font-extrabold text-xs tracking-wider text-[#1E3A8A]">
            IKY<span className="text-[#FF4081]">.</span>
          </span>
        </div>

        {/* Brand Hierarchy */}
        <div className="text-center mb-6">
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">
            I Know You
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-0.5">
            Portal Kemitraan Keluarga
          </p>
        </div>

        {/* Minimal Hairline Progress */}
        <div className="w-full bg-slate-200/70 h-[2px] rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-[#1E3A8A] to-[#FF4081] transition-all duration-75 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* Tabular Progress Counter */}
        <div className="flex items-center justify-between w-full text-[11px] text-slate-400 font-medium">
          <span>Memuat sistem</span>
          <span className="font-mono tabular-nums text-slate-700">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  );
}
