import React, { useState } from 'react';
import { User, Building2, ChevronDown, ArrowRight, AlertCircle } from 'lucide-react';
import { STIFIN_OPTIONS, GOLONGAN_DARAH_OPTIONS } from '../constants/stifin';

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
        {/* Step Header with Editorial Serif */}
        <header className="mb-7 pb-4 border-b border-[#EAE3D7]">
          <span className="text-xs font-serif italic text-[#C4A36B] tracking-wider block mb-1">
            Tahap I dari III
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F1A1B] tracking-tight">
            Profil Kemitraan &amp; Genetika Orang Tua
          </h1>
          <p className="text-xs sm:text-sm text-[#8A827E] mt-1.5 max-w-xl leading-relaxed">
            Lengkapi data kemitraan keluarga dan profil tes genetik STIFIn untuk penerbitan piagam resmi.
          </p>
        </header>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Kategori Pendaftaran */}
          <div>
            <label className="block text-xs font-semibold text-[#1F1A1B] tracking-wide mb-2">
              Jalur Pendaftaran <span className="text-[#952230]">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3 max-w-sm">
              <button
                type="button"
                onClick={() => {
                  updateFormData({ pribadi_instansi: 'Pribadi', nama_instansi_custom: '' });
                  if (errors.nama_instansi_custom) {
                    setErrors((prev) => ({ ...prev, nama_instansi_custom: null }));
                  }
                }}
                className={`py-2.5 px-4 rounded-lg border text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  !isInstansi
                    ? 'border-[#58121A] bg-[#58121A] text-[#FAF8F5] font-semibold shadow-warm-sm'
                    : 'border-[#EAE3D7] bg-[#FAF8F5] text-[#675F5B] hover:border-[#C4A36B] hover:bg-white'
                }`}
              >
                <User className={`w-4 h-4 ${!isInstansi ? 'text-[#C4A36B]' : 'text-[#8A827E]'}`} />
                <span>Pribadi / Keluarga</span>
              </button>

              <button
                type="button"
                onClick={() => updateFormData({ pribadi_instansi: 'Instansi' })}
                className={`py-2.5 px-4 rounded-lg border text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isInstansi
                    ? 'border-[#58121A] bg-[#58121A] text-[#FAF8F5] font-semibold shadow-warm-sm'
                    : 'border-[#EAE3D7] bg-[#FAF8F5] text-[#675F5B] hover:border-[#C4A36B] hover:bg-white'
                }`}
              >
                <Building2 className={`w-4 h-4 ${isInstansi ? 'text-[#C4A36B]' : 'text-[#8A827E]'}`} />
                <span>Instansi / Lembaga</span>
              </button>
            </div>

            {/* Input Nama Instansi jika memilih Instansi */}
            {isInstansi && (
              <div className="mt-3.5 max-w-md animate-fadeIn">
                <label htmlFor="instansi-name" className="block text-xs font-medium text-[#675F5B] mb-1.5">
                  Nama Lembaga / Yayasan <span className="text-[#952230]">*</span>
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
                  placeholder="Contoh: Yayasan Mutiara Bangsa"
                  className={`block w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg text-[#1F1A1B] placeholder-[#B5AEAB] focus:outline-none transition-all ${
                    errors.nama_instansi_custom
                      ? 'border-rose-400 bg-rose-50/20 focus:border-rose-600 focus:ring-1 focus:ring-rose-600'
                      : 'border-[#DED6CA] focus:border-[#58121A] focus:ring-1 focus:ring-[#58121A]'
                  }`}
                />
                {errors.nama_instansi_custom && (
                  <p className="mt-1.5 text-xs font-medium text-rose-700 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.nama_instansi_custom}</span>
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Section 2: Nama Keluarga (Dicetak di Sertifikat) */}
          <div className="pt-1">
            <label htmlFor="family-name" className="block text-xs font-semibold text-[#1F1A1B] tracking-wide mb-1.5">
              Nama Keluarga yang Dicetak pada Piagam <span className="text-[#952230]">*</span>
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
              className={`block w-full max-w-xl px-3.5 py-2.5 text-sm bg-white border rounded-lg text-[#1F1A1B] placeholder-[#B5AEAB] focus:outline-none transition-all ${
                errors.nama_keluarga
                  ? 'border-rose-400 bg-rose-50/20 focus:border-rose-600 focus:ring-1 focus:ring-rose-600'
                  : 'border-[#DED6CA] focus:border-[#58121A] focus:ring-1 focus:ring-[#58121A]'
              }`}
            />
            {errors.nama_keluarga ? (
              <p className="mt-1.5 text-xs font-medium text-rose-700 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.nama_keluarga}</span>
              </p>
            ) : (
              <span className="block text-[11px] text-[#8A827E] mt-1.5">
                Nama ini yang akan dicetak di panel utama piagam resmi dengan akhiran <strong className="font-semibold text-[#58121A]">FAMILY</strong>.
              </span>
            )}
          </div>

          {/* Profil Orang Tua - Grid 2 Kolom Elegan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 pt-2">
            {/* Profil Ayah */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D7] shadow-warm-sm">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#EAE3D7]">
                <span className="font-serif text-base font-bold text-[#58121A] tracking-tight">
                  Profil Ayah
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#C4A36B] font-semibold bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#C4A36B]/30">
                  Kepala Keluarga
                </span>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label htmlFor="father-name" className="block text-xs font-medium text-[#675F5B] mb-1">
                    Nama Lengkap Ayah
                  </label>
                  <input
                    id="father-name"
                    type="text"
                    value={nama_ayah || ''}
                    onChange={(e) => updateFormData({ nama_ayah: e.target.value })}
                    placeholder="Nama lengkap Ayah"
                    className="block w-full px-3 py-2 text-sm bg-white border border-[#DED6CA] rounded-lg text-[#1F1A1B] placeholder-[#B5AEAB] focus:outline-none focus:border-[#58121A] focus:ring-1 focus:ring-[#58121A] transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="father-stifin" className="block text-xs font-medium text-[#675F5B] mb-1">
                      Hasil STIFIn
                    </label>
                    <div className="relative">
                      <select
                        id="father-stifin"
                        value={stifin_ayah || ''}
                        onChange={(e) => updateFormData({ stifin_ayah: e.target.value })}
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
                    <label htmlFor="father-blood" className="block text-xs font-medium text-[#675F5B] mb-1">
                      Gol. Darah
                    </label>
                    <div className="relative">
                      <select
                        id="father-blood"
                        value={golongan_darah_ayah || ''}
                        onChange={(e) => updateFormData({ golongan_darah_ayah: e.target.value })}
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
            </div>

            {/* Profil Ibu */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D7] shadow-warm-sm">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#EAE3D7]">
                <span className="font-serif text-base font-bold text-[#58121A] tracking-tight">
                  Profil Ibu
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#C4A36B] font-semibold bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#C4A36B]/30">
                  Ibu Keluarga
                </span>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label htmlFor="mother-name" className="block text-xs font-medium text-[#675F5B] mb-1">
                    Nama Lengkap Ibu
                  </label>
                  <input
                    id="mother-name"
                    type="text"
                    value={nama_ibu || ''}
                    onChange={(e) => updateFormData({ nama_ibu: e.target.value })}
                    placeholder="Nama lengkap Ibu"
                    className="block w-full px-3 py-2 text-sm bg-white border border-[#DED6CA] rounded-lg text-[#1F1A1B] placeholder-[#B5AEAB] focus:outline-none focus:border-[#58121A] focus:ring-1 focus:ring-[#58121A] transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="mother-stifin" className="block text-xs font-medium text-[#675F5B] mb-1">
                      Hasil STIFIn
                    </label>
                    <div className="relative">
                      <select
                        id="mother-stifin"
                        value={stifin_ibu || ''}
                        onChange={(e) => updateFormData({ stifin_ibu: e.target.value })}
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
                    <label htmlFor="mother-blood" className="block text-xs font-medium text-[#675F5B] mb-1">
                      Gol. Darah
                    </label>
                    <div className="relative">
                      <select
                        id="mother-blood"
                        value={golongan_darah_ibu || ''}
                        onChange={(e) => updateFormData({ golongan_darah_ibu: e.target.value })}
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
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-6 border-t border-[#EAE3D7] flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3 rounded-lg bg-[#58121A] hover:bg-[#420D13] text-[#FAF8F5] font-medium text-sm transition-all shadow-warm active:scale-[0.99] cursor-pointer"
            >
              <span>Lanjutkan ke Profil Genetika Anak</span>
              <ArrowRight className="w-4 h-4 ml-2 text-[#C4A36B]" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
