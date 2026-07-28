/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

function MemberFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editingId = searchParams.get("id");

  const [saving, setSaving] = useState(false);
  const [pageLoading, setPageLoading] = useState(!!editingId);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    section: "",
    description: "",
    is_primary: false,
    sort_order: 1,
  });

  useEffect(() => {
    async function fetchItem() {
      if (editingId) {
        const { data, error } = await supabase.from("members").select("*").eq("id", editingId).single();
        if (data && !error) {
          setFormData({
            name: data.name || "",
            role: data.role || "",
            section: data.section || "",
            description: data.description || "",
            is_primary: data.is_primary || false,
            sort_order: data.sort_order || 1,
          });
        } else {
          Swal.fire("Error", "Gagal memuat data anggota", "error");
          router.push("/admin/members");
        }
      } else {
        // Find max sort order
        const { data, error } = await supabase.from("members").select("sort_order").order("sort_order", { ascending: false }).limit(1);
        if (!error && data && data.length > 0) {
          setFormData(prev => ({ ...prev, sort_order: (data[0].sort_order || 0) + 1 }));
        }
      }
      setPageLoading(false);
    }
    fetchItem();
  }, [editingId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (editingId) {
        const { error } = await supabase.from("members").update(formData).eq("id", editingId);
        if (error) throw error;
        
        Swal.fire({
          title: "Berhasil!",
          text: "Data anggota berhasil diperbarui!",
          icon: "success",
          confirmButtonColor: "#10b981",
        });
      } else {
        const { error } = await supabase.from("members").insert([formData]);
        if (error) throw error;

        Swal.fire({
          title: "Berhasil!",
          text: "Anggota baru berhasil ditambahkan!",
          icon: "success",
          confirmButtonColor: "#10b981",
        });
      }

      router.push("/admin/members");
    } catch (error: any) {
      Swal.fire({
        title: "Gagal!",
        text: error.message,
        icon: "error",
        confirmButtonColor: "#10b981",
      });
    } finally {
      setSaving(false);
    }
  };

  if (pageLoading) {
    return <div className="p-8 text-center text-gray-500">Memuat data anggota...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
      <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
        <button 
          onClick={() => router.push('/admin/members')}
          className="p-1.5 hover:bg-gray-100 rounded-none transition-colors"
        >
          <ArrowLeft size={18} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-base md:text-xl font-black text-gray-900 leading-tight">
            {editingId ? "Edit Anggota" : "Tambah Anggota Baru"}
          </h1>
          <p className="text-gray-500 mt-0.5 text-[10px] md:text-xs">Isi detail form di bawah ini</p>
        </div>
      </div>

      <div className="">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800">Nama Lengkap</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm text-slate-700"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800">Jabatan / Peran</label>
              <input
                type="text"
                required
                placeholder="Contoh: Ketua, Sekretaris, Anggota"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm text-slate-700 placeholder-gray-400"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800">Seksi / Bidang (Opsional)</label>
              <input
                type="text"
                placeholder="Contoh: Seksi Pemasaran"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm text-slate-700 placeholder-gray-400"
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800">Urutan Tampil (Angka)</label>
              <input
                type="number"
                required
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm text-slate-700"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-800">Deskripsi Tugas (Opsional)</label>
            <textarea
              rows={3}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm resize-none text-slate-700"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-3 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
            <input
              type="checkbox"
              id="is_primary"
              checked={formData.is_primary}
              onChange={(e) => setFormData({ ...formData, is_primary: e.target.checked })}
              className="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
            />
            <label htmlFor="is_primary" className="text-sm font-bold text-emerald-900 select-none cursor-pointer">
              Tandai sebagai Pengurus Inti / Ketua
              <p className="text-xs font-normal text-emerald-700 mt-0.5">Akan ditampilkan menonjol di halaman Profil (Kartu Hijau Besar).</p>
            </label>
          </div>

          <div className="pt-2 flex gap-4">
            <button
              type="button"
              onClick={() => router.push('/admin/members')}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white px-5 py-3.5 rounded-none font-bold text-sm transition-colors shadow-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[#10b981] hover:bg-emerald-600 disabled:bg-emerald-300 text-white px-5 py-3.5 rounded-none font-bold text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : null}
              {editingId ? "Perbarui Data" : "Simpan Data"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default function MemberFormPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Memuat form...</div>}>
      <MemberFormContent />
    </Suspense>
  );
}
