import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Users, ChevronDown, ArrowLeft, ArrowRight } from 'lucide-react';
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
        <header className="mb-7 pb-4 border-b border-[#EAE3D7]">
          <span className="text-xs font-serif italic text-[#C4A36B] tracking-wider block mb-1">
            Tahap II dari III
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1A1B] tracking-tight">
            Profil Genetika Anak
          </h1>
          <p className="text-xs sm:text-sm text-[#8A827E] mt-1.5 max-w-xl leading-relaxed">
            Tentukan jumlah anak dalam keluarga dan lengkapi hasil tes STIFIn masing-masing.
          </p>
        </header>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
          {/* Counter Jumlah Anak */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D7] shadow-warm-sm">
            <label className="block text-xs font-semibold text-[#1F1A1B] tracking-wide mb-2.5">
              Jumlah Anak dalam Keluarga
            </label>
            <div className="flex flex-wrap items-center gap-3.5">
              <div className="flex items-center border border-[#DED6CA] rounded-lg bg-white overflow-hidden h-[42px] w-44 shadow-warm-sm">
                <button
                  type="button"
                  onClick={() => handleCounterChange(-1)}
                  className="w-12 h-full bg-[#FAF8F5] hover:bg-[#F3EFE7] active:bg-[#EAE3D7] text-[#1F1A1B] font-semibold text-lg transition-colors border-r border-[#DED6CA] flex items-center justify-center select-none cursor-pointer"
                  aria-label="Kurangi jumlah anak"
                >
                  −
                </button>
                <div className="flex-1 flex items-center justify-center gap-1.5 text-sm font-serif font-bold text-[#58121A]">
                  <Users className="w-3.5 h-3.5 text-[#C4A36B]" />
                  <span className="text-base">{currentJumlahAnak || 0}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCounterChange(1)}
                  className="w-12 h-full bg-[#FAF8F5] hover:bg-[#F3EFE7] active:bg-[#EAE3D7] text-[#1F1A1B] font-semibold text-lg transition-colors border-l border-[#DED6CA] flex items-center justify-center select-none cursor-pointer"
                  aria-label="Tambah jumlah anak"
                >
                  +
                </button>
              </div>

              <span className="text-xs text-[#8A827E]">
                {currentJumlahAnak > 0
                  ? `${currentJumlahAnak} formulir anak ditampilkan di bawah`
                  : 'Pilih 0 jika belum memiliki anak'}
              </span>
            </div>
          </div>

          {/* Dynamic Fieldset Anak */}
          {fields.length > 0 && (
            <div className="space-y-4 pt-1">
              <div className="text-xs font-serif font-bold uppercase tracking-wider text-[#58121A] flex items-center gap-2">
                <span>Rincian Profil Masing-Masing Anak ({fields.length})</span>
              </div>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 sm:p-5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D7] space-y-3.5 shadow-warm-sm transition-all animate-fadeIn"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#EAE3D7]">
                    <span className="font-serif text-sm font-bold text-[#58121A] flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#58121A] text-[#FAF8F5] flex items-center justify-center text-[10px] font-sans font-bold">
                        {index + 1}
                      </span>
                      <span>Anak ke-{index + 1}</span>
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#675F5B] mb-1">
                      Nama Lengkap Anak ke-{index + 1}
                    </label>
                    <input
                      type="text"
                      {...register(`anak.${index}.nama`)}
                      placeholder={`Nama lengkap anak ke-${index + 1}`}
                      className="block w-full px-3 py-2 text-sm bg-white border border-[#DED6CA] rounded-lg text-[#1F1A1B] placeholder-[#B5AEAB] focus:outline-none focus:border-[#58121A] focus:ring-1 focus:ring-[#58121A] transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#675F5B] mb-1">
                        Hasil Tes STIFIn
                      </label>
                      <div className="relative">
                        <select
                          {...register(`anak.${index}.stifin`)}
                          className="block w-full appearance-none bg-white border border-[#DED6CA] rounded-lg py-2 pl-3 pr-8 text-xs sm:text-sm text-[#1F1A1B] font-medium focus:outline-none focus:border-[#58121A] focus:ring-1 focus:ring-[#58121A] transition-all"
                        >
                          <option value="">Pilih STIFIn</option>
                          {STIFIN_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[#8A827E]">
                          <ChevronDown className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#675F5B] mb-1">
                        Golongan Darah
                      </label>
                      <div className="relative">
                        <select
                          {...register(`anak.${index}.golongan_darah`)}
                          className="block w-full appearance-none bg-white border border-[#DED6CA] rounded-lg py-2 pl-3 pr-8 text-xs sm:text-sm text-[#1F1A1B] font-medium focus:outline-none focus:border-[#58121A] focus:ring-1 focus:ring-[#58121A] transition-all"
                        >
                          <option value="">Pilih</option>
                          {GOLONGAN_DARAH_OPTIONS.map((bg) => (
                            <option key={bg} value={bg}>{bg}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[#8A827E]">
                          <ChevronDown className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action Row */}
          <div className="pt-6 border-t border-[#EAE3D7] flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
            <button
              type="button"
              onClick={onPrev}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-[#DED6CA] bg-white hover:bg-[#FAF8F5] text-[#675F5B] font-medium text-xs sm:text-sm transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>Kembali</span>
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center px-7 py-3 rounded-lg bg-[#58121A] hover:bg-[#420D13] text-[#FAF8F5] font-medium text-sm transition-all shadow-warm active:scale-[0.99] cursor-pointer"
            >
              <span>Lanjutkan ke Pratinjau Dokumen</span>
              <ArrowRight className="w-4 h-4 ml-2 text-[#C4A36B]" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
