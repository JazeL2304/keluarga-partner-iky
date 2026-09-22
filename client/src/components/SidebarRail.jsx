import React from 'react';
import { Check, ArrowUpRight } from 'lucide-react';

export default function SidebarRail({ currentStep, setStep, isSubmitted }) {
  const steps = [
    {
      number: 1,
      title: 'Profil Orang Tua',
      subtitle: 'Kategori, ayah & ibu',
    },
    {
      number: 2,
      title: 'Profil Genetika Anak',
      subtitle: 'Data STIFIn anak dinamis',
    },
    {
      number: 3,
      title: 'Konfirmasi Dokumen',
      subtitle: 'Pratinjau piagam resmi',
    },
  ];

  return (
    <aside className="w-full lg:w-[300px] xl:w-[320px] bg-[#FAFBFD] border-b lg:border-b-0 lg:border-r border-slate-200/80 p-6 sm:p-8 flex flex-col justify-between shrink-0 rounded-t-2xl lg:rounded-tr-none lg:rounded-l-2xl">
      <div>
        {/* Brand identity */}
        <div className="flex items-center space-x-3 mb-6 sm:mb-8">
          <div className="w-9 h-9 rounded-lg bg-[#1E3A8A] flex items-center justify-center text-white font-bold text-xs tracking-wider shadow-xs">
            IKY
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight text-slate-900 leading-none">
              I Know You
            </div>
            <div className="text-[11px] font-medium text-slate-500 mt-1">
              Portal Keluarga Partner
            </div>
          </div>
        </div>

        {/* Section Heading */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight">
            Pendaftaran Partner
          </h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Pendataan keluarga &amp; penerbitan piagam kemitraan STIFIn.
          </p>
        </div>

        {/* Vertical Stepper */}
        <nav aria-label="Tahapan Pendaftaran" className="relative my-2 sm:my-4">
          {/* Hairline guide rule */}
          <div
            aria-hidden="true"
            className="absolute left-[15px] top-3 bottom-4 w-[1px] bg-slate-200"
          />

          <ul className="space-y-6 relative">
            {steps.map((step) => {
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number || isSubmitted;

              return (
                <li
                  key={step.number}
                  className={`flex items-start group select-none transition-colors ${
                    !isSubmitted && step.number < currentStep ? 'cursor-pointer' : ''
                  }`}
                  onClick={() => {
                    if (!isSubmitted && step.number < currentStep) {
                      setStep(step.number);
                    }
                  }}
                >
                  {/* Step Marker: Completed = Navy, Active = Pink, Inactive = Neutral */}
                  <div
                    className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold shrink-0 transition-all ${
                      isActive
                        ? 'bg-[#FF4081] text-white ring-4 ring-pink-100/70 shadow-sm'
                        : isCompleted
                        ? 'bg-[#1E3A8A] text-white'
                        : 'bg-white border border-slate-300 text-slate-400'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    ) : (
                      step.number
                    )}
                  </div>

                  {/* Step Label */}
                  <div className="ml-3.5 pt-0.5">
                    <span
                      className={`block text-xs sm:text-sm font-semibold tracking-tight transition-colors ${
                        isActive
                          ? 'text-slate-900 font-bold'
                          : isCompleted
                          ? 'text-slate-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.title}
                    </span>
                    <span className="block text-[11px] text-slate-500 mt-0.5">
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
      <div className="pt-6 mt-6 border-t border-slate-200/80 text-[11px] text-slate-500">
        <a
          href="https://stifiniknowyou.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-slate-500 hover:text-[#FF4081] transition-colors group"
        >
          <span>Portal Resmi I Know You</span>
          <ArrowUpRight className="w-3 h-3 ml-1 text-slate-400 group-hover:text-[#FF4081] transition-colors" />
        </a>
      </div>
    </aside>
  );
}
