import React from 'react';
import { Mail, ChevronDown, ArrowLeft, ArrowRight } from 'lucide-react';

export default function StepTwoKontakDomisili({ formData, updateFormData, onNext, onPrev }) {
  const { kontak_wa, kontak_email, alamat, provinsi, kota } = formData;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!kontak_wa || !kontak_wa.trim()) {
      alert('Silakan masukkan Nomor WhatsApp / HP');
      return;
    }
    if (!kontak_email || !kontak_email.trim()) {
      alert('Silakan masukkan Alamat Email Aktif');
      return;
    }
    if (!alamat || !alamat.trim()) {
      alert('Silakan masukkan Alamat Lengkap Domisili');
      return;
    }
    onNext();
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div>
        {/* Step Header */}
        <header className="mb-8">
          <div className="text-xs font-semibold text-[#FF4081] uppercase tracking-wider mb-1.5">
            Langkah 2 • Saluran Komunikasi
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Informasi Kontak &amp; Domisili
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
            Tautan berkas sertifikat digital dan arsip kemitraan akan dikirimkan ke kontak terdaftar.
          </p>
        </header>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Grid: WhatsApp & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Field: WhatsApp */}
            <div>
              <label htmlFor="whatsapp_number" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Nomor WhatsApp <span className="text-[#FF4081]">*</span>
              </label>
              <div className="flex rounded-lg border border-slate-300 bg-white overflow-hidden focus-within:border-[#FF4081] focus-within:ring-1 focus-within:ring-[#FF4081] transition-colors">
                <span className="inline-flex items-center px-3.5 border-r border-slate-200 bg-slate-50 text-slate-600 text-xs font-semibold select-none">
                  +62
                </span>
                <input
                  id="whatsapp_number"
                  type="tel"
                  required
                  value={kontak_wa}
                  onChange={(e) => updateFormData({ kontak_wa: e.target.value })}
                  placeholder="812-3456-7890"
                  className="flex-1 block w-full px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 border-0 focus:ring-0 focus:outline-none"
                />
              </div>
            </div>

            {/* Field: Email */}
            <div>
              <label htmlFor="email_address" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Alamat Email <span className="text-[#FF4081]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email_address"
                  type="email"
                  required
                  value={kontak_email}
                  onChange={(e) => updateFormData({ kontak_email: e.target.value })}
                  placeholder="hendra.pratama@email.com"
                  className="block w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#FF4081] focus:ring-1 focus:ring-[#FF4081] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Field: Alamat Lengkap Domisili */}
          <div>
            <label htmlFor="domicile_address" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
              Alamat Lengkap Domisili <span className="text-[#FF4081]">*</span>
            </label>
            <textarea
              id="domicile_address"
              rows={3}
              required
              value={alamat}
              onChange={(e) => updateFormData({ alamat: e.target.value })}
              placeholder="Contoh: Jl. Melati Raya No. 45, RT 03 / RW 07, Kel. Sukamaju, Kec. Cilodong"
              className="block w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#FF4081] focus:ring-1 focus:ring-[#FF4081] transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* Grid: Provinsi & Kota / Kabupaten */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="province_select" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Provinsi <span className="text-[#FF4081]">*</span>
              </label>
              <div className="relative">
                <select
                  id="province_select"
                  value={provinsi}
                  onChange={(e) => updateFormData({ provinsi: e.target.value })}
                  className="block w-full appearance-none bg-white border border-slate-300 rounded-lg py-2.5 pl-3.5 pr-10 text-sm text-slate-900 font-medium focus:outline-none focus:border-[#FF4081] focus:ring-1 focus:ring-[#FF4081] transition-colors"
                >
                  <option value="Jawa Barat">Jawa Barat</option>
                  <option value="DKI Jakarta">DKI Jakarta</option>
                  <option value="Banten">Banten</option>
                  <option value="Jawa Tengah">Jawa Tengah</option>
                  <option value="D.I. Yogyakarta">D.I. Yogyakarta</option>
                  <option value="Jawa Timur">Jawa Timur</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="city_select" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Kota / Kabupaten <span className="text-[#FF4081]">*</span>
              </label>
              <div className="relative">
                <select
                  id="city_select"
                  value={kota}
                  onChange={(e) => updateFormData({ kota: e.target.value })}
                  className="block w-full appearance-none bg-white border border-slate-300 rounded-lg py-2.5 pl-3.5 pr-10 text-sm text-slate-900 font-medium focus:outline-none focus:border-[#FF4081] focus:ring-1 focus:ring-[#FF4081] transition-colors"
                >
                  <option value="Kota Depok">Kota Depok</option>
                  <option value="Kota Bogor">Kota Bogor</option>
                  <option value="Kabupaten Bogor">Kabupaten Bogor</option>
                  <option value="Kota Bekasi">Kota Bekasi</option>
                  <option value="Kota Bandung">Kota Bandung</option>
                  <option value="Jakarta Selatan">Jakarta Selatan</option>
                  <option value="Jakarta Timur">Jakarta Timur</option>
                  <option value="Tangerang Selatan">Tangerang Selatan</option>
                  <option value="Kota Lainnya">Kota Lainnya</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-6 border-t border-slate-200 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
            <button
              type="button"
              onClick={onPrev}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>Kembali</span>
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-[#FF4081] hover:bg-[#E02868] text-white font-medium text-sm transition-all shadow-sm active:scale-[0.99]"
            >
              <span>Lanjutkan ke Konfirmasi</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
