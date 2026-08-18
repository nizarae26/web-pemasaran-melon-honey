/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Save, Phone, Info, Loader2, Lock, CheckCircle2, XCircle, ArrowRight, KeyRound } from "lucide-react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [waNumber, setWaNumber] = useState("");
  const [savedWaNumber, setSavedWaNumber] = useState("");
  const [tentangKami, setTentangKami] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // States for 2-step verification + OTP
  const [isChangingWa, setIsChangingWa] = useState(false);
  const [oldWaInput, setOldWaInput] = useState("");
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [otpValues, setOtpValues] = useState<string[]>(["", "", "", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState(0); // 5 minutes validity
  const [resendTimer, setResendTimer] = useState(0); // 1 minute resend cooldown
  const [isVerified, setIsVerified] = useState(false);
  const [newWaInput, setNewWaInput] = useState("");
  const [waError, setWaError] = useState("");

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("settings").select("*");
    
    if (error) {
      console.error("Error fetching settings:", error);
      if (error.code === '42P01') {
        toast.error("Tabel 'settings' belum ada. Silakan buat tabel di Supabase.");
      }
    } else if (data) {
      const wa = data.find((s) => s.key === "wa_number");
      const tentang = data.find((s) => s.key === "tentang_kami");
      
      if (wa) {
        const rawWa = wa.value;
        const cleanWa = rawWa.replace(/\D/g, "");
        const sanitizedWa = cleanWa.startsWith("620") ? "62" + cleanWa.substring(3) : cleanWa;
        setWaNumber(sanitizedWa);
        setSavedWaNumber(sanitizedWa);
      }
      if (tentang) setTentangKami(tentang.value);
    }
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSettings();

    // Restore verification state if user refreshed/returned
    if (typeof window !== "undefined") {
      const isRestoredVerified = localStorage.getItem("wa_change_verified");
      if (isRestoredVerified === "true") {
        setIsChangingWa(true);
        setIsVerified(true);
        setIsOtpStep(false);
      }
    }
  }, []);

  // Countdown Timer Effect for OTP & Resend timers
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isChangingWa && isOtpStep) {
      interval = setInterval(() => {
        setOtpTimer((prev) => (prev > 0 ? prev - 1 : 0));
        setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isChangingWa, isOtpStep]);

  const generateAndSendOtp = async () => {
    // Generate 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setOtpInput("");
    setOtpValues(["", "", "", "", "", ""]);
    setOtpTimer(300); // 5 minutes (300 seconds)
    setResendTimer(60); // 1 minute (60 seconds)

    // Output OTP strictly to console for dev environment testing
    console.log("[DEV ONLY] Generated OTP:", otp);

    const waMessage = `*Hindari penipuan! Jangan berikan kode OTP ke siapapun.*\n\nKode OTP verifikasi penggantian nomor WhatsApp Anda dari *Poktan Banyu Urip* adalah: *${otp}*. Kode ini rahasia dan hanya berlaku selama 5 menit.`;
    const fonnteToken = process.env.NEXT_PUBLIC_FONNTE_TOKEN;

    if (!fonnteToken) {
      // Warning if token is not configured yet
      toast.error("Gagal mengirim OTP: Token Fonnte belum dikonfigurasi di .env.local!");
      return;
    }

    try {
      const response = await fetch("https://api.fonnte.com/send", {
        method: "POST",
        headers: {
          "Authorization": fonnteToken,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          target: savedWaNumber,
          message: waMessage
        })
      });

      const resData = await response.json();
      if (resData.status === true) {
        toast.success("Kode OTP berhasil dikirim ke nomor WhatsApp lama!");
      } else {
        console.error("Fonnte Error:", resData);
        toast.error(`Gagal mengirim OTP: ${resData.reason || "Kesalahan dari server gateway."}`);
      }
    } catch (err) {
      console.error("Request Error:", err);
      toast.error("Gagal menghubungkan ke gateway WhatsApp Fonnte.");
    }
  };

  const handleVerifyOldNumber = () => {
    if (!oldWaInput) {
      toast.error("Masukkan nomor WhatsApp lama Anda.");
      return;
    }

    const cleanOldInput = oldWaInput.trim();
    const cleanSavedWa = savedWaNumber.trim();

    if (cleanOldInput === cleanSavedWa) {
      setIsOtpStep(true);
      generateAndSendOtp();
    } else {
      toast.error("Nomor WhatsApp lama salah. Silakan coba lagi.");
    }
  };

  const handleVerifyOtp = () => {
    if (!otpInput || otpInput.length < 6) {
      toast.error("Masukkan kode OTP secara lengkap (6 digit).");
      return;
    }

    if (otpTimer === 0) {
      toast.error("Kode OTP telah kedaluwarsa. Silakan kirim ulang.");
      return;
    }

    if (otpInput.trim() === generatedOtp) {
      setIsVerified(true);
      setIsOtpStep(false);
      setNewWaInput("");
      setWaError("");
      if (typeof window !== "undefined") {
        localStorage.setItem("wa_change_verified", "true");
      }
      toast.success("OTP Terverifikasi! Silakan masukkan nomor baru.");
    } else {
      toast.error("Kode OTP salah. Silakan coba lagi.");
    }
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) {
      toast.error(`Silakan tunggu ${resendTimer} detik untuk mengirim ulang.`);
      return;
    }
    generateAndSendOtp();
  };

  const handleOtpChange = (value: string, index: number) => {
    // Only allow digits
    const digit = value.replace(/\D/g, "");
    if (!digit && value !== "") return;

    const newValues = [...otpValues];
    newValues[index] = digit.substring(digit.length - 1); // take only last digit
    setOtpValues(newValues);
    setOtpInput(newValues.join(""));

    // Auto-focus next input box
    if (digit && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) {
        (nextInput as HTMLInputElement).focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      const newValues = [...otpValues];
      
      if (!otpValues[index] && index > 0) {
        // if currently empty, clear the previous one and focus it
        newValues[index - 1] = "";
        setOtpValues(newValues);
        setOtpInput(newValues.join(""));
        const prevInput = document.getElementById(`otp-input-${index - 1}`);
        if (prevInput) {
          (prevInput as HTMLInputElement).focus();
        }
      } else {
        // clear current box
        newValues[index] = "";
        setOtpValues(newValues);
        setOtpInput(newValues.join(""));
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const chars = pastedData.split("");
      setOtpValues(chars);
      setOtpInput(pastedData);
      
      // Focus last input box
      const lastInput = document.getElementById("otp-input-5");
      if (lastInput) {
        (lastInput as HTMLInputElement).focus();
      }
    }
  };

  const validateNewWa = (value: string) => {
    const cleanVal = value.trim();
    if (!cleanVal) {
      setWaError("Nomor WhatsApp baru tidak boleh kosong.");
      return false;
    }
    if (!/^\d+$/.test(cleanVal)) {
      setWaError("Nomor WhatsApp hanya boleh berisi angka.");
      return false;
    }
    if (!cleanVal.startsWith("62")) {
      setWaError("Nomor WhatsApp harus diawali dengan 62 (contoh: 6281234567890).");
      return false;
    }
    if (cleanVal.startsWith("620")) {
      setWaError("Format nomor salah. Jangan gunakan angka 0 setelah 62 (gunakan 628..., bukan 6208...).");
      return false;
    }
    if (cleanVal.length < 9 || cleanVal.length > 15) {
      setWaError("Panjang nomor WhatsApp harus berkisar antara 9 hingga 15 digit.");
      return false;
    }
    setWaError("");
    return true;
  };

  const handleApplyNewNumber = async () => {
    if (!validateNewWa(newWaInput)) {
      toast.error(waError || "Format nomor baru tidak valid.");
      return;
    }

    const newNumber = newWaInput.trim();
    setSaving(true);

    // Save WA Number immediately to database
    const { error } = await supabase
      .from("settings")
      .upsert({ key: "wa_number", value: newNumber }, { onConflict: 'key' });

    if (error) {
      console.error("Error saving WA number:", error);
      toast.error("Gagal menyimpan nomor WhatsApp baru ke database.");
    } else {
      setWaNumber(newNumber);
      setSavedWaNumber(newNumber);
      if (typeof window !== "undefined") {
        localStorage.removeItem("wa_change_verified");
      }
      toast.success("Nomor WhatsApp baru berhasil diperbarui dan disimpan secara permanen!");
    }
    setSaving(false);
    cancelChangingWa(); // resets everything including states
  };

  const cancelChangingWa = () => {
    setIsChangingWa(false);
    setIsOtpStep(false);
    setIsVerified(false);
    setOldWaInput("");
    setOtpInput("");
    setOtpValues(["", "", "", "", "", ""]);
    setGeneratedOtp("");
    setOtpTimer(0);
    setResendTimer(0);
    setNewWaInput("");
    setWaError("");
    if (typeof window !== "undefined") {
      localStorage.removeItem("wa_change_verified");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    
    // Save WA Number
    const { error: waError } = await supabase
      .from("settings")
      .upsert({ key: "wa_number", value: waNumber }, { onConflict: 'key' });
      
    // Save Tentang Kami
    const { error: tentangError } = await supabase
      .from("settings")
      .upsert({ key: "tentang_kami", value: tentangKami }, { onConflict: 'key' });

    if (waError || tentangError) {
      toast.error("Gagal menyimpan pengaturan. Pastikan tabel 'settings' sudah dibuat.");
    } else {
      setSavedWaNumber(waNumber); // Update reference to saved number
      toast.success("Pengaturan berhasil disimpan!");
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="p-10 text-center"><Loader2 className="animate-spin inline-block mr-2" /> Memuat pengaturan...</div>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-xl md:text-3xl font-black text-gray-800 tracking-tight">
          Pengaturan <span className="text-[#10b981]">Website</span>
        </h1>
        <p className="text-gray-500 mt-1 text-xs md:text-sm">
          Kelola informasi kontak WhatsApp dan Profil Kelompok Tani (Tentang Kami).
        </p>
      </div>

      <div className="space-y-6 md:space-y-8">
        {/* WA Settings */}
        <div className="bg-white p-4 md:p-6 border border-gray-100 shadow-sm rounded-none">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-emerald-50 text-[#10b981] rounded-xl flex items-center justify-center shrink-0">
              <Phone size={18} className="md:w-5 md:h-5" />
            </div>
            <h2 className="text-base md:text-xl font-bold text-gray-800">Nomor WhatsApp Admin</h2>
          </div>
          
          {!isChangingWa ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-bold text-gray-700 mb-2">
                  Nomor WhatsApp Aktif
                </label>
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                  <div className="relative flex-grow">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                      +
                    </span>
                    <input
                      type="text"
                      readOnly
                      value={waNumber || "Belum diatur"}
                      className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 text-gray-500 rounded-xl text-sm font-bold cursor-not-allowed select-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingWa(true);
                      // If there is no old number set, bypass Step 1 verification and go directly to Step 2
                      if (!savedWaNumber) {
                        setIsVerified(true);
                      }
                    }}
                    className="px-5 py-3 bg-emerald-50 text-[#10b981] hover:bg-emerald-100 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 border border-emerald-100 hover:border-emerald-200 active:scale-95 shrink-0 cursor-pointer"
                  >
                    <KeyRound size={16} />
                    <span>Ubah Nomor</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5 border border-emerald-100 bg-emerald-50/10 p-5 rounded-[20px] transition-all duration-300">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <Lock size={16} className="text-[#10b981]" />
                  Proses Ubah Nomor WhatsApp
                </h3>
                {!isVerified && (
                  <button
                    type="button"
                    onClick={cancelChangingWa}
                    className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-[10px] md:text-xs font-bold hover:bg-red-600 transition-colors cursor-pointer shadow-sm shadow-red-500/20 flex items-center gap-1.5"
                  >
                    <XCircle size={14} />
                    Batalkan
                  </button>
                )}
              </div>

              {/* Indikator Langkah */}
              <div className="grid grid-cols-3 gap-2 text-center text-[10px] md:text-xs">
                <div className={`py-2 px-1 rounded-lg font-bold transition-all ${
                  !isOtpStep && !isVerified 
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
                    : "bg-emerald-50 text-emerald-600/70"
                }`}>
                  Langkah 1: Verifikasi
                </div>
                <div className={`py-2 px-1 rounded-lg font-bold transition-all ${
                  isOtpStep 
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
                    : isVerified 
                      ? "bg-emerald-50 text-emerald-600/70" 
                      : "bg-gray-100 text-gray-400"
                }`}>
                  Langkah 1.5: Kode OTP
                </div>
                <div className={`py-2 px-1 rounded-lg font-bold transition-all ${
                  isVerified 
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
                    : "bg-gray-100 text-gray-400"
                }`}>
                  Langkah 2: Nomor Baru
                </div>
              </div>

              {!isOtpStep && !isVerified ? (
                /* STEP 1: INPUT NOMOR LAMA */
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Masukkan Nomor WhatsApp Lama Anda
                    </label>
                    <p className="text-xs text-gray-500 mb-3">
                      Guna memverifikasi identitas Anda, silakan ketik nomor WhatsApp yang sedang terdaftar sekarang secara tepat.
                    </p>
                    <input
                      type="text"
                      value={oldWaInput}
                      onChange={(e) => setOldWaInput(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#10b981] focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                      placeholder="Contoh: 6281234567890"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={handleVerifyOldNumber}
                      className="px-4 py-2 bg-[#10b981] text-white rounded-lg text-xs font-bold hover:bg-[#059669] transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      Kirim Kode OTP
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ) : isOtpStep ? (
                /* STEP 1.5: INPUT OTP & TIMERS */
                <div className="space-y-4">
                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl space-y-2">
                    <p className="text-xs text-emerald-800 font-medium">
                      Kode OTP dari Poktan Banyu Urip telah dikirim secara otomatis ke nomor WhatsApp <strong>+{savedWaNumber}</strong>.
                    </p>
                    <div className="flex items-center gap-4 text-xs font-bold text-gray-600">
                      <span>Masa Berlaku OTP: <span className="text-red-500">{Math.floor(otpTimer / 60)}:{(otpTimer % 60).toString().padStart(2, '0')}</span></span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-gray-700">
                      Masukkan 6-Digit Kode OTP
                    </label>
                    <div className="flex justify-center gap-2 md:gap-3 py-2">
                      {otpValues.map((val, idx) => (
                        <input
                          key={idx}
                          id={`otp-input-${idx}`}
                          type="text"
                          maxLength={1}
                          value={val}
                          onChange={(e) => handleOtpChange(e.target.value, idx)}
                          onKeyDown={(e) => handleKeyDown(e, idx)}
                          onPaste={handlePaste}
                          className="w-10 h-12 md:w-12 md:h-14 border border-gray-200 focus:border-[#10b981] focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-center text-lg md:text-xl font-extrabold focus:outline-none transition-all bg-white shadow-sm"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 justify-between items-center">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendTimer > 0}
                      className="text-xs font-bold text-[#10b981] hover:text-emerald-700 disabled:text-gray-400 transition-colors cursor-pointer disabled:cursor-not-allowed"
                    >
                      {resendTimer > 0 ? `Kirim Ulang OTP (${resendTimer}s)` : "Kirim Ulang OTP"}
                    </button>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        className="px-4 py-2 bg-[#10b981] text-white rounded-lg text-xs font-bold hover:bg-[#059669] transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        Verifikasi OTP
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* STEP 2: INPUT NOMOR BARU */
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 p-3 rounded-lg">
                    <CheckCircle2 size={16} className="text-[#10b981] shrink-0" />
                    <span>Verifikasi OTP berhasil. Silakan masukkan nomor baru.</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Nomor WhatsApp Baru (Gunakan format 62...)
                    </label>
                    <input
                      type="text"
                      value={newWaInput}
                      onChange={(e) => {
                        setNewWaInput(e.target.value);
                        validateNewWa(e.target.value);
                      }}
                      className={`w-full px-4 py-3 bg-white border rounded-xl text-sm focus:outline-none transition-all font-medium ${
                        waError 
                          ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20" 
                          : "border-gray-200 focus:border-[#10b981] focus:ring-2 focus:ring-emerald-500/20"
                      }`}
                      placeholder="Contoh: 6281234567890"
                    />
                    {waError && (
                      <p className="text-xs text-red-500 font-medium mt-1.5 flex items-center gap-1">
                        <XCircle size={12} />
                        {waError}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={handleApplyNewNumber}
                      disabled={!!waError || !newWaInput}
                      className="px-4 py-2 bg-[#10b981] text-white rounded-lg text-xs font-bold hover:bg-[#059669] transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                    >
                      Simpan Nomor Baru
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profil & Tentang Kami Settings */}
        <div className="bg-white p-4 md:p-6 border border-gray-100 shadow-sm space-y-4 rounded-none">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-emerald-50 text-[#10b981] rounded-xl flex items-center justify-center shrink-0">
              <Info size={18} className="md:w-5 md:h-5" />
            </div>
            <h2 className="text-base md:text-xl font-bold text-gray-800">Tentang Kami (Profil)</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs md:text-sm font-bold text-gray-700 mb-2">
                Deskripsi Singkat Profil
              </label>
              <textarea
                value={tentangKami}
                onChange={(e) => setTentangKami(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#10b981] focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                placeholder="Tulis deskripsi kelompok tani di sini..."
              />
            </div>
          </div>

          {/* Save Button inside Card */}
          <div className="pt-2">
            <button
              onClick={handleSave}
              disabled={saving || isChangingWa}
              className="w-full justify-center flex items-center gap-2 px-6 py-3 bg-[#10b981] text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors disabled:opacity-50 shadow-md shadow-emerald-500/20 active:scale-95 text-xs md:text-sm cursor-pointer"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              <span>{saving ? "Menyimpan..." : "Simpan Pengaturan"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
