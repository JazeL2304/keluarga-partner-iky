import React from 'react';
import { Check, ArrowUpRight } from 'lucide-react';

export default function SidebarRail({ currentStep, setStep, isSubmitted }) {
  const steps = [
    {
      number: 1,
      title: 'Data Keluarga',
      subtitle: 'Informasi kepala & anggota',
    },
    {
      number: 2,
      title: 'Kontak & Domisili',
      subtitle: 'No. HP, email & domisili',
    },
    {
      number: 3,
      title: 'Konfirmasi & Sertifikat',
      subtitle: 'Generate & unduh PDF resmi',
    },
  ];

  return (
    <aside className="w-full lg:w-[320px] xl:w-[350px] bg-white border-b lg:border-b-0 lg:border-r border-brand-border p-5 sm:p-7 lg:p-9 flex flex-col justify-between shrink-0">
      <div>
        {/* Brand identity */}
        <div className="flex items-center space-x-3 mb-5 sm:mb-8">
          <div className="w-10 h-10 rounded-xl bg-brand-navy flex items-center justify-center text-white font-bold tracking-tight shadow-md shadow-blue-900/20">
            <span className="text-sm font-extrabold tracking-wider">IKY</span>
          </div>
          <div>
            <div className="font-bold text-base tracking-tight text-brand-slate leading-none">
              I Know You
            </div>
            <div className="text-[11px] font-semibold text-brand-muted tracking-wide mt-1 uppercase">
              Partner Family Portal
            </div>
          </div>
        </div>

        {/* Section Title */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold text-brand-slate tracking-tight">
            Registrasi Keluarga Partner
          </h2>
          <p className="text-xs text-brand-muted mt-1.5 leading-relaxed font-normal">
            Lengkapi 3 langkah mudah untuk pendataan dan penerbitan sertifikat digital resmi.
          </p>
        </div>

        {/* ================================================================= */}
        {/* Kerangka Stepper 3 Langkah (Selalu Muncul di Mobile & Desktop)   */}
        {/* ================================================================= */}
        <nav aria-label="Progress Steps" className="relative my-2 sm:my-4">
          {/* Vertical continuous guideline */}
          <div
            aria-hidden="true"
            className="absolute left-[18px] top-4 bottom-5 w-[2px] bg-slate-100"
          />

          <ul className="space-y-5 sm:space-y-6 relative">
            {steps.map((step) => {
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number || isSubmitted;

              return (
                <li
                  key={step.number}
                  className={`flex items-start group transition-all duration-200 ${
                    isSubmitted ? 'opacity-90' : 'cursor-pointer'
                  }`}
                  onClick={() => {
                    if (!isSubmitted && step.number < currentStep) {
                      setStep(step.number);
                    }
                  }}
                >
                  {/* Step Icon / Circle */}
                  <div
                    className={`relative z-10 flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold shrink-0 ring-4 ring-white transition-all duration-300 ${
                      isCompleted
                        ? 'bg-brand-pink text-white shadow-md shadow-pink-500/20'
                        : isActive
                        ? 'bg-brand-navy text-white shadow-md shadow-blue-950/25 ring-blue-50'
                        : 'bg-white border-2 border-slate-200 text-slate-400'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4 stroke-[3]" />
                    ) : (
                      step.number
                    )}
                  </div>

                  {/* Step Label & Subtitle */}
                  <div className="ml-3.5 sm:ml-4 pt-0.5">
                    <span
                      className={`block text-xs sm:text-sm font-bold tracking-tight transition-colors ${
                        isActive
                          ? 'text-brand-slate'
                          : isCompleted
                          ? 'text-slate-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.title}
                    </span>
                    <span className="block text-[11px] sm:text-xs text-brand-muted mt-0.5 font-medium">
                      {step.subtitle}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Bottom Support Link */}
      <div className="pt-4 sm:pt-6 mt-6 sm:mt-8 border-t border-slate-100 text-xs text-brand-muted">
        <a
          href="https://wa.me/6281234567890"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-slate-500 hover:text-brand-navy transition-colors font-medium group"
        >
          <span>Butuh bantuan? Hubungi Admin IKY</span>
          <ArrowUpRight className="w-3.5 h-3.5 ml-1 text-slate-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </a>
      </div>
    </aside>
  );
}
