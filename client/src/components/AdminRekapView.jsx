import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
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
  MessageSquareQuote,
  FileSpreadsheet,
  Phone,
  Mail,
  Trash2,
  AlertTriangle,
  HeartHandshake,
} from 'lucide-react';

export default function AdminRekapView({ onBackToForm, onLogout }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL'); // 'ALL' | 'Pribadi' | 'Instansi'
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccessMsg, setDeleteSuccessMsg] = useState(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await axios.delete(`/api/keluarga/${deleteTarget.id}`);
      if (res.data && res.data.success) {
        setData((prev) => prev.filter((item) => item.id !== deleteTarget.id));
        setDeleteSuccessMsg(`Data keluarga "${deleteTarget.nama_keluarga}" berhasil dihapus.`);
        setDeleteTarget(null);
        setTimeout(() => setDeleteSuccessMsg(null), 4000);
      } else {
        throw new Error(res.data?.message || 'Gagal menghapus data.');
      }
    } catch (err) {
      console.error('Error deleting keluarga:', err);
      alert(err.response?.data?.message || err.message || 'Gagal menghapus data dari database.');
    } finally {
      setIsDeleting(false);
    }
  };

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

  // ─── EXPORT EXCEL ────────────────────────────────────────────────────────────
  const exportToExcel = () => {
    if (data.length === 0) return;
    setIsExporting(true);

    try {
      const wb = XLSX.utils.book_new();

      // ── Sheet 1: Data Keluarga (Orang Tua) ──────────────────────────────────
      const keluargaHeaders = [
        'No. Sertifikat',
        'Nama Keluarga',
        'Status Pernikahan',
        'Total Anggota',
        'Status Kualifikasi',
        'Kategori',
        'No. WhatsApp',
        'Email',
        'Nama Ayah',
        'STIFIn Ayah',
        'Gol. Darah Ayah',
        'Nama Ibu',
        'STIFIn Ibu',
        'Gol. Darah Ibu',
        'Jumlah Anak',
        'Kesan & Pesan',
        'Tanggal Submit',
        'URL Sertifikat',
      ];

      const keluargaRows = data.map((k) => {
        const isBelum = k.status_pernikahan === 'Belum Menikah';
        const totAnggota = k.jumlah_anggota_keluarga || (2 + (Array.isArray(k.anak) ? k.anak.length : (k.jumlah_anak || 0)));

        return {
          'No. Sertifikat': k.nomor_sertifikat || '-',
          'Nama Keluarga': k.nama_keluarga || '-',
          'Status Pernikahan': k.status_pernikahan || 'Menikah',
          'Total Anggota': totAnggota,
          'Status Kualifikasi': isBelum ? 'Not Qualified' : 'Qualified',
          'Kategori': k.pribadi_instansi || 'Pribadi',
          'No. WhatsApp': k.no_wa || '-',
          'Email': k.email || '-',
          'Nama Ayah': k.nama_ayah || '-',
          'STIFIn Ayah': k.stifin_ayah || '-',
          'Gol. Darah Ayah': k.golongan_darah_ayah || '-',
          'Nama Ibu': k.nama_ibu || '-',
          'STIFIn Ibu': k.stifin_ibu || '-',
          'Gol. Darah Ibu': k.golongan_darah_ibu || '-',
          'Jumlah Anak': Array.isArray(k.anak) ? k.anak.length : (k.jumlah_anak || 0),
          'Kesan & Pesan': k.kesan_pesan || '-',
          'Tanggal Submit': k.tanggal_submit
            ? new Date(k.tanggal_submit).toLocaleString('id-ID')
            : '-',
          'URL Sertifikat': k.url_sertifikat || '-',
        };
      });

      const wsKeluarga = XLSX.utils.json_to_sheet(keluargaRows, { header: keluargaHeaders });

      // Set column widths for Sheet 1
      wsKeluarga['!cols'] = [
        { wch: 14 }, // No. Sertifikat
        { wch: 28 }, // Nama Keluarga
        { wch: 18 }, // Status Pernikahan
        { wch: 14 }, // Total Anggota
        { wch: 18 }, // Status Kualifikasi
        { wch: 20 }, // Kategori
        { wch: 18 }, // No. WhatsApp
        { wch: 25 }, // Email
        { wch: 22 }, // Nama Ayah
        { wch: 22 }, // STIFIn Ayah
        { wch: 15 }, // Gol. Darah Ayah
        { wch: 22 }, // Nama Ibu
        { wch: 22 }, // STIFIn Ibu
        { wch: 15 }, // Gol. Darah Ibu
        { wch: 12 }, // Jumlah Anak
        { wch: 40 }, // Kesan & Pesan
        { wch: 22 }, // Tanggal Submit
        { wch: 50 }, // URL Sertifikat
      ];

      XLSX.utils.book_append_sheet(wb, wsKeluarga, 'Data Keluarga');

      // ── Sheet 2: Data Anak (flat list) ──────────────────────────────────────
      const anakHeaders = [
        'No. Sertifikat Keluarga',
        'Nama Keluarga',
        'No. Urut Anak',
        'Nama Anak',
        'STIFIn Anak',
        'Gol. Darah Anak',
      ];

      const anakRows = [];
      data.forEach((k) => {
        const anakList = Array.isArray(k.anak) ? k.anak : [];
        if (anakList.length === 0) {
          anakRows.push({
            'No. Sertifikat Keluarga': k.nomor_sertifikat || '-',
            'Nama Keluarga': k.nama_keluarga || '-',
            'No. Urut Anak': '-',
            'Nama Anak': '(Belum ada data anak)',
            'STIFIn Anak': '-',
            'Gol. Darah Anak': '-',
          });
        } else {
          anakList.forEach((a, idx) => {
            anakRows.push({
              'No. Sertifikat Keluarga': k.nomor_sertifikat || '-',
              'Nama Keluarga': k.nama_keluarga || '-',
              'No. Urut Anak': idx + 1,
              'Nama Anak': a.nama || '-',
              'STIFIn Anak': a.stifin || '-',
              'Gol. Darah Anak': a.golongan_darah || '-',
            });
          });
        }
      });

      const wsAnak = XLSX.utils.json_to_sheet(anakRows, { header: anakHeaders });

      // Set column widths for Sheet 2
      wsAnak['!cols'] = [
        { wch: 22 }, // No. Sertifikat Keluarga
        { wch: 28 }, // Nama Keluarga
        { wch: 14 }, // No. Urut Anak
        { wch: 28 }, // Nama Anak
        { wch: 22 }, // STIFIn Anak
        { wch: 16 }, // Gol. Darah Anak
      ];

      XLSX.utils.book_append_sheet(wb, wsAnak, 'Data Anak');

      // ── Sheet 3: Rekap Kesan & Pesan ─────────────────────────────────────────
      const kesanRows = data
        .filter((k) => k.kesan_pesan && k.kesan_pesan.trim())
        .map((k) => ({
          'No. Sertifikat': k.nomor_sertifikat || '-',
          'Nama Keluarga': k.nama_keluarga || '-',
          'Kesan & Pesan': k.kesan_pesan,
          'Tanggal Submit': k.tanggal_submit
            ? new Date(k.tanggal_submit).toLocaleString('id-ID')
            : '-',
        }));

      if (kesanRows.length > 0) {
        const wsKesan = XLSX.utils.json_to_sheet(kesanRows, {
          header: ['No. Sertifikat', 'Nama Keluarga', 'Kesan & Pesan', 'Tanggal Submit'],
        });
        wsKesan['!cols'] = [
          { wch: 14 },
          { wch: 28 },
          { wch: 60 },
          { wch: 22 },
        ];
        XLSX.utils.book_append_sheet(wb, wsKesan, 'Kesan & Pesan');
      }

      // ── Download file ────────────────────────────────────────────────────────
      const now = new Date();
      const dateStr = now.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).replace(/\//g, '-');
      const fileName = `Rekap-WIF-IKY_${dateStr}.xlsx`;

      XLSX.writeFile(wb, fileName);
    } catch (err) {
      console.error('Gagal export Excel:', err);
      alert('Gagal membuat file Excel. Silakan coba lagi.');
    } finally {
      setIsExporting(false);
    }
  };
  // ─────────────────────────────────────────────────────────────────────────────

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
      const matchWa = (item.no_wa || '').toLowerCase().includes(q);
      const matchEmail = (item.email || '').toLowerCase().includes(q);

      return matchKeluarga || matchNo || matchAyah || matchIbu || matchInstansi || matchWa || matchEmail;
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

        {/* Right: 2-row action layout — primary CTA + secondary nav */}
        <div className="flex flex-col items-stretch sm:items-end gap-2 shrink-0">

          {/* Baris 1 — Primary CTAs */}
          <div className="flex items-center gap-2">
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
              onClick={exportToExcel}
              disabled={isLoading || isExporting || data.length === 0}
              title={data.length === 0 ? 'Belum ada data untuk diexport' : `Export ${data.length} data ke Excel`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-emerald-300 bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {isExporting ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileSpreadsheet className="w-3.5 h-3.5" />
              )}
              <span>{isExporting ? 'Mengekspor...' : 'Export Excel'}</span>
              {!isExporting && data.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-white/25 text-white text-[10px] font-bold leading-none">
                  {data.length}
                </span>
              )}
            </button>
          </div>

          {/* Baris 2 — Secondary Nav (muted text links) */}
          <div className="flex items-center justify-end gap-3 text-[11px] text-slate-400 font-medium">
            <button
              type="button"
              onClick={onBackToForm}
              className="inline-flex items-center gap-1 hover:text-[#FF4081] transition-colors"
              title="Buka Halaman Formulir Pendaftaran Mitra"
            >
              <User className="w-3 h-3" />
              <span>Portal Partner</span>
            </button>

            {onLogout && (
              <>
                <span className="text-slate-200">|</span>
                <button
                  type="button"
                  onClick={onLogout}
                  className="inline-flex items-center gap-1 hover:text-rose-500 transition-colors"
                  title="Kunci sesi admin dan keluar"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Keluar</span>
                </button>
              </>
            )}
          </div>

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

      {/* Delete Success Alert */}
      {deleteSuccessMsg && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between gap-3 animate-in fade-in duration-200 shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{deleteSuccessMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setDeleteSuccessMsg(null)}
            className="text-emerald-700 hover:text-emerald-950 text-xs font-bold px-1.5 py-0.5 rounded hover:bg-emerald-100/60 cursor-pointer"
          >
            ✕
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

                  return (
                    <React.Fragment key={row.id}>
                      <tr className={`hover:bg-slate-50/70 transition-colors ${isExpanded ? 'bg-slate-50/50' : ''}`}>
                        {/* No. Registrasi */}
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-800 whitespace-nowrap">
                          <span className="inline-block px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800 text-[11px]">
                            {row.nomor_sertifikat || '-'}
                          </span>
                        </td>

                        {/* Nama Keluarga, Kategori, & Kontak Responden */}
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900 text-sm">
                            {row.nama_keluarga}
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-slate-500 mt-1">
                            {isInstansi ? (
                              <span className="inline-flex items-center gap-1">
                                <Building2 className="w-3 h-3 text-slate-400" />
                                <span>{row.pribadi_instansi}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1">
                                <User className="w-3 h-3 text-slate-400" />
                                <span>Pribadi</span>
                              </span>
                            )}

                            <span className="text-slate-300">•</span>

                            {/* Status Kualifikasi Keluarga */}
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-semibold border ${
                              row.status_pernikahan === 'Belum Menikah'
                                ? 'bg-amber-50 text-amber-800 border-amber-200'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            }`}>
                              {row.status_pernikahan === 'Belum Menikah' ? (
                                'Belum Menikah'
                              ) : (
                                <>
                                  <HeartHandshake className="w-3 h-3 text-emerald-600 inline" />
                                  <span>Menikah (Qualified)</span>
                                </>
                              )}
                            </span>

                            <span className="text-slate-300">•</span>

                            {/* Total Anggota */}
                            <span className="inline-flex items-center gap-1 text-[10px] text-slate-600 font-medium">
                              <Users className="w-3 h-3 text-[#1E3A8A]" />
                              <span>{row.jumlah_anggota_keluarga || (2 + (anakList.length || row.jumlah_anak || 0))} Jiwa</span>
                            </span>
                          </div>
                          {/* Kontak WA & Email */}
                          {(row.no_wa || row.email) && (
                            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] mt-1.5 pt-1 border-t border-slate-100">
                              {row.no_wa && (
                                <a
                                  href={`https://wa.me/${row.no_wa.replace(/\D/g, '').replace(/^0/, '62')}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-medium hover:underline"
                                  title="Chat WhatsApp Responden"
                                >
                                  <Phone className="w-3 h-3 text-emerald-600" />
                                  <span>{row.no_wa}</span>
                                </a>
                              )}
                              {row.email && (
                                <a
                                  href={`mailto:${row.email}`}
                                  className="inline-flex items-center gap-1 text-slate-600 hover:text-[#1E3A8A] hover:underline"
                                  title="Kirim Email ke Responden"
                                >
                                  <Mail className="w-3 h-3 text-slate-400" />
                                  <span className="truncate max-w-[150px]">{row.email}</span>
                                </a>
                              )}
                            </div>
                          )}
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
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(row)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 font-semibold text-[11px] shadow-sm transition-all active:scale-95 cursor-pointer"
                              title={`Hapus data keluarga ${row.nama_keluarga}`}
                            >
                              <Trash2 className="w-3 h-3 text-rose-500" />
                              <span>Hapus</span>
                            </button>
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

                              {row.kesan_pesan && (
                                <div className="mt-3 pt-2.5 border-t border-slate-200">
                                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1.5">
                                    <MessageSquareQuote className="w-3.5 h-3.5 text-[#1E3A8A]" />
                                    <span>Kesan &amp; Pesan Kemitraan:</span>
                                  </div>
                                  <p className="p-2.5 bg-white rounded-lg border border-slate-200 text-slate-700 italic text-xs leading-relaxed">
                                    &ldquo;{row.kesan_pesan}&rdquo;
                                  </p>
                                </div>
                              )}

                              {(row.no_wa || row.email) && (
                                <div className="mt-3 pt-2.5 border-t border-slate-200 flex flex-wrap items-center gap-4 text-xs">
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                                    Kontak Responden:
                                  </span>
                                  {row.no_wa && (
                                    <a
                                      href={`https://wa.me/${row.no_wa.replace(/\D/g, '').replace(/^0/, '62')}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1.5 text-emerald-700 font-semibold hover:underline"
                                    >
                                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                                      <span>WA: {row.no_wa}</span>
                                    </a>
                                  )}
                                  {row.email && (
                                    <a
                                      href={`mailto:${row.email}`}
                                      className="inline-flex items-center gap-1.5 text-[#1E3A8A] font-semibold hover:underline"
                                    >
                                      <Mail className="w-3.5 h-3.5 text-[#1E3A8A]" />
                                      <span>Email: {row.email}</span>
                                    </a>
                                  )}
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

      {/* Modal Konfirmasi Hapus Data */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Hapus Data Mitra Keluarga?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed">
                Apakah Anda yakin ingin menghapus data mitra <strong className="text-slate-900 font-semibold">{deleteTarget.nama_keluarga}</strong> ({deleteTarget.nomor_sertifikat || 'Tanpa No. Seri'})?
              </p>
              <div className="text-[11px] text-rose-700 bg-rose-50/80 border border-rose-200/80 rounded-lg p-3 mt-3 space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>Tindakan ini permanen</span>
                </div>
                <p className="text-rose-600 leading-relaxed pl-5">
                  Seluruh profil orang tua, kontak, dan riwayat profil genetika anak yang terdaftar akan dihapus dari database.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Ya, Hapus Data</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
