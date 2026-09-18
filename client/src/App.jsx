import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import gsap from 'gsap';
import LoadingScreen from './components/LoadingScreen';
import SidebarRail from './components/SidebarRail';
import StepOneDataKeluarga from './components/StepOneDataKeluarga';
import StepTwoProfilAnak from './components/StepTwoProfilAnak';
import StepThreeKonfirmasi from './components/StepThreeKonfirmasi';
import SuccessState from './components/SuccessState';
import AdminRekapView from './components/AdminRekapView';
import AdminAuthGate from './components/AdminAuthGate';
import { AlertCircle } from 'lucide-react';

const INITIAL_FORM_DATA = {
  pribadi_instansi: 'Pribadi',
  nama_instansi_custom: '',
  nama_keluarga: 'Keluarga Hendra Pratama',
  nama_ayah: 'Hendra Pratama',
  stifin_ayah: 'Thinking Introvert',
  golongan_darah_ayah: 'O',
  nama_ibu: 'Siti Nurhaliza',
  stifin_ibu: 'Feeling Extrovert',
  golongan_darah_ibu: 'A',
  jumlah_anak: 2,
  anak: [
    { nama: 'Ahmad Dani Pratama', stifin: 'Sensing Extrovert', golongan_darah: 'O' },
    { nama: 'Aisyah Putri Pratama', stifin: 'Intuiting Introvert', golongan_darah: 'A' },
  ],
};

function PortalContainer({
  step,
  setStep,
  formData,
  updateFormData,
  onNext,
  onPrev,
  onReset,
  onSubmit,
  isSubmitting,
  submitError,
  resultData,
}) {
  const mainCardRef = useRef(null);

  useEffect(() => {
    if (mainCardRef.current) {
      gsap.fromTo(
        mainCardRef.current,
        {
          opacity: 0,
          scale: 0.94,
          y: 35,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
        }
      );
    }
  }, []);

  return (
    <div className="flex-1 flex items-center justify-center p-3 sm:p-6 md:p-8 font-sans antialiased overflow-x-hidden">
      <main
        ref={mainCardRef}
        className="w-full max-w-5xl bg-white rounded-2xl border border-[#EAE3D7] shadow-warm-lg overflow-hidden flex flex-col lg:flex-row min-h-[640px] lg:min-h-[680px]"
      >
        {/* Sidebar Stepper - Bespoke Deep Maroon Panel */}
        <SidebarRail
          currentStep={step}
          setStep={(s) => setStep(s)}
          isSubmitted={step === 4}
        />

        {/* Right Form Canvas - Warm Ivory Paper */}
        <section className="flex-1 bg-white p-6 sm:p-9 lg:p-11 flex flex-col justify-between overflow-y-auto">
          {submitError && (
            <div className="mb-5 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {step === 1 && (
            <StepOneDataKeluarga
              formData={formData}
              updateFormData={updateFormData}
              onNext={onNext}
            />
          )}

          {step === 2 && (
            <StepTwoProfilAnak
              formData={formData}
              updateFormData={updateFormData}
              onNext={onNext}
              onPrev={onPrev}
            />
          )}

          {step === 3 && (
            <StepThreeKonfirmasi
              formData={formData}
              onPrev={onPrev}
              onEdit={() => setStep(1)}
              onSubmit={onSubmit}
              isSubmitting={isSubmitting}
            />
          )}

          {step === 4 && (
            <SuccessState
              resultData={resultData}
              onReset={onReset}
            />
          )}
        </section>
      </main>
    </div>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isAdminAuthed, setIsAdminAuthed] = useState(() => {
    return sessionStorage.getItem('iky_admin_auth') === 'true';
  });

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [resultData, setResultData] = useState(null);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
      setIsAdminAuthed(sessionStorage.getItem('iky_admin_auth') === 'true');
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const updateFormData = (fields) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const handleNext = () => {
    setSubmitError(null);
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrev = () => {
    setSubmitError(null);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const instansiLabel = formData.pribadi_instansi === 'Instansi' && formData.nama_instansi_custom?.trim()
        ? `Instansi: ${formData.nama_instansi_custom.trim()}`
        : 'Pribadi';

      const payload = {
        nama_keluarga: formData.nama_keluarga,
        pribadi_instansi: instansiLabel,
        nama_ayah: formData.nama_ayah,
        stifin_ayah: formData.stifin_ayah,
        golongan_darah_ayah: formData.golongan_darah_ayah,
        nama_ibu: formData.nama_ibu,
        stifin_ibu: formData.stifin_ibu,
        golongan_darah_ibu: formData.golongan_darah_ibu,
        jumlah_anak: Number(formData.jumlah_anak || 0),
        anak: Array.isArray(formData.anak) ? formData.anak : [],
      };

      const res = await axios.post('/api/keluarga', payload);

      if (res.data && res.data.success) {
        setResultData(res.data.data);
        setStep(4);
      } else {
        throw new Error(res.data?.message || 'Terjadi kesalahan saat memproses data.');
      }
    } catch (err) {
      console.error('Submission error:', err);
      const msg = err.response?.data?.message || err.message || 'Gagal menghubungi server.';
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      pribadi_instansi: 'Pribadi',
      nama_instansi_custom: '',
      nama_keluarga: '',
      nama_ayah: '',
      stifin_ayah: '',
      golongan_darah_ayah: '',
      nama_ibu: '',
      stifin_ibu: '',
      golongan_darah_ibu: '',
      jumlah_anak: 0,
      anak: [],
    });
    setResultData(null);
    setSubmitError(null);
    setStep(1);
  };

  if (isLoading) {
    return <LoadingScreen onFinish={() => setIsLoading(false)} />;
  }

  // RUTE INTERNAL ADMIN (/admin)
  if (currentPath === '/admin') {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-[#1F1A1B] flex flex-col font-sans antialiased">
        {!isAdminAuthed ? (
          <AdminAuthGate
            onSuccess={() => setIsAdminAuthed(true)}
            onBackToHome={() => navigateTo('/')}
          />
        ) : (
          <AdminRekapView
            onBackToForm={() => navigateTo('/')}
            onLogout={() => {
              sessionStorage.removeItem('iky_admin_auth');
              setIsAdminAuthed(false);
            }}
          />
        )}
      </div>
    );
  }

  // RUTE PUBLIK UTAMA (/) - MURNI UNTUK USER PARTNER
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1F1A1B] flex flex-col font-sans antialiased">
      {/* Editorial Top Navigation Header */}
      <header className="w-full bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EAE3D7] sticky top-0 z-40 px-5 py-3 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#58121A] border border-[#C4A36B]/40 flex items-center justify-center text-[#C4A36B] font-serif font-bold text-sm tracking-wider shadow-warm-sm">
            IKY
          </div>
          <div>
            <span className="font-serif font-bold text-base tracking-tight text-[#1F1A1B] block leading-tight">
              I Know You <span className="font-sans font-normal text-xs text-[#8A827E]">· Portal Kemitraan</span>
            </span>
            <span className="text-[11px] text-[#C4A36B] font-serif italic block leading-none mt-0.5">
              Well Identified Family by misshiday
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-serif italic text-[#8A827E] hidden sm:inline">
            Formulir Resmi Kemitraan STIFIn
          </span>
        </div>
      </header>

      {/* Main Partner Form Canvas */}
      <div className="flex-1 flex flex-col">
        <PortalContainer
          step={step}
          setStep={setStep}
          formData={formData}
          updateFormData={updateFormData}
          onNext={handleNext}
          onPrev={handlePrev}
          onReset={handleReset}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitError={submitError}
          resultData={resultData}
        />
      </div>
    </div>
  );
}
