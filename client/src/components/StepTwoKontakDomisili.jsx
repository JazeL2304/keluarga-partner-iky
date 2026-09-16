import React from 'react';
import { Mail, Shield, ArrowLeft, ArrowRight } from 'lucide-react';

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
    <div className="flex-1 flex flex-col justify-between step-content">
      <div>
        {/* Top Horizontal Progress Bar */}
        <header className="mb-6 sm:mb-8">
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-4 sm:mb-6">
            <div className="bg-brand-pink h-full rounded-full w-2/3 transition-all duration-500 ease-out" />
          </div>

          <div className="inline-block px-2.5 py-1 rounded-full bg-pink-50 text-brand-pink font-bold text-[11px] tracking-wider uppercase mb-2 border border-pink-100">
            Langkah 2 Dari 3
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-brand-slate tracking-tight">
            Informasi Kontak &amp; Domisili
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1.5 sm:mt-2 max-w-2xl leading-relaxed">
            Pastikan nomor WhatsApp dan email aktif untuk pengiriman salinan tautan sertifikat resmi.
          </p>
        </header>

        {/* Form Body Fields */}
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          {/* Row 1: WhatsApp & Email (2-Column Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {/* Left Column: WhatsApp Input */}
            <div>
              <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                <label htmlFor="whatsapp_number" className="text-xs sm:text-sm font-bold text-brand-slate">
                  Nomor WhatsApp / HP <span className="text-brand-pink">*</span>
                </label>
                <span className="text-[11px] text-slate-400 font-medium">(Wajib diisi)</span>
              </div>
              <div className="relative flex rounded-xl border border-brand-border bg-white shadow-sm focus-within:ring-2 focus-within:ring-brand-pink/20 focus-within:border-brand-pink transition-all overflow-hidden min-h-[44px]">
                <span className="inline-flex items-center px-3.5 border-r border-brand-border bg-slate-50 text-slate-600 text-xs sm:text-sm font-semibold select-none">
                  +62
                </span>
                <input
                  id="whatsapp_number"
                  type="tel"
                  required
                  value={kontak_wa}
                  onChange={(e) => updateFormData({ kontak_wa: e.target.value })}
                  placeholder="812-3456-7890"
                  className="flex-1 min-w-0 block w-full px-3.5 py-3 sm:py-2.5 text-sm text-brand-slate placeholder-slate-400 border-0 focus:ring-0 focus:outline-none min-h-[44px]"
                />
              </div>
              <p className="text-[11px] text-brand-muted mt-1.5">
                Link sertifikat digital dan konfirmasi akan dikirimkan ke nomor ini.
              </p>
            </div>

            {/* Right Column: Email Input */}
            <div>
              <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                <label htmlFor="email_address" className="text-xs sm:text-sm font-bold text-brand-slate">
                  Alamat Email Aktif <span className="text-brand-pink">*</span>
                </label>
                <span className="text-[11px] text-slate-400 font-medium">(Wajib diisi)</span>
              </div>
              <div className="relative flex items-center rounded-xl border border-brand-border bg-white shadow-sm focus-within:ring-2 focus-within:ring-brand-pink/20 focus-within:border-brand-pink transition-all overflow-hidden min-h-[44px]">
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
                  className="flex-1 min-w-0 block w-full pl-10 pr-3.5 py-3 sm:py-2.5 text-sm text-brand-slate placeholder-slate-400 border-0 focus:ring-0 focus:outline-none min-h-[44px]"
                />
              </div>
              <p className="text-[11px] text-brand-muted mt-1.5">
                Salinan berkas PDF resmi juga akan diarsipkan via email.
              </p>
            </div>
          </div>

          {/* Row 2: Alamat Lengkap Domisili (Full Width Textarea) */}
          <div>
            <div className="flex justify-between items-center mb-1.5 sm:mb-2">
              <label htmlFor="domicile_address" className="text-xs sm:text-sm font-bold text-brand-slate">
                Alamat Lengkap Domisili <span className="text-brand-pink">*</span>
              </label>
              <span className="text-[11px] text-slate-400 font-medium">(Wajib diisi)</span>
            </div>
            <textarea
              id="domicile_address"
              rows={3}
              required
              value={alamat}
              onChange={(e) => updateFormData({ alamat: e.target.value })}
              placeholder="Contoh: Jl. Melati Raya No. 45, RT 03 / RW 07, Kel. Sukamaju, Kec. Cilodong"
              className="block w-full px-3.5 py-3 sm:py-2.5 text-sm bg-white border border-brand-border rounded-xl text-brand-slate placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink transition-all resize-none"
            />
            <p className="text-[11px] text-brand-muted mt-1.5">
              Alamat domisili saat ini untuk basis pendataan keluarga partner.
            </p>
          </div>

          {/* Row 3: Provinsi & Kota / Kabupaten (2-Column Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label htmlFor="province_select" className="block text-xs sm:text-sm font-bold text-brand-slate mb-1.5 sm:mb-2">
                Provinsi <span className="text-brand-pink">*</span>
              </label>
              <select
                id="province_select"
                value={provinsi}
                onChange={(e) => updateFormData({ provinsi: e.target.value })}
                className="block w-full bg-white border border-brand-border rounded-xl py-3 sm:py-2.5 px-3.5 text-sm text-brand-slate font-medium focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink transition-all min-h-[44px]"
              >
                <option value="Jawa Barat">Jawa Barat</option>
                <option value="DKI Jakarta">DKI Jakarta</option>
                <option value="Banten">Banten</option>
                <option value="Jawa Tengah">Jawa Tengah</option>
                <option value="D.I. Yogyakarta">D.I. Yogyakarta</option>
                <option value="Jawa Timur">Jawa Timur</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div>
              <label htmlFor="city_select" className="block text-xs sm:text-sm font-bold text-brand-slate mb-1.5 sm:mb-2">
                Kota / Kabupaten <span className="text-brand-pink">*</span>
              </label>
              <select
                id="city_select"
                value={kota}
                onChange={(e) => updateFormData({ kota: e.target.value })}
                className="block w-full bg-white border border-brand-border rounded-xl py-3 sm:py-2.5 px-3.5 text-sm text-brand-slate font-medium focus:outline-none focus:ring-2 focus:ring-brand-pink/20 focus:border-brand-pink transition-all min-h-[44px]"
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
            </div>
          </div>

          {/* Row 4: Callout Banner (Security & Privacy) */}
          <div className="bg-[#EFF6FF] border border-blue-100 rounded-2xl p-3.5 sm:p-4 flex items-start space-x-3">
            <div className="text-brand-navy shrink-0 mt-0.5">
              <Shield className="w-5 h-5 text-brand-navy" />
            </div>
            <div className="text-xs leading-relaxed text-slate-700">
              <span className="font-bold text-brand-navy block mb-0.5">
                Privasi &amp; Kerahasiaan Data Terjamin:
              </span>
              Data kontak dan alamat keluarga Anda disimpan dengan aman dan hanya digunakan untuk kepentingan verifikasi kemitraan resmi I Know You.
            </div>
          </div>

          {/* Navigation Buttons: Responsive stacking on mobile */}
          <div className="pt-5 sm:pt-6 border-t border-slate-100 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
            <button
              type="button"
              onClick={onPrev}
              className="inline-flex items-center justify-center px-5 py-3 sm:py-2.5 rounded-xl border border-brand-border bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>Kembali</span>
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center px-6 py-3.5 sm:py-3 rounded-xl bg-brand-pink hover:bg-brand-pink-hover text-white font-semibold text-sm shadow-md shadow-pink-500/25 transition-all transform active:scale-98 min-h-[44px]"
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
