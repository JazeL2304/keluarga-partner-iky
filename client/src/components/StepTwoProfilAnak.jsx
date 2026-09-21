import React, { useEffect, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Users, ArrowLeft, ArrowRight, Baby, Trash2 } from 'lucide-react';
import gsap from 'gsap';
import { STIFIN_OPTIONS, GOLONGAN_DARAH_OPTIONS } from '../constants/stifin';
import CustomSelect from './CustomSelect';

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
  const watchedAnak = watch('anak') || [];

  const cardRefs = useRef({});
  const counterNumRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const knownIdsRef = useRef(new Set(fields.map((f) => f.id)));
  const isInitialMount = useRef(true);

  // Sync field count when currentJumlahAnak changes
  useEffect(() => {
    const targetCount = Math.max(0, parseInt(currentJumlahAnak, 10) || 0);
    const currentCount = fields.length;

    if (targetCount > currentCount) {
      for (let i = currentCount; i < targetCount; i++) {
        append({ nama: '', stifin: '', golongan_darah: '' }, { shouldFocus: false });
      }
    } else if (targetCount < currentCount) {
      for (let i = currentCount - 1; i >= targetCount; i--) {
        remove(i);
      }
    }
  }, [currentJumlahAnak, fields.length, append, remove]);

  // Entrance animations for cards (stagger on mount, pop on add)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      const elements = fields.map((f) => cardRefs.current[f.id]).filter(Boolean);
      if (elements.length > 0) {
        gsap.fromTo(
          elements,
          { opacity: 0, y: 16, scale: 0.98 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.35,
            stagger: 0.08,
            ease: 'power2.out',
            clearProps: 'transform',
          }
        );
      }
      return;
    }

    // Detect newly added card
    fields.forEach((field) => {
      if (!knownIdsRef.current.has(field.id)) {
        knownIdsRef.current.add(field.id);
        const el = cardRefs.current[field.id];
        if (el) {
          gsap.fromTo(
            el,
            { opacity: 0, y: 26, scale: 0.95 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.38,
              ease: 'back.out(1.3)',
              clearProps: 'transform',
              onComplete: () => {
                isAnimatingRef.current = false;
              },
            }
          );
        }
      }
    });

    // Clean up removed IDs
    const currentIdSet = new Set(fields.map((f) => f.id));
    knownIdsRef.current.forEach((id) => {
      if (!currentIdSet.has(id)) {
        knownIdsRef.current.delete(id);
      }
    });
  }, [fields]);

  const handleCounterChange = (delta) => {
    if (isAnimatingRef.current) return;
    const currentVal = parseInt(currentJumlahAnak, 10) || 0;

    if (delta > 0) {
      // Adding child
      isAnimatingRef.current = true;
      if (counterNumRef.current) {
        gsap.fromTo(
          counterNumRef.current,
          { scale: 1.45, color: '#FF4081', y: -2 },
          { scale: 1, color: '#1E3A8A', y: 0, duration: 0.3, ease: 'back.out(2)' }
        );
      }
      setValue('jumlah_anak', currentVal + 1);
      setTimeout(() => {
        isAnimatingRef.current = false;
      }, 400);
    } else if (delta < 0 && currentVal > 0) {
      // Subtracting child
      isAnimatingRef.current = true;
      if (counterNumRef.current) {
        gsap.fromTo(
          counterNumRef.current,
          { scale: 0.75, color: '#e11d48', y: 2 },
          { scale: 1, color: '#1E3A8A', y: 0, duration: 0.25, ease: 'power2.out' }
        );
      }

      const lastField = fields[fields.length - 1];
      const lastCardEl = lastField ? cardRefs.current[lastField.id] : null;

      if (lastCardEl) {
        gsap.to(lastCardEl, {
          opacity: 0,
          y: -16,
          scale: 0.94,
          duration: 0.22,
          ease: 'power2.in',
          onComplete: () => {
            setValue('jumlah_anak', currentVal - 1);
            isAnimatingRef.current = false;
          },
        });
      } else {
        setValue('jumlah_anak', currentVal - 1);
        isAnimatingRef.current = false;
      }
    }
  };

  const handleRemoveChild = (index, fieldId) => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    const cardEl = cardRefs.current[fieldId];

    if (counterNumRef.current) {
      gsap.fromTo(
        counterNumRef.current,
        { scale: 0.75, color: '#e11d48', y: 2 },
        { scale: 1, color: '#1E3A8A', y: 0, duration: 0.25, ease: 'power2.out' }
      );
    }

    if (cardEl) {
      gsap.to(cardEl, {
        opacity: 0,
        x: -24,
        scale: 0.94,
        duration: 0.22,
        ease: 'power2.in',
        onComplete: () => {
          remove(index);
          setValue('jumlah_anak', Math.max(0, (parseInt(currentJumlahAnak, 10) || 0) - 1));
          isAnimatingRef.current = false;
        },
      });
    } else {
      remove(index);
      setValue('jumlah_anak', Math.max(0, (parseInt(currentJumlahAnak, 10) || 0) - 1));
      isAnimatingRef.current = false;
    }
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
                  disabled={currentJumlahAnak <= 0}
                  onClick={() => handleCounterChange(-1)}
                  className="w-12 h-full bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-700 font-semibold text-lg transition-all active:scale-90 border-r border-slate-300 flex items-center justify-center select-none cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                  aria-label="Kurangi jumlah anak"
                >
                  −
                </button>
                <div className="flex-1 flex items-center justify-center gap-1.5 text-sm font-bold text-[#1E3A8A] select-none">
                  <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span ref={counterNumRef} className="text-base inline-block font-extrabold">
                    {currentJumlahAnak || 0}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCounterChange(1)}
                  className="w-12 h-full bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-700 font-semibold text-lg transition-all active:scale-90 border-l border-slate-300 flex items-center justify-center select-none cursor-pointer"
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
          {fields.length > 0 ? (
            <div className="space-y-4 pt-1">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Baby className="w-4 h-4 text-[#1E3A8A]" />
                <span>Rincian Profil Anak ({fields.length})</span>
              </div>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  ref={(el) => {
                    if (el) cardRefs.current[field.id] = el;
                    else delete cardRefs.current[field.id];
                  }}
                  className="p-4 sm:p-5 rounded-xl bg-slate-50/70 border border-slate-200 space-y-3.5 transition-all shadow-2xs hover:shadow-xs"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                    <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center text-[10px] font-bold">
                        {index + 1}
                      </span>
                      <span>Anak ke-{index + 1}</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => handleRemoveChild(index, field.id)}
                      className="text-xs text-slate-400 hover:text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 select-none"
                      title={`Hapus Formulir Anak ke-${index + 1}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="font-medium text-[11px]">Hapus</span>
                    </button>
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

                  <div className="grid grid-cols-[1fr_90px] gap-2.5 sm:gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Hasil STIFIn
                      </label>
                      <CustomSelect
                        id={`child-stifin-${index}`}
                        value={watchedAnak[index]?.stifin || ''}
                        onChange={(val) =>
                          setValue(`anak.${index}.stifin`, val, {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                        }
                        options={STIFIN_OPTIONS}
                        placeholder="Pilih STIFIn"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Gol. Darah
                      </label>
                      <CustomSelect
                        id={`child-blood-${index}`}
                        value={watchedAnak[index]?.golongan_darah || ''}
                        onChange={(val) =>
                          setValue(`anak.${index}.golongan_darah`, val, {
                            shouldValidate: true,
                            shouldDirty: true,
                          })
                        }
                        options={GOLONGAN_DARAH_OPTIONS}
                        placeholder="Pilih"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 px-4 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 my-2">
              <Baby className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-700">Belum ada anak dalam daftar</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Gunakan tombol <span className="font-bold text-[#1E3A8A] px-1.5 py-0.5 rounded bg-white border border-slate-200">+</span> di atas untuk menambahkan formulir data anak.
              </p>
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
