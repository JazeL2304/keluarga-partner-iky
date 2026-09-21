import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Users, ChevronDown, ArrowLeft, ArrowRight, Baby } from 'lucide-react';
import { STIFIN_OPTIONS, GOLONGAN_DARAH_OPTIONS } from '../constants/stifin';

export default function StepTwoProfilAnak({ formData, updateFormData, onNext, onPrev }) {
  const initialJumlahAnak = Math.max(0, formData.jumlah_anak || 0);
  const initialAnakList = Array.isArray(formData.anak) && formData.anak.length > 0
    ? formData.anak
    : Array.from({ length: initialJumlahAnak }, () => ({ nama: '', stifin: '', golongan_darah: '' }));

  const { register, control, watch, setValue, handleSubmit } = useForm({
    defaultValues: {
      jumlah_anak: initialJumlahAnak,
      anak: initialAnakList,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'anak',
  });

  const currentJumlahAnak = watch('jumlah_anak');

  useEffect(() => {
    const targetCount = Math.max(0, parseInt(currentJumlahAnak, 10) || 0);
    const currentCount = fields.length;

    if (targetCount > currentCount) {
      for (let i = currentCount; i < targetCount; i++) {
        append({ nama: '', stifin: '', golongan_darah: '' });
      }
    } else if (targetCount < currentCount) {
      for (let i = currentCount - 1; i >= targetCount; i--) {
        remove(i);
      }
    }
  }, [currentJumlahAnak, fields.length, append, remove]);

  const handleCounterChange = (delta) => {
    const nextVal = Math.max(0, (parseInt(currentJumlahAnak, 10) || 0) + delta);
    setValue('jumlah_anak', nextVal);
  };

  const onFormSubmit = (data) => {
    updateFormData({
      jumlah_anak: parseInt(data.jumlah_anak, 10) || 0,
      anak: data.anak || [],
    });
    onNext();
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        {/* Step Header */}
        <header className="mb-6 pb-4 border-b border-slate-200/80">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#FF4081] block mb-1">
            Tahap 2 dari 3
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Profil Genetika Anak
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
            Tentukan jumlah anak dalam keluarga dan lengkapi data profil tes STIFIn masing-masing.
          </p>
        </header>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
          {/* Counter Jumlah Anak */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50/70 border border-slate-200">
            <label className="block text-xs font-semibold text-slate-900 tracking-wide mb-2.5">
              Jumlah Anak dalam Keluarga
            </label>
            <div className="flex flex-wrap items-center gap-3.5">
              <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden h-[42px] w-44 shadow-xs">
                <button
                  type="button"
                  onClick={() => handleCounterChange(-1)}
                  className="w-12 h-full bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-700 font-semibold text-lg transition-colors border-r border-slate-300 flex items-center justify-center select-none cursor-pointer"
                  aria-label="Kurangi jumlah anak"
                >
                  −
                </button>
                <div className="flex-1 flex items-center justify-center gap-1.5 text-sm font-bold text-[#1E3A8A]">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-base">{currentJumlahAnak || 0}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCounterChange(1)}
                  className="w-12 h-full bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-700 font-semibold text-lg transition-colors border-l border-slate-300 flex items-center justify-center select-none cursor-pointer"
                  aria-label="Tambah jumlah anak"
                >
                  +
                </button>
              </div>

              <span className="text-xs text-slate-500">
                {currentJumlahAnak > 0
                  ? `${currentJumlahAnak} formulir anak ditampilkan di bawah`
                  : 'Pilih 0 jika belum memiliki anak'}
              </span>
            </div>
          </div>

          {/* Dynamic Fieldset Anak */}
          {fields.length > 0 && (
            <div className="space-y-4 pt-1">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Baby className="w-4 h-4 text-[#1E3A8A]" />
                <span>Rincian Profil Anak ({fields.length})</span>
              </div>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 sm:p-5 rounded-xl bg-slate-50/70 border border-slate-200 space-y-3.5 transition-all"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                    <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center text-[10px] font-bold">
                        {index + 1}
                      </span>
                      <span>Anak ke-{index + 1}</span>
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Nama Lengkap Anak ke-{index + 1}
                    </label>
                    <input
                      type="text"
                      {...register(`anak.${index}.nama`)}
                      placeholder={`Nama lengkap anak ke-${index + 1}`}
                      className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Hasil STIFIn
                      </label>
                      <div className="relative">
                        <select
                          {...register(`anak.${index}.stifin`)}
                          className="block w-full appearance-none bg-white border border-slate-300 rounded-lg py-2 pl-3 pr-8 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] transition-all"
                        >
                          <option value="">Pilih Hasil STIFIn</option>
                          {STIFIN_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                          <ChevronDown className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Gol. Darah
                      </label>
                      <div className="relative">
                        <select
                          {...register(`anak.${index}.golongan_darah`)}
                          className="block w-full appearance-none bg-white border border-slate-300 rounded-lg py-2 pl-3 pr-8 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] transition-all"
                        >
                          <option value="">Pilih Gol. Darah</option>
                          {GOLONGAN_DARAH_OPTIONS.map((bg) => (
                            <option key={bg} value={bg}>{bg}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                          <ChevronDown className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onPrev}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 font-medium text-sm transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>Kembali</span>
            </button>

            <button
              type="submit"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-[#FF4081] hover:bg-[#E02868] text-white font-medium text-sm transition-all shadow-xs active:scale-[0.99] cursor-pointer"
            >
              <span>Lanjut ke Pratinjau Piagam</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
