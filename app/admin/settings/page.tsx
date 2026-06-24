"use client";

import { useState, useEffect } from "react";
import { Save, Phone, Info, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function SettingsPage() {
  const [waNumber, setWaNumber] = useState("");
  const [tentangKami, setTentangKami] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("settings").select("*");
    
    if (error) {
      console.error("Error fetching settings:", error);
      if (error.code === '42P01') {
        alert("Tabel 'settings' belum ada. Silakan buat tabel di Supabase.");
      }
    } else if (data) {
      const wa = data.find((s) => s.key === "wa_number");
      const tentang = data.find((s) => s.key === "tentang_kami");
      
      if (wa) setWaNumber(wa.value);
      if (tentang) setTentangKami(tentang.value);
    }
    setLoading(false);
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
      alert("Gagal menyimpan pengaturan. Pastikan tabel 'settings' sudah dibuat dan RLS dinonaktifkan.");
    } else {
      alert("Pengaturan berhasil disimpan!");
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="p-10 text-center"><Loader2 className="animate-spin inline-block mr-2" /> Memuat pengaturan...</div>;
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-800 tracking-tight">
          Pengaturan <span className="text-[#10b981]">Website</span>
        </h1>
        <p className="text-gray-500 mt-2">
          Kelola informasi kontak WhatsApp dan Profil Kelompok Tani (Tentang Kami).
        </p>
      </div>

      <div className="space-y-8">
        {/* WA Settings */}
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-50 text-[#10b981] rounded-xl flex items-center justify-center">
              <Phone size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Nomor WhatsApp Admin</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Nomor WA (Gunakan format 62...)
              </label>
              <input
                type="text"
                value={waNumber}
                onChange={(e) => setWaNumber(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#10b981] focus:ring-2 focus:ring-emerald-500/20 transition-all"
                placeholder="Contoh: 6281234567890"
              />
            </div>
          </div>
        </div>

        {/* Profil & Tentang Kami Settings */}
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
              <Info size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Tentang Kami (Profil)</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Deskripsi Singkat Profil
              </label>
              <textarea
                value={tentangKami}
                onChange={(e) => setTentangKami(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="Tulis deskripsi kelompok tani di sini..."
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-[#10b981] text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Save size={20} />
            )}
            <span>{saving ? "Menyimpan..." : "Simpan Pengaturan"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
