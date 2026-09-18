import React from 'react';
import { Check, HelpCircle } from 'lucide-react';

export default function SidebarRail({ currentStep, setStep, isSubmitted }) {
  const steps = [
    {
      number: 1,
      roman: 'I',
      title: 'Profil Orang Tua',
      subtitle: 'Kategori & genetika STIFIn ayah ibu',
    },
    {
      number: 2,
      roman: 'II',
      title: 'Profil Genetika Anak',
      subtitle: 'Pemetaan STIFIn seluruh anak',
    },
    {
      number: 3,
      roman: 'III',
      title: 'Pratinjau & Penerbitan',
      subtitle: 'Verifikasi fisik piagam apresiasi',
    },
  ];

  return (
    <aside className="w-full lg:w-[310px] xl:w-[330px] bg-[#58121A] text-[#FAF8F5] p-7 sm:p-9 flex flex-col justify-between shrink-0 relative overflow-hidden">
      {/* Background Subtle Watermark Pattern */}
      <div
        className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full border border-[#C4A36B]/10 pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full border border-[#C4A36B]/5 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10">
        {/* Brand identity */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full border border-[#C4A36B]/40 bg-[#420D13] flex items-center justify-center text-[#C4A36B] font-serif font-bold text-sm tracking-wider shadow-inner">
              IKY
            </div>
            <div>
              <div className="font-serif text-lg font-bold text-[#FAF8F5] leading-none tracking-tight">
                I Know You
              </div>
              <div className="text-[11px] text-[#C4A36B] font-medium tracking-wide mt-1">
                by misshiday · STIFIn
              </div>
            </div>
          </div>
          <div className="h-[1px] w-full bg-gradient-to-r from-[#C4A36B]/30 via-[#C4A36B]/15 to-transparent my-4" />
          <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#FAF8F5] tracking-tight">
            Kemitraan Keluarga
          </h2>
          <p className="text-xs text-[#FAF8F5]/70 mt-1.5 leading-relaxed font-sans">
            Pencatatan profil fitrah genetik keluarga & penerbitan piagam apresiasi resmi.
          </p>
        </div>

        {/* Milestone Steps */}
        <nav aria-label="Tahapan Pendaftaran" className="relative my-6">
          <div
            aria-hidden="true"
            className="absolute left-[15px] top-3 bottom-4 w-[1px] bg-[#C4A36B]/20"
          />

          <ul className="space-y-7 relative">
            {steps.map((step) => {
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number || isSubmitted;

              return (
                <li
                  key={step.number}
                  className={`flex items-start group select-none transition-all ${
                    !isSubmitted && step.number < currentStep ? 'cursor-pointer' : ''
                  }`}
                  onClick={() => {
                    if (!isSubmitted && step.number < currentStep) {
                      setStep(step.number);
                    }
                  }}
                >
                  {/* Step Marker: Roman Numeral / Check */}
                  <div
                    className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full text-xs font-serif font-bold shrink-0 transition-all ${
                      isActive
                        ? 'bg-[#C4A36B] text-[#58121A] ring-4 ring-[#C4A36B]/25 shadow-md scale-105'
                        : isCompleted
                        ? 'bg-[#420D13] border border-[#C4A36B]/60 text-[#C4A36B]'
                        : 'bg-[#58121A] border border-[#C4A36B]/25 text-[#FAF8F5]/40'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    ) : (
                      step.roman
                    )}
                  </div>

                  {/* Step Label */}
                  <div className="ml-3.5 pt-0.5">
                    <span
                      className={`block text-xs sm:text-sm font-semibold tracking-tight transition-colors ${
                        isActive
                          ? 'text-[#FAF8F5] font-bold'
                          : isCompleted
                          ? 'text-[#FAF8F5]/90'
                          : 'text-[#FAF8F5]/40'
                      }`}
                    >
                      {step.title}
                    </span>
                    <span className="block text-[11px] text-[#FAF8F5]/60 mt-0.5 leading-snug">
                      {step.subtitle}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Footer Meta */}
      <div className="relative z-10 pt-5 mt-6 border-t border-[#C4A36B]/20 text-[11px] text-[#FAF8F5]/60 flex items-center justify-between">
        <span className="font-serif italic text-xs text-[#C4A36B]">
          Well Identified Family
        </span>
        <a
          href="https://stifiniknowyou.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#FAF8F5]/50 hover:text-[#C4A36B] transition-colors"
        >
          iknowyou.id
        </a>
      </div>
    </aside>
  );
}
