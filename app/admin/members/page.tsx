/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Swal from "sweetalert2";
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Loader2
} from "lucide-react";

interface Member {
  id: number;
  name: string;
  role: string;
  section: string;
  description?: string;
  is_primary: boolean;
  sort_order: number;
  created_at?: string;
}

export default function MembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMembers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .order("sort_order", { ascending: true });
      
    if (error) {
      console.error("Error fetching members:", error);
      // Fallback data if table doesn't exist yet
      if (error.code === '42P01') {
        Swal.fire({
          title: "Peringatan",
          text: "Tabel 'members' belum ada di database. Silakan buat tabel terlebih dahulu menggunakan SQL Editor Supabase.",
          icon: "warning",
          confirmButtonColor: "#10b981",
        });
      }
    } else {
      setMembers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMembers();
  }, []);

  // Modal functions removed, routed to form page instead

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data anggota akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#10b981",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    const { error } = await supabase.from("members").delete().eq("id", id);
    if (error) {
      Swal.fire({
        title: "Gagal!",
        text: "Gagal menghapus: " + error.message,
        icon: "error",
        confirmButtonColor: "#10b981",
      });
    } else {
      Swal.fire({
        title: "Terhapus!",
        text: "Anggota berhasil dihapus.",
        icon: "success",
        confirmButtonColor: "#10b981",
      });
      fetchMembers();
    }
  };

  const filteredMembers = members.filter(m => 
    m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.section?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
      <div className="flex flex-row items-center justify-between gap-2 md:gap-4">
        <div>
          <h1 className="text-base md:text-2xl font-black text-gray-900 leading-tight">Keanggotaan</h1>
          <p className="text-gray-500 mt-0.5 text-[10px] md:text-sm">Kelola struktur organisasi dan anggota Kelompok Tani Banyu Urip.</p>
        </div>
        <button
          onClick={() => router.push('/admin/members/form')}
          className="shrink-0 bg-[#10b981] hover:bg-emerald-600 text-white px-3 py-2 md:px-5 md:py-2.5 rounded-none font-bold text-[10px] md:text-sm flex items-center gap-1.5 transition-colors shadow-sm active:scale-95"
        >
          <Plus size={14} className="md:w-[18px] md:h-[18px]" />
          Tambah Anggota
        </button>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari anggota, peran, atau seksi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-none text-sm outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] transition-all"
            />
          </div>
        </div>

        {/* Tampilan Desktop (Tabel) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-bold border-b border-gray-100 w-16 text-center">Urutan</th>
                <th className="p-4 font-bold border-b border-gray-100">Nama</th>
                <th className="p-4 font-bold border-b border-gray-100">Jabatan / Peran</th>
                <th className="p-4 font-bold border-b border-gray-100">Seksi / Bidang</th>
                <th className="p-4 font-bold border-b border-gray-100 w-32 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    <div className="flex justify-center mb-2"><Loader2 className="animate-spin text-emerald-500" /></div>
                    Memuat data anggota...
                  </td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    Belum ada data anggota.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="border-b border-gray-50 hover:bg-emerald-50/30 transition-colors">
                    <td className="p-4 text-center text-sm font-bold text-gray-400">{member.sort_order}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white shrink-0 ${member.is_primary ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-md shadow-emerald-500/30' : 'bg-gray-200 text-gray-500'}`}>
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{member.name}</p>
                          {member.is_primary && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md uppercase">Ketua/Utama</span>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600 font-medium">{member.role}</td>
                    <td className="p-4 text-sm text-gray-500">{member.section || "-"}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => router.push(`/admin/members/form?id=${member.id}`)}
                          className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(member.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Tampilan Mobile (Grid 2 Kolom) */}
        <div className="block md:hidden border-t border-gray-100">
          {loading ? (
            <div className="py-8 text-center text-xs text-gray-400">
              <div className="flex justify-center mb-2"><Loader2 className="animate-spin text-emerald-500" /></div>
              Memuat data anggota...
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-400">
              Belum ada data anggota.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50/30">
              {filteredMembers.map((member) => (
                <div key={member.id} className="bg-white rounded-none border border-gray-100 shadow-sm p-3 flex flex-col justify-between relative">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[8px] font-black text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                        Urutan: {member.sort_order}
                      </span>
                      {member.is_primary && (
                        <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md uppercase">
                          Utama
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs text-white shrink-0 ${member.is_primary ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-md shadow-emerald-500/10' : 'bg-gray-100 text-gray-400'}`}>
                        {member.name.charAt(0)}
                      </div>
                      <p className="font-bold text-xs text-gray-800 line-clamp-1 flex-1">{member.name}</p>
                    </div>
                    <div className="space-y-0.5 mt-1">
                      <p className="text-[9px] text-gray-500 font-bold leading-none">{member.role}</p>
                      <p className="text-[9px] text-gray-400 leading-none">{member.section || "-"}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-1.5 mt-3 pt-2 border-t border-gray-100">
                    <button 
                      onClick={() => router.push(`/admin/members/form?id=${member.id}`)}
                      className="flex-1 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-none text-center flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                      title="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" className="md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                    </button>
                    <button 
                      onClick={() => handleDelete(member.id)}
                      className="flex-1 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-none text-center flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                      title="Hapus"
                    >
                      <Trash2 size={12} className="md:w-4 md:h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
