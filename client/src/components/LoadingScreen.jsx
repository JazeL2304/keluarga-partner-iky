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
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FAF8F5] text-[#1F1A1B]">
      <div className="flex flex-col items-center w-full max-w-sm px-6">
        {/* Dignified Monogram Badge */}
        <div className="w-16 h-16 rounded-full bg-[#58121A] text-[#FAF8F5] flex items-center justify-center shadow-warm mb-6 border border-[#C4A36B]/40">
          <span className="font-serif text-2xl font-bold tracking-widest text-[#FAF8F5]">
            IKY
          </span>
        </div>

        {/* Brand Hierarchy */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1A1B] tracking-tight">
            I Know You
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#C4A36B] font-semibold mt-1">
            by misshiday · STIFIn
          </p>
          <p className="text-xs text-[#8A827E] mt-2 font-serif italic">
            Well Identified Family
          </p>
        </div>

        {/* Quiet Hairline Progress Bar */}
        <div className="w-48 bg-[#EAE3D7] h-[2px] rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-[#58121A] transition-all duration-75 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* Progress Counter */}
        <div className="text-[11px] font-serif tracking-widest text-[#8A827E]">
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
}
