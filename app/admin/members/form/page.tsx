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
        // Ambil data asli untuk mengecek perubahan sort_order
        const { data: originalMember } = await supabase
          .from("members")
          .select("sort_order")
          .eq("id", editingId)
          .single();

        if (originalMember) {
          const oldOrder = originalMember.sort_order;
          const newOrder = formData.sort_order;

          if (oldOrder !== newOrder) {
            if (newOrder < oldOrder) {
              // Pindah ke atas, anggota di antaranya harus turun
              const { data: membersToShift } = await supabase
                .from("members")
                .select("id, sort_order")
                .gte("sort_order", newOrder)
                .lt("sort_order", oldOrder);
              
              if (membersToShift && membersToShift.length > 0) {
                await Promise.all(membersToShift.map(m => 
                  supabase.from("members").update({ sort_order: m.sort_order + 1 }).eq("id", m.id)
                ));
              }
            } else if (newOrder > oldOrder) {
              // Pindah ke bawah, anggota di antaranya harus naik
              const { data: membersToShift } = await supabase
                .from("members")
                .select("id, sort_order")
                .gt("sort_order", oldOrder)
                .lte("sort_order", newOrder);
                
              if (membersToShift && membersToShift.length > 0) {
                await Promise.all(membersToShift.map(m => 
                  supabase.from("members").update({ sort_order: m.sort_order - 1 }).eq("id", m.id)
                ));
              }
            }
          }
        }

        const { error } = await supabase.from("members").update(formData).eq("id", editingId);
        if (error) throw error;
        
        Swal.fire({
          title: "Berhasil!",
          text: "Data anggota berhasil diperbarui!",
          icon: "success",
          confirmButtonColor: "#10b981",
        });
      } else {
        // Tambah baru, anggota mulai dari nomor urut ini ke atas harus turun (mundur)
        const { data: membersToShift } = await supabase
          .from("members")
          .select("id, sort_order")
          .gte("sort_order", formData.sort_order);

        if (membersToShift && membersToShift.length > 0) {
          await Promise.all(membersToShift.map(m => 
            supabase.from("members").update({ sort_order: m.sort_order + 1 }).eq("id", m.id)
          ));
        }

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
    <div className="max-w-3xl mx-auto space-y-5 md:space-y-6">
      <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
        <button 
          onClick={() => router.push('/admin/members')}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-lg md:text-xl font-black text-gray-900 tracking-tight leading-tight">
            {editingId ? "Edit Anggota" : "Tambah Anggota Baru"}
          </h1>
          <p className="text-gray-500 mt-0.5 text-xs">Isi detail form anggota pengurus di bawah ini</p>
        </div>
      </div>

      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl border border-gray-100 shadow-2xs">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          
          {/* Row 1: 2 Kolom Input (Nama & Jabatan) */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-bold text-slate-800">Nama Lengkap</label>
              <input
                type="text"
                required
                placeholder="Contoh: Maulidi Riyanto"
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-xs sm:text-sm text-slate-700 placeholder-gray-400"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-bold text-slate-800">Jabatan / Peran</label>
              <input
                type="text"
                required
                placeholder="Contoh: Ketua / Sekretaris"
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-xs sm:text-sm text-slate-700 placeholder-gray-400"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              />
            </div>
          </div>

          {/* Row 2: 2 Kolom Input (Seksi/Bidang & Urutan) */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-bold text-slate-800">Seksi / Bidang</label>
              <input
                type="text"
                placeholder="Contoh: Seksi Pemasaran"
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-xs sm:text-sm text-slate-700 placeholder-gray-400"
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-bold text-slate-800">Urutan Tampil (No)</label>
              <input
                type="number"
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-xs sm:text-sm text-slate-700"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs sm:text-sm font-bold text-slate-800">Deskripsi Tugas (Opsional)</label>
            <textarea
              rows={3}
              placeholder="Jelaskan peran atau lingkup tanggung jawab..."
              className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-xs sm:text-sm resize-none text-slate-700 placeholder-gray-400"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-3 p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <input
              type="checkbox"
              id="is_primary"
              checked={formData.is_primary}
              onChange={(e) => setFormData({ ...formData, is_primary: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded-md border-gray-300 focus:ring-emerald-500 cursor-pointer"
            />
            <label htmlFor="is_primary" className="text-xs sm:text-sm font-bold text-emerald-900 select-none cursor-pointer">
              Tandai sebagai Pengurus Inti / Ketua
              <p className="text-[11px] font-normal text-emerald-700 mt-0.5">Akan ditampilkan menonjol di halaman Profil (Kartu Hijau Besar).</p>
            </label>
          </div>

          <div className="pt-3 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => router.push('/admin/members')}
              className="py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-2xs cursor-pointer active:scale-95 text-center"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="py-2.5 sm:py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-center"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : null}
              <span>{editingId ? "Perbarui Data" : "Simpan Data"}</span>
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
