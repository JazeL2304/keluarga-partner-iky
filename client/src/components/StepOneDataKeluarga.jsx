import React, { useState } from 'react';
import { User, Building2, ArrowRight, AlertCircle, UserCircle2, MessageSquareQuote } from 'lucide-react';
import { STIFIN_OPTIONS, GOLONGAN_DARAH_OPTIONS } from '../constants/stifin';
import CustomSelect from './CustomSelect';

export default function StepOneDataKeluarga({ formData, updateFormData, onNext }) {
  const {
    pribadi_instansi,
    nama_instansi_custom,
    nama_keluarga,
    nama_ayah,
    stifin_ayah,
    golongan_darah_ayah,
    nama_ibu,
    stifin_ibu,
    golongan_darah_ibu,
    kesan_pesan,
  } = formData;

  const [errors, setErrors] = useState({});
  const isInstansi = pribadi_instansi === 'Instansi';

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!nama_keluarga || !nama_keluarga.trim()) {
      newErrors.nama_keluarga = 'Nama Keluarga wajib diisi untuk dicetak pada piagam penghargaan';
    }
    if (isInstansi && (!nama_instansi_custom || !nama_instansi_custom.trim())) {
      newErrors.nama_instansi_custom = 'Nama Instansi / Lembaga wajib diisi untuk pendaftaran instansi';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onNext();
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        {/* Step Header */}
        <header className="mb-6 pb-4 border-b border-slate-200/80">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#FF4081] block mb-1">
            Tahap 1 dari 3
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Well Identified Family
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
            Formulir kemitraan keluarga partner IKY &amp; profil genetika STIFIn orang tua.
          </p>
        </header>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Section 1: Kategori Pendaftaran dengan Animasi Slider */}
          <div>
            <label className="block text-xs font-semibold text-slate-900 tracking-wide mb-2">
              Jalur Pendaftaran <span className="text-rose-500">*</span>
            </label>

            {/* Smooth Animated Segmented Control Track */}
            <div className="relative p-1 bg-slate-100 rounded-xl border border-slate-200 max-w-sm flex items-center select-none shadow-2xs">
              {/* Sliding Background Active Pill Indicator */}
              <div
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#1E3A8A] rounded-lg shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  !isInstansi ? 'left-1' : 'left-[calc(50%+2px)]'
                }`}
              />

              {/* Option 1: Pribadi */}
              <button
                type="button"
                onClick={() => {
                  updateFormData({ pribadi_instansi: 'Pribadi', nama_instansi_custom: '' });
                  if (errors.nama_instansi_custom) {
                    setErrors((prev) => ({ ...prev, nama_instansi_custom: null }));
                  }
                }}
                className={`relative z-10 flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer active:scale-[0.97] ${
                  !isInstansi ? 'text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className={`w-4 h-4 transition-transform duration-200 ${!isInstansi ? 'scale-105' : ''}`} />
                <span>Pribadi / Keluarga</span>
              </button>

              {/* Option 2: Instansi */}
              <button
                type="button"
                onClick={() => updateFormData({ pribadi_instansi: 'Instansi' })}
                className={`relative z-10 flex-1 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer active:scale-[0.97] ${
                  isInstansi ? 'text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className={`w-4 h-4 transition-transform duration-200 ${isInstansi ? 'scale-105' : ''}`} />
                <span>Instansi / Lembaga</span>
              </button>
            </div>

            {/* Input Nama Instansi jika memilih Instansi dengan Smooth Expand */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-out ${
                isInstansi ? 'max-h-36 opacity-100 mt-3.5' : 'max-h-0 opacity-0 mt-0 pointer-events-none'
              }`}
            >
              <div className="max-w-md">
                <label htmlFor="instansi-name" className="block text-xs font-medium text-slate-700 mb-1.5">
                  Nama Lembaga / Yayasan <span className="text-rose-500">*</span>
                </label>
                <input
                  id="instansi-name"
                  type="text"
                  value={nama_instansi_custom || ''}
                  onChange={(e) => {
                    updateFormData({ nama_instansi_custom: e.target.value });
                    if (errors.nama_instansi_custom) {
                      setErrors((prev) => ({ ...prev, nama_instansi_custom: null }));
                    }
                  }}
                  placeholder="Contoh: Yayasan Mutiara Bangsa / STIFIn Jakarta"
                  className={`block w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                    errors.nama_instansi_custom
                      ? 'border-rose-400 bg-rose-50/20 focus:border-rose-600 focus:ring-1 focus:ring-rose-600'
                      : 'border-slate-300 focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]'
                  }`}
                />
                {errors.nama_instansi_custom && (
                  <p className="mt-1.5 text-xs font-medium text-rose-600 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.nama_instansi_custom}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Nama Keluarga Partner IKY (Dicetak di Piagam) */}
          <div>
            <label htmlFor="family-name" className="block text-xs font-semibold text-slate-900 tracking-wide mb-1.5">
              Nama Keluarga Partner IKY <span className="text-rose-500">*</span>
            </label>
            <input
              id="family-name"
              type="text"
              value={nama_keluarga}
              onChange={(e) => {
                updateFormData({ nama_keluarga: e.target.value });
                if (errors.nama_keluarga) {
                  setErrors((prev) => ({ ...prev, nama_keluarga: null }));
                }
              }}
              placeholder="Contoh: Keluarga Hendra Pratama"
              className={`block w-full max-w-xl px-3.5 py-2.5 text-sm bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                errors.nama_keluarga
                  ? 'border-rose-400 bg-rose-50/20 focus:border-rose-600 focus:ring-1 focus:ring-rose-600'
                  : 'border-slate-300 focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]'
              }`}
            />
            {errors.nama_keluarga ? (
              <p className="mt-1.5 text-xs font-medium text-rose-600 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.nama_keluarga}</span>
              </p>
            ) : (
              <span className="block text-[11px] text-slate-500 mt-1">
                Nama ini yang akan dicetak di piagam resmi Well Identified Family dengan akhiran <strong className="font-semibold text-slate-700">FAMILY</strong>.
              </span>
            )}
          </div>

          {/* Profil Orang Tua - Grid 2 Kolom Rapi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 pt-1 mb-6">
            {/* Profil Ayah */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50/70 border border-slate-200">
              <div className="flex items-center gap-2 pb-3 mb-3.5 border-b border-slate-200/80">
                <UserCircle2 className="w-4 h-4 text-[#1E3A8A]" />
                <span className="text-sm font-bold text-slate-900">Profil Ayah</span>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label htmlFor="father-name" className="block text-xs font-medium text-slate-600 mb-1">
                    Nama Lengkap Ayah
                  </label>
                  <input
                    id="father-name"
                    type="text"
                    value={nama_ayah || ''}
                    onChange={(e) => updateFormData({ nama_ayah: e.target.value })}
                    placeholder="Nama lengkap Ayah"
                    className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] transition-all"
                  />
                </div>

                <div className="grid grid-cols-[1fr_90px] gap-2.5 sm:gap-3">
                  <div>
                    <label htmlFor="father-stifin" className="block text-xs font-medium text-slate-600 mb-1">
                      Hasil STIFIn
                    </label>
                    <CustomSelect
                      id="father-stifin"
                      value={stifin_ayah || ''}
                      onChange={(val) => updateFormData({ stifin_ayah: val })}
                      options={STIFIN_OPTIONS}
                      placeholder="Pilih STIFIn"
                    />
                  </div>

                  <div>
                    <label htmlFor="father-blood" className="block text-xs font-medium text-slate-600 mb-1">
                      Gol. Darah
                    </label>
                    <CustomSelect
                      id="father-blood"
                      value={golongan_darah_ayah || ''}
                      onChange={(val) => updateFormData({ golongan_darah_ayah: val })}
                      options={GOLONGAN_DARAH_OPTIONS}
                      placeholder="Pilih"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Profil Ibu */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-50/70 border border-slate-200">
              <div className="flex items-center gap-2 pb-3 mb-3.5 border-b border-slate-200/80">
                <UserCircle2 className="w-4 h-4 text-[#FF4081]" />
                <span className="text-sm font-bold text-slate-900">Profil Ibu</span>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label htmlFor="mother-name" className="block text-xs font-medium text-slate-600 mb-1">
                    Nama Lengkap Ibu
                  </label>
                  <input
                    id="mother-name"
                    type="text"
                    value={nama_ibu || ''}
                    onChange={(e) => updateFormData({ nama_ibu: e.target.value })}
                    placeholder="Nama lengkap Ibu"
                    className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] transition-all"
                  />
                </div>

                <div className="grid grid-cols-[1fr_90px] gap-2.5 sm:gap-3">
                  <div>
                    <label htmlFor="mother-stifin" className="block text-xs font-medium text-slate-600 mb-1">
                      Hasil STIFIn
                    </label>
                    <CustomSelect
                      id="mother-stifin"
                      value={stifin_ibu || ''}
                      onChange={(val) => updateFormData({ stifin_ibu: val })}
                      options={STIFIN_OPTIONS}
                      placeholder="Pilih STIFIn"
                    />
                  </div>

                  <div>
                    <label htmlFor="mother-blood" className="block text-xs font-medium text-slate-600 mb-1">
                      Gol. Darah
                    </label>
                    <CustomSelect
                      id="mother-blood"
                      value={golongan_darah_ibu || ''}
                      onChange={(val) => updateFormData({ golongan_darah_ibu: val })}
                      options={GOLONGAN_DARAH_OPTIONS}
                      placeholder="Pilih"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Feedback / Kesan & Pesan Kemitraan (Di Bawah Profil Genetika Orang Tua) */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50/70 border border-slate-200">
            <div className="flex items-center gap-2 pb-3 mb-3.5 border-b border-slate-200/80">
              <MessageSquareQuote className="w-4 h-4 text-[#1E3A8A]" />
              <div>
                <span className="text-sm font-bold text-slate-900 block leading-tight">
                  Kesan &amp; Pesan Kemitraan (Feedback)
                </span>
                <span className="text-[11px] text-slate-500">
                  Kuesioner kemitraan keluarga partner IKY
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="kesan-pesan" className="block text-xs font-medium text-slate-600 mb-1.5">
                Kesan &amp; Pesan untuk I Know You
              </label>
              <textarea
                id="kesan-pesan"
                rows={3}
                value={kesan_pesan || ''}
                onChange={(e) => updateFormData({ kesan_pesan: e.target.value })}
                placeholder="Bagikan kesan, pesan, atau pengalaman Anda setelah mengenali fitrah genetik STIFIn keluarga..."
                className="block w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A] transition-all resize-y"
              />
              <span className="block text-[11px] text-slate-400 mt-1">
                Masukan Anda sangat berharga bagi peningkatan layanan edukasi &amp; tes STIFIn I Know You.
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-6 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3 rounded-lg bg-[#FF4081] hover:bg-[#E02868] text-white font-medium text-sm transition-all shadow-xs active:scale-[0.99] cursor-pointer"
            >
              <span>Lanjutkan ke Profil Genetika Anak</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
