import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  Users,
  Building2,
  User,
  Baby,
  Search,
  Download,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  FileText,
  Calendar,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  LogOut,
} from 'lucide-react';

export default function AdminRekapView({ onBackToForm, onLogout }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL'); // 'ALL' | 'Pribadi' | 'Instansi'
  const [expandedRowId, setExpandedRowId] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/keluarga');
      if (res.data && res.data.success) {
        setData(res.data.data || []);
      } else {
        throw new Error(res.data?.message || 'Gagal memuat rekap data.');
      }
    } catch (err) {
      console.error('Error fetching rekap:', err);
      setError(err.response?.data?.message || err.message || 'Gagal terhubung ke server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Stats calculation
  const stats = useMemo(() => {
    const totalKeluarga = data.length;
    let totalAnak = 0;
    let totalPribadi = 0;
    let totalInstansi = 0;

    data.forEach((item) => {
      const anakCount = Array.isArray(item.anak) ? item.anak.length : (item.jumlah_anak || 0);
      totalAnak += anakCount;

      const isInstansi = (item.pribadi_instansi || '').toLowerCase().includes('instansi');
      if (isInstansi) {
        totalInstansi += 1;
      } else {
        totalPribadi += 1;
      }
    });

    return { totalKeluarga, totalAnak, totalPribadi, totalInstansi };
  }, [data]);

  // Filtered data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Category match
      const isInstansi = (item.pribadi_instansi || '').toLowerCase().includes('instansi');
      if (categoryFilter === 'Pribadi' && isInstansi) return false;
      if (categoryFilter === 'Instansi' && !isInstansi) return false;

      // Query match
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const matchKeluarga = (item.nama_keluarga || '').toLowerCase().includes(q);
      const matchNo = (item.nomor_sertifikat || '').toLowerCase().includes(q);
      const matchAyah = (item.nama_ayah || '').toLowerCase().includes(q);
      const matchIbu = (item.nama_ibu || '').toLowerCase().includes(q);
      const matchInstansi = (item.pribadi_instansi || '').toLowerCase().includes(q);

      return matchKeluarga || matchNo || matchAyah || matchIbu || matchInstansi;
    });
  }, [data, searchQuery, categoryFilter]);

  const toggleRow = (id) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-6 px-4 sm:px-6 md:px-8">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToForm}
            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-sm"
            title="Kembali ke Formulir Pendaftaran"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1E3A8A] mb-1">
              <ShieldCheck className="w-4 h-4 text-[#FF4081]" />
              <span>Supervisi &amp; Rekapitulasi</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Data Mitra Keluarga & Piagam
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Kelola dan pantau seluruh pendaftaran kuesioner genetika STIFIn & penerbitan sertifikat resmi.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={fetchData}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#FF4081]' : 'text-slate-500'}`} />
            <span>{isLoading ? 'Memuat...' : 'Perbarui'}</span>
          </button>

          <button
            type="button"
            onClick={onBackToForm}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all shadow-sm active:scale-95 cursor-pointer"
            title="Buka Halaman Formulir Pendaftaran Mitra"
          >
            <User className="w-3.5 h-3.5 text-[#FF4081]" />
            <span>Portal Partner</span>
          </button>

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition-all shadow-sm active:scale-95 cursor-pointer"
              title="Kunci sesi admin dan keluar"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          )}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-6">
        {/* Card 1 */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-[#1E3A8A]" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Total Mitra</div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight mt-0.5">
              {isLoading ? '...' : stats.totalKeluarga}
            </div>
            <div className="text-[10px] text-slate-400">Keluarga terdaftar</div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
            <Baby className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Total Anak</div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight mt-0.5">
              {isLoading ? '...' : stats.totalAnak}
            </div>
            <div className="text-[10px] text-slate-400">Anak teridentifikasi</div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-pink-50 border border-pink-100 flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-[#FF4081]" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Pribadi</div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight mt-0.5">
              {isLoading ? '...' : stats.totalPribadi}
            </div>
            <div className="text-[10px] text-slate-400">Jalur Mandiri</div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Instansi</div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight mt-0.5">
              {isLoading ? '...' : stats.totalInstansi}
            </div>
            <div className="text-[10px] text-slate-400">Lembaga / Yayasan</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search bar */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama keluarga, nomor seri, ortu..."
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#FF4081] focus:ring-1 focus:ring-[#FF4081] transition-all"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setCategoryFilter('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              categoryFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua ({data.length})
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter('Pribadi')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              categoryFilter === 'Pribadi'
                ? 'bg-[#FF4081] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Pribadi ({stats.totalPribadi})
          </button>
          <button
            type="button"
            onClick={() => setCategoryFilter('Instansi')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
              categoryFilter === 'Instansi'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Instansi ({stats.totalInstansi})
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={fetchData}
            className="font-bold underline hover:text-red-950 text-xs"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Main Table Container */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-[#FF4081]" />
            <p className="text-xs font-medium">Memuat rekap data dari database Supabase...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="py-16 text-center px-4">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">Tidak ada data yang cocok</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? `Tidak ditemukan hasil untuk "${searchQuery}". Coba kata kunci lain.`
                : 'Belum ada formulir keluarga yang disubmit ke sistem.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">No. Seri</th>
                  <th className="py-3 px-4">Mitra Keluarga</th>
                  <th className="py-3 px-4">Profil Ayah &amp; Ibu</th>
                  <th className="py-3 px-4 text-center">Anak</th>
                  <th className="py-3 px-4">Tanggal Submit</th>
                  <th className="py-3 px-4 text-right">Piagam Sertifikat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredData.map((row) => {
                  const isExpanded = expandedRowId === row.id;
                  const isInstansi = (row.pribadi_instansi || '').toLowerCase().includes('instansi');
                  const anakList = Array.isArray(row.anak) ? row.anak : [];
                  const certUrl = row.url_sertifikat || `/api/keluarga/${row.id}/pdf`;

                  return (
                    <React.Fragment key={row.id}>
                      <tr className={`hover:bg-slate-50/70 transition-colors ${isExpanded ? 'bg-slate-50/50' : ''}`}>
                        {/* No. Registrasi */}
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-800 whitespace-nowrap">
                          <span className="inline-block px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800 text-[11px]">
                            {row.nomor_sertifikat || '-'}
                          </span>
                        </td>

                        {/* Nama Keluarga & Kategori */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900 text-sm">
                            {row.nama_keluarga}
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                            {isInstansi ? (
                              <>
                                <Building2 className="w-3 h-3 text-slate-400" />
                                <span>{row.pribadi_instansi}</span>
                              </>
                            ) : (
                              <>
                                <User className="w-3 h-3 text-slate-400" />
                                <span>Pribadi</span>
                              </>
                            )}
                          </div>
                        </td>

                        {/* Profil Ortu */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
                              <span className="font-semibold text-[#1E3A8A]">Ayah:</span>
                              <span>{row.nama_ayah || '-'}</span>
                              {row.stifin_ayah && (
                                <span className="bg-blue-50 text-blue-800 text-[10px] font-medium px-1.5 py-0.2 rounded border border-blue-100">
                                  {row.stifin_ayah} ({row.golongan_darah_ayah || '?'})
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
                              <span className="font-semibold text-[#FF4081]">Ibu:</span>
                              <span>{row.nama_ibu || '-'}</span>
                              {row.stifin_ibu && (
                                <span className="bg-pink-50 text-pink-800 text-[10px] font-medium px-1.5 py-0.2 rounded border border-pink-100">
                                  {row.stifin_ibu} ({row.golongan_darah_ibu || '?'})
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Anak Count & Expand button */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => toggleRow(row.id)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px] transition-colors"
                          >
                            <Baby className="w-3 h-3 text-emerald-600" />
                            <span>{anakList.length || row.jumlah_anak || 0} Anak</span>
                            {isExpanded ? (
                              <ChevronUp className="w-3 h-3 text-slate-500" />
                            ) : (
                              <ChevronDown className="w-3 h-3 text-slate-500" />
                            )}
                          </button>
                        </td>

                        {/* Tanggal */}
                        <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap text-[11px]">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{formatDate(row.tanggal_submit)}</span>
                          </div>
                        </td>

                        {/* Actions (Unduh & Buka) */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={`/api/keluarga/${row.id}/pdf`}
                              download={`Sertifikat-${row.nomor_sertifikat}.pdf`}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-[11px] shadow-sm transition-all active:scale-95"
                              title="Unduh Berkas PDF Resmi"
                            >
                              <Download className="w-3 h-3 text-slate-600" />
                              <span>Unduh</span>
                            </a>
                            {row.url_sertifikat && (
                              <a
                                href={row.url_sertifikat}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-pink-50 hover:bg-pink-100 text-[#FF4081] font-semibold text-[11px] border border-pink-200 shadow-sm transition-all active:scale-95"
                                title="Buka Piagam di Tab Baru"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Buka</span>
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Anak Drawer Row */}
                      {isExpanded && (
                        <tr className="bg-slate-50/80">
                          <td colSpan={6} className="px-6 py-4 border-y border-slate-200">
                            <div className="space-y-2">
                              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                                <Baby className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Daftar Profil Genetika Anak ({anakList.length} Anak):</span>
                              </div>

                              {anakList.length === 0 ? (
                                <p className="text-xs text-slate-400 italic">
                                  Tidak ada rincian data anak yang diinputkan.
                                </p>
                              ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
                                  {anakList.map((a, idx) => (
                                    <div
                                      key={a.id || idx}
                                      className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs"
                                    >
                                      <div className="font-semibold text-slate-800 text-xs">
                                        {idx + 1}. {a.nama || 'Tanpa Nama'}
                                      </div>
                                      <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500">
                                        <span className="font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                                          {a.stifin || 'Belum Tes'}
                                        </span>
                                        {a.golongan_darah && (
                                          <span className="font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                                            Gol. {a.golongan_darah}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
