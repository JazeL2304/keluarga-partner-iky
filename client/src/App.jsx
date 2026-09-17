import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import gsap from 'gsap';
import LoadingScreen from './components/LoadingScreen';
import SidebarRail from './components/SidebarRail';
import StepOneDataKeluarga from './components/StepOneDataKeluarga';
import StepTwoProfilAnak from './components/StepTwoProfilAnak';
import StepThreeKonfirmasi from './components/StepThreeKonfirmasi';
import SuccessState from './components/SuccessState';
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

// Komponen Pembungkus Form Portal dengan Animasi Pop-Up Sekali di Awal
function PortalContainer({ step, setStep, formData, updateFormData, onNext, onPrev, onReset, onSubmit, isSubmitting, submitError, resultData }) {
  const mainCardRef = useRef(null);

  // Animasi pop-up berjalan TEPAT saat komponen portal pertama kali muncul (Mount)
  useEffect(() => {
    if (mainCardRef.current) {
      gsap.fromTo(
        mainCardRef.current,
        {
          opacity: 0,
          scale: 0.90,
          y: 45,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.65,
          ease: 'back.out(1.4)', // Efek pop-up membal interaktif yang dinamis & fresh
        }
      );
    }
  }, []); // Hanya 1x saat portal muncul

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex items-center justify-center p-3 sm:p-6 md:p-8 font-sans antialiased overflow-x-hidden">
      <main
        ref={mainCardRef}
        className="w-full max-w-5xl bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col lg:flex-row min-h-[640px] lg:min-h-[680px]"
      >
        {/* Sidebar Stepper */}
        <SidebarRail
          currentStep={step}
          setStep={(s) => setStep(s)}
          isSubmitted={step === 4}
        />

        {/* Right Form Canvas */}
        <section className="flex-1 bg-white p-5 sm:p-8 lg:p-10 flex flex-col justify-between overflow-y-auto">
          {submitError && (
            <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
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
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [resultData, setResultData] = useState(null);

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
        setStep(4); // 4 = Success screen
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

  // 1. Fase Pertama: Loading Screen 2 Detik murni
  if (isLoading) {
    return <LoadingScreen onFinish={() => setIsLoading(false)} />;
  }

  // 2. Fase Kedua: Begitu loading kelar, langsung pop-up portalnya, seterusnya stabil
  return (
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
  );
}

