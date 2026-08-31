/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { Save, Phone, Info, Loader2, Lock, CheckCircle2, XCircle, ArrowRight, KeyRound, Tag } from "lucide-react";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function SettingsPage() {
  const [waNumber, setWaNumber] = useState("");
  const [savedWaNumber, setSavedWaNumber] = useState("");
  const [tentangKami, setTentangKami] = useState("");
  const [priceHoneyGlobe, setPriceHoneyGlobe] = useState("20.000");
  const [priceGoldenApollo, setPriceGoldenApollo] = useState("22.000");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPrices, setSavingPrices] = useState(false);

  // States for 2-step verification + OTP
  const [isChangingWa, setIsChangingWa] = useState(false);
  const [oldWaInput, setOldWaInput] = useState("");
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [otpValues, setOtpValues] = useState<string[]>(["", "", "", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState(0);
  const [resendTimer, setResendTimer] = useState(0);
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
      const hg = data.find((s) => s.key === "price_honey_globe");
      const ga = data.find((s) => s.key === "price_golden_apollo");
      
      if (wa) {
        const rawWa = wa.value;
        const cleanWa = rawWa.replace(/\D/g, "");
        const sanitizedWa = cleanWa.startsWith("620") ? "62" + cleanWa.substring(3) : cleanWa;
        setWaNumber(sanitizedWa);
        setSavedWaNumber(sanitizedWa);
      }
      if (tentang) setTentangKami(tentang.value);
      if (hg) setPriceHoneyGlobe(hg.value);
      if (ga) setPriceGoldenApollo(ga.value);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();

    if (typeof window !== "undefined") {
      const isRestoredVerified = localStorage.getItem("wa_change_verified");
      if (isRestoredVerified === "true") {
        setIsChangingWa(true);
        setIsVerified(true);
        setIsOtpStep(false);
      }
    }
  }, []);

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
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    setOtpInput("");
    setOtpValues(["", "", "", "", "", ""]);
    setOtpTimer(300);
    setResendTimer(60);

    console.log("[DEV ONLY] Generated OTP:", otp);

    const waMessage = `*Hindari penipuan! Jangan berikan kode OTP ke siapapun.*\n\nKode OTP verifikasi penggantian nomor WhatsApp Anda dari *Poktan Banyu Urip* adalah: *${otp}*. Kode ini rahasia dan hanya berlaku selama 5 menit.`;
    const fonnteToken = process.env.NEXT_PUBLIC_FONNTE_TOKEN;

    if (!fonnteToken) {
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
    const digit = value.replace(/\D/g, "");
    if (!digit && value !== "") return;

    const newValues = [...otpValues];
    newValues[index] = digit.substring(digit.length - 1);
    setOtpValues(newValues);
    setOtpInput(newValues.join(""));

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
        newValues[index - 1] = "";
        setOtpValues(newValues);
        setOtpInput(newValues.join(""));
        const prevInput = document.getElementById(`otp-input-${index - 1}`);
        if (prevInput) {
          (prevInput as HTMLInputElement).focus();
        }
      } else {
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
    cancelChangingWa();
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

  // Dedicated Save Function for Melon Variant Prices
  const handleSavePrices = async () => {
    setSavingPrices(true);
    const { error: hgError } = await supabase
      .from("settings")
      .upsert({ key: "price_honey_globe", value: priceHoneyGlobe }, { onConflict: 'key' });

    const { error: gaError } = await supabase
      .from("settings")
      .upsert({ key: "price_golden_apollo", value: priceGoldenApollo }, { onConflict: 'key' });

    if (hgError || gaError) {
      Swal.fire({
        title: "Gagal!",
        text: "Gagal menyimpan harga varian melon ke database.",
        icon: "error",
        confirmButtonColor: "#10b981",
      });
    } else {
      Swal.fire({
        title: "Berhasil Disimpan!",
        text: "Harga varian melon berhasil diperbarui dan langsung diterapkan ke halaman katalog!",
        icon: "success",
        confirmButtonColor: "#10b981",
      });
    }
    setSavingPrices(false);
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

    // Save Harga Varian Melon
    const { error: hgError } = await supabase
      .from("settings")
      .upsert({ key: "price_honey_globe", value: priceHoneyGlobe }, { onConflict: 'key' });

    const { error: gaError } = await supabase
      .from("settings")
      .upsert({ key: "price_golden_apollo", value: priceGoldenApollo }, { onConflict: 'key' });

    if (waError || tentangError || hgError || gaError) {
      toast.error("Gagal menyimpan pengaturan. Pastikan tabel 'settings' sudah dibuat.");
    } else {
      setSavedWaNumber(waNumber);
      toast.success("Pengaturan berhasil disimpan!");
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="p-10 text-center text-gray-500 text-xs sm:text-sm"><Loader2 className="animate-spin inline-block mr-2" /> Memuat pengaturan...</div>;
  }

  return (
    <div className="max-w-4xl space-y-6 md:space-y-8 relative">
      <div>
        <h1 className="text-lg md:text-2xl font-black text-gray-900 tracking-tight leading-tight">
          Pengaturan Website
        </h1>
        <p className="text-gray-500 mt-0.5 text-xs md:text-sm">
          Kelola kontak WhatsApp, harga varian melon di katalog, dan profil kelompok tani.
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* 1. WA Settings */}
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl border border-gray-100 shadow-2xs">
          <div className="flex items-center gap-3 mb-4 md:mb-5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 border border-emerald-100/50">
              <Phone size={18} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 leading-tight">Nomor WhatsApp Admin</h2>
              <p className="text-[11px] sm:text-xs text-gray-400">Digunakan sebagai tujuan tombol pesan & pemesanan produk</p>
            </div>
          </div>
          
          {!isChangingWa ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">
                  Nomor WhatsApp Aktif
                </label>
                <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-center">
                  <div className="relative flex-grow">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs sm:text-sm">
                      +
                    </span>
                    <input
                      type="text"
                      readOnly
                      value={waNumber || "Belum diatur"}
                      className="w-full pl-7 pr-4 py-2.5 sm:py-3 bg-slate-50 border border-gray-200 text-gray-600 rounded-xl text-xs sm:text-sm font-bold cursor-not-allowed select-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsChangingWa(true);
                      if (!savedWaNumber) {
                        setIsVerified(true);
                      }
                    }}
                    className="px-4 sm:px-5 py-2.5 sm:py-3 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 border border-emerald-100 active:scale-95 shrink-0 cursor-pointer"
                  >
                    <KeyRound size={15} />
                    <span>Ubah Nomor</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 border border-emerald-100 bg-emerald-50/20 p-4 sm:p-5 rounded-2xl transition-all">
              <div className="flex items-center justify-between border-b border-emerald-100/60 pb-3">
                <h3 className="text-xs sm:text-sm font-bold text-emerald-950 flex items-center gap-1.5">
                  <Lock size={15} className="text-emerald-600" />
                  Proses Ubah Nomor WhatsApp
                </h3>
                {!isVerified && (
                  <button
                    type="button"
                    onClick={cancelChangingWa}
                    className="px-2.5 py-1 bg-red-50 text-red-600 border border-red-100 rounded-lg text-[10px] sm:text-xs font-bold hover:bg-red-100 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <XCircle size={13} />
                    Batalkan
                  </button>
                )}
              </div>

              {/* Indikator Langkah */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 text-center text-[9px] sm:text-xs">
                <div className={`py-1.5 sm:py-2 px-1 rounded-xl font-bold transition-all ${
                  !isOtpStep && !isVerified 
                    ? "bg-emerald-600 text-white shadow-2xs" 
                    : "bg-emerald-50 text-emerald-700"
                }`}>
                  1. Verifikasi
                </div>
                <div className={`py-1.5 sm:py-2 px-1 rounded-xl font-bold transition-all ${
                  isOtpStep 
                    ? "bg-emerald-600 text-white shadow-2xs" 
                    : isVerified 
                      ? "bg-emerald-50 text-emerald-700" 
                      : "bg-gray-100 text-gray-400"
                }`}>
                  2. Kode OTP
                </div>
                <div className={`py-1.5 sm:py-2 px-1 rounded-xl font-bold transition-all ${
                  isVerified 
                    ? "bg-emerald-600 text-white shadow-2xs" 
                    : "bg-gray-100 text-gray-400"
                }`}>
                  3. Nomor Baru
                </div>
              </div>

              {!isOtpStep && !isVerified ? (
                /* STEP 1: INPUT NOMOR LAMA */
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Masukkan Nomor WhatsApp Lama
                    </label>
                    <p className="text-[11px] text-gray-500 mb-2">
                      Ketik nomor WhatsApp yang sedang terdaftar sekarang secara tepat untuk verifikasi.
                    </p>
                    <input
                      type="text"
                      value={oldWaInput}
                      onChange={(e) => setOldWaInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                      placeholder="Contoh: 6281234567890"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleVerifyOldNumber}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                    >
                      <span>Kirim Kode OTP</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ) : isOtpStep ? (
                /* STEP 1.5: INPUT OTP & TIMERS */
                <div className="space-y-3">
                  <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-xl space-y-1">
                    <p className="text-xs text-emerald-800 font-medium">
                      Kode OTP telah dikirim ke nomor WhatsApp <strong>+{savedWaNumber}</strong>.
                    </p>
                    <div className="flex items-center gap-3 text-[11px] font-bold text-gray-600">
                      <span>Masa Berlaku OTP: <span className="text-red-500">{Math.floor(otpTimer / 60)}:{(otpTimer % 60).toString().padStart(2, '0')}</span></span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700">
                      Masukkan 6-Digit Kode OTP
                    </label>
                    <div className="flex justify-center gap-2 sm:gap-2.5 py-1">
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
                          className="w-10 h-11 sm:w-11 sm:h-12 border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-center text-base sm:text-lg font-extrabold focus:outline-none transition-all bg-white shadow-2xs"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendTimer > 0}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 disabled:text-gray-400 transition-colors cursor-pointer disabled:cursor-not-allowed"
                    >
                      {resendTimer > 0 ? `Kirim Ulang (${resendTimer}s)` : "Kirim Ulang OTP"}
                    </button>
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                    >
                      <span>Verifikasi OTP</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                /* STEP 2: INPUT NOMOR BARU */
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 p-2.5 rounded-xl">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    <span>Verifikasi OTP berhasil. Silakan masukkan nomor baru.</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Nomor WhatsApp Baru (Awali dengan 62...)
                    </label>
                    <input
                      type="text"
                      value={newWaInput}
                      onChange={(e) => {
                        setNewWaInput(e.target.value);
                        validateNewWa(e.target.value);
                      }}
                      className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-xs sm:text-sm focus:outline-none transition-all font-medium ${
                        waError 
                          ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20" 
                          : "border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                      }`}
                      placeholder="Contoh: 6281234567890"
                    />
                    {waError && (
                      <p className="text-xs text-red-500 font-medium mt-1 flex items-center gap-1">
                        <XCircle size={12} />
                        {waError}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleApplyNewNumber}
                      disabled={!!waError || !newWaInput}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                    >
                      Simpan Nomor Baru
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 2. Melon Variant Prices Settings */}
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl border border-gray-100 shadow-2xs space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0 border border-amber-100/50">
              <Tag size={18} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 leading-tight">Harga Varian Melon</h2>
              <p className="text-[11px] sm:text-xs text-gray-400">Atur patokan harga per kilogram untuk masing-masing varietas melon di halaman katalog</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5 bg-emerald-50/40 p-3.5 rounded-xl border border-emerald-100/60">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">Putih Honey Globe</span>
                <span className="text-[10px] text-gray-400 font-bold">/ kg</span>
              </div>
              <label className="block text-xs font-bold text-slate-700">Harga Honey Globe</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">Rp</span>
                <input
                  type="text"
                  value={priceHoneyGlobe}
                  onChange={(e) => setPriceHoneyGlobe(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold text-slate-800 shadow-2xs"
                  placeholder="20.000"
                />
              </div>
            </div>

            <div className="space-y-1.5 bg-amber-50/40 p-3.5 rounded-xl border border-amber-100/60">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider">Kuning Golden Apollo</span>
                <span className="text-[10px] text-gray-400 font-bold">/ kg</span>
              </div>
              <label className="block text-xs font-bold text-slate-700">Harga Golden Apollo</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">Rp</span>
                <input
                  type="text"
                  value={priceGoldenApollo}
                  onChange={(e) => setPriceGoldenApollo(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all font-bold text-slate-800 shadow-2xs"
                  placeholder="22.000"
                />
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={handleSavePrices}
              disabled={savingPrices}
              className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {savingPrices ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              <span>{savingPrices ? "Menyimpan ke Katalog..." : "Simpan Perubahan Harga Katalog"}</span>
            </button>
          </div>
        </div>

        {/* 3. Profil & Tentang Kami Settings */}
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl border border-gray-100 shadow-2xs space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 border border-emerald-100/50">
              <Info size={18} />
            </div>
            <div>
              <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 leading-tight">Tentang Kami (Profil Kelompok Tani)</h2>
              <p className="text-[11px] sm:text-xs text-gray-400">Deskripsi singkat visi, komitmen, dan profil kelompok tani di halaman publik</p>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs sm:text-sm font-bold text-gray-700">
              Deskripsi Singkat Profil
            </label>
            <textarea
              value={tentangKami}
              onChange={(e) => setTentangKami(e.target.value)}
              rows={4}
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium text-slate-800 placeholder-gray-400 shadow-2xs resize-none"
              placeholder="Tulis deskripsi kelompok tani di sini..."
            />
          </div>

          <div className="pt-2">
            <button
              onClick={handleSave}
              disabled={saving || isChangingWa}
              className="w-full justify-center flex items-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm transition-all disabled:opacity-50 shadow-sm active:scale-95 cursor-pointer"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              <span>{saving ? "Menyimpan Pengaturan..." : "Simpan Semua Pengaturan"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
