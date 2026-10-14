import React, { useState, useEffect, useRef } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Users, ArrowLeft, ArrowRight, Baby, AlertCircle, ShieldCheck } from 'lucide-react';
import gsap from 'gsap';
import { STIFIN_OPTIONS, GOLONGAN_DARAH_OPTIONS } from '../constants/stifin';
import CustomSelect from './CustomSelect';

export default function StepTwoProfilAnak({ formData, updateFormData, onNext, onPrev }) {
  // Jumlah anak dikunci otomatis sesuai Total Anggota Keluarga di Tahap 1:
  // Total Jiwa = Ayah (1) + Ibu (1) + Anak (N) -> N = Math.max(0, totalJiwa - 2)
  const totalJiwa = Math.max(2, parseInt(formData.jumlah_anggota_keluarga, 10) || 2);
  const fixedJumlahAnak = Math.max(0, totalJiwa - 2);

  const initialAnakList = Array.isArray(formData.anak) && formData.anak.length > 0
    ? formData.anak.slice(0, fixedJumlahAnak)
    : [];

  while (initialAnakList.length < fixedJumlahAnak) {
    initialAnakList.push({ nama: '', stifin: '', golongan_darah: '' });
  }

  const { register, control, setValue, handleSubmit } = useForm({
    defaultValues: {
      jumlah_anak: fixedJumlahAnak,
      anak: initialAnakList,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'anak',
  });

  const [errors, setErrors] = useState({});
  const cardRefs = useRef({});
  const knownIdsRef = useRef(new Set(fields.map((f) => f.id)));
  const isInitialMount = useRef(true);

  // Sinkronisasi otomatis agar jumlah kartu anak selalu sama persis dengan fixedJumlahAnak
  useEffect(() => {
    setValue('jumlah_anak', fixedJumlahAnak);
    const currentCount = fields.length;

    if (fixedJumlahAnak > currentCount) {
      for (let i = currentCount; i < fixedJumlahAnak; i++) {
        const existing = (formData.anak && formData.anak[i]) || { nama: '', stifin: '', golongan_darah: '' };
        append(existing, { shouldFocus: false });
      }
    } else if (fixedJumlahAnak < currentCount) {
      for (let i = currentCount - 1; i >= fixedJumlahAnak; i--) {
        remove(i);
      }
    }

    setErrors((prev) => {
      const next = {};
      for (const [k, v] of Object.entries(prev)) {
        const m = k.match(/^anak_(\d+)_/);
        if (m && parseInt(m[1], 10) < fixedJumlahAnak) {
          next[k] = v;
        }
      }
      return next;
    });
  }, [fixedJumlahAnak, fields.length, append, remove, setValue]);


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

  const onFormSubmit = (data) => {
    const targetCount = fixedJumlahAnak;
    const anakList = Array.isArray(data.anak) ? data.anak : [];
    const newErrors = {};

    if (targetCount > 0) {
      for (let i = 0; i < targetCount; i++) {
        const item = anakList[i] || {};
        if (!item.nama || !item.nama.trim()) {
          newErrors[`anak_${i}_nama`] = `Nama lengkap anak ke-${i + 1} wajib diisi`;
        }
        if (!item.stifin || !item.stifin.trim()) {
          newErrors[`anak_${i}_stifin`] = `Hasil tes STIFIn anak ke-${i + 1} wajib dipilih`;
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      try {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      } catch {
        window.scrollTo(0, 0);
      }
      return;
    }

    setErrors({});
    updateFormData({
      jumlah_anak: targetCount,
      anak: anakList.slice(0, targetCount),
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
          {/* Counter Jumlah Anak (Dikunci otomatis sesuai Total Anggota Tahap 1) */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50/70 border border-slate-200">
            <label className="block text-xs font-semibold text-slate-900 tracking-wide mb-2.5">
              Jumlah Anak dalam Keluarga
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden h-[42px] px-3.5 gap-2 select-none shadow-2xs">
                <Users className="w-4 h-4 text-[#1E3A8A] shrink-0" />
                <span className="text-base font-extrabold text-[#1E3A8A]">
                  {fixedJumlahAnak}
                </span>
                <span className="text-xs font-semibold text-slate-700">Anak</span>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-xs font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>
                  Terkunci otomatis dari Total Anggota ({totalJiwa} Jiwa = Ayah, Ibu{fixedJumlahAnak > 0 ? ` + ${fixedJumlahAnak} Anak` : ''})
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-2">
              {fixedJumlahAnak > 0
                ? `Jumlah formulir (${fixedJumlahAnak} anak) disesuaikan otomatis dari Total Anggota (${totalJiwa} Jiwa). Untuk mengubah jumlah anak, silakan klik tombol "Kembali" ke Tahap 1.`
                : `Total anggota keluarga terdata 2 Jiwa (Ayah & Ibu, tanpa anak). Anda dapat langsung melanjutkan ke tahap pratinjau piagam.`}
            </p>
          </div>

          {/* Validation Banner if children incomplete */}
          {Object.keys(errors).length > 0 && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 shadow-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="font-semibold">
                Mohon lengkapi nama dan hasil STIFIn untuk semua anak.
              </span>
            </div>
          )}


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

                    <span className="text-[11px] text-slate-400 font-medium">
                      Profil {index + 1} dari {fixedJumlahAnak}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1 flex items-center justify-between">
                      <span>
                        Nama Lengkap Anak ke-{index + 1} <span className="text-rose-500">*</span>
                      </span>
                    </label>
                    <input
                      type="text"
                      {...register(`anak.${index}.nama`, {
                        onChange: () => {
                          if (errors[`anak_${index}_nama`]) {
                            setErrors((prev) => {
                              const next = { ...prev };
                              delete next[`anak_${index}_nama`];
                              return next;
                            });
                          }
                        },
                      })}
                      placeholder={`Nama lengkap anak ke-${index + 1}`}
                      className={`block w-full px-3 py-2 text-sm bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                        errors[`anak_${index}_nama`]
                          ? 'border-rose-400 bg-rose-50/20 focus:border-rose-600 focus:ring-1 focus:ring-rose-600'
                          : 'border-slate-300 focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]'
                      }`}
                    />
                    {errors[`anak_${index}_nama`] && (
                      <p className="mt-1 text-xs font-medium text-rose-600 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors[`anak_${index}_nama`]}</span>
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-[1fr_90px] gap-2.5 sm:gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Hasil STIFIn <span className="text-rose-500">*</span>
                      </label>
                      <div
                        className={`rounded-lg transition-all ${
                          errors[`anak_${index}_stifin`] ? 'ring-1 ring-rose-400 rounded-lg' : ''
                        }`}
                      >
                        <CustomSelect
                          id={`child-stifin-${index}`}
                          value={watchedAnak[index]?.stifin || ''}
                          onChange={(val) => {
                            setValue(`anak.${index}.stifin`, val, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });
                            if (errors[`anak_${index}_stifin`]) {
                              setErrors((prev) => {
                                const next = { ...prev };
                                delete next[`anak_${index}_stifin`];
                                return next;
                              });
                            }
                          }}
                          options={STIFIN_OPTIONS}
                          placeholder="Pilih STIFIn"
                        />
                      </div>
                      {errors[`anak_${index}_stifin`] && (
                        <p className="mt-1 text-xs font-medium text-rose-600 flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{errors[`anak_${index}_stifin`]}</span>
                        </p>
                      )}
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
            <div className="py-8 px-4 text-center border border-slate-200 rounded-xl bg-slate-50/70 my-2">
              <Baby className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">Keluarga Tanpa Anak (2 Jiwa: Ayah &amp; Ibu)</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Sesuai pilihan Total Anggota 2 Jiwa di Tahap 1, formulir profil anak tidak diperlukan. Anda dapat langsung melanjutkan ke tahap pratinjau piagam.
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
