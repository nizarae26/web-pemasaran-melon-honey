/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Swal from "sweetalert2";
import { 
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

const isFemale = (name: string) => {
  if (!name) return false;
  const femaleKeywords = ['AMINATUS', 'SALAWATI', 'JANNAH', 'HAYATI', 'MARIHA', 'SITI', 'ELIYUN', 'FATIMAH', 'NUR HAYATI', 'NUR JANNAH', 'PUTRI', 'AYU', 'DEWI', 'WATI'];
  const upper = name.toUpperCase();
  return femaleKeywords.some(kw => upper.includes(kw));
};

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
    fetchMembers();
  }, []);

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
    <div className="space-y-6 md:space-y-8 relative">
      <div className="flex flex-row items-center justify-between gap-3 md:gap-4">
        <div>
          <h1 className="text-lg md:text-2xl font-black text-gray-900 tracking-tight leading-tight">Keanggotaan</h1>
          <p className="text-gray-500 mt-0.5 text-xs md:text-sm">Kelola struktur organisasi dan anggota Kelompok Tani Banyu Urip.</p>
        </div>
        <button
          onClick={() => router.push('/admin/members/form')}
          className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <Plus size={16} />
          <span>Tambah Anggota</span>
        </button>
      </div>

      {/* Standalone Search Bar */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input
          type="text"
          placeholder="Cari anggota, peran, atau seksi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-2xs"
        />
      </div>

      {/* Tampilan Desktop (Tabel) */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 text-gray-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-bold border-b border-gray-100 w-16 text-center">Urutan</th>
                <th className="p-4 font-bold border-b border-gray-100">Nama</th>
                <th className="p-4 font-bold border-b border-gray-100">Jabatan / Peran</th>
                <th className="p-4 font-bold border-b border-gray-100">Seksi / Bidang</th>
                <th className="p-4 font-bold border-b border-gray-100 w-32 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-400">
                    <div className="flex justify-center mb-2"><Loader2 className="animate-spin text-emerald-500" /></div>
                    Memuat data anggota...
                  </td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-sm text-gray-400">
                    Belum ada data anggota terdaftar.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 text-center text-sm font-bold text-gray-400">{member.sort_order}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl shrink-0 ${member.is_primary ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-md shadow-emerald-500/20' : 'bg-gray-100 border border-gray-200/60'}`}>
                          {isFemale(member.name) ? "🧕" : "🧑‍🌾"}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-gray-800">{member.name}</p>
                          {member.is_primary && <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md uppercase">Ketua/Utama</span>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600 font-medium">{member.role}</td>
                    <td className="p-4 text-sm text-gray-500">{member.section || "-"}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => router.push(`/admin/members/form?id=${member.id}`)}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-xl transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(member.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tampilan Mobile (Grid 2 Kolom Tanpa Card Belakang) */}
      <div className="block md:hidden">
        {loading ? (
          <div className="py-12 text-center text-xs text-gray-400">
            <div className="flex justify-center mb-2"><Loader2 className="animate-spin text-emerald-500" /></div>
            Memuat data anggota...
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-400 bg-white rounded-2xl border border-gray-100 shadow-2xs">
            Belum ada data anggota terdaftar.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredMembers.map((member) => (
              <div key={member.id} className="bg-white rounded-2xl border border-gray-100 shadow-2xs hover:shadow-xs p-3.5 flex flex-col justify-between transition-all">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] font-bold text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                      Urutan: {member.sort_order}
                    </span>
                    {member.is_primary && (
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100/60 px-1.5 py-0.5 rounded-md uppercase">
                        Utama
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-lg shrink-0 ${member.is_primary ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-md shadow-emerald-500/10' : 'bg-gray-100 border border-gray-200/60'}`}>
                      {isFemale(member.name) ? "🧕" : "🧑‍🌾"}
                    </div>
                    <p className="font-bold text-xs text-gray-800 line-clamp-2 leading-tight flex-1">{member.name}</p>
                  </div>
                  <div className="space-y-0.5 mt-1.5">
                    <p className="text-[10px] text-emerald-700 font-bold leading-tight">{member.role}</p>
                    <p className="text-[9.5px] text-gray-400 leading-tight">{member.section || "-"}</p>
                  </div>
                </div>
                
                <div className="flex gap-1.5 mt-3 pt-2.5 border-t border-gray-100">
                  <button 
                    onClick={() => router.push(`/admin/members/form?id=${member.id}`)}
                    className="flex-1 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer active:scale-95 transition-all"
                    title="Edit"
                  >
                    <Edit size={13} />
                    <span>Edit</span>
                  </button>
                  <button 
                    onClick={() => handleDelete(member.id)}
                    className="flex-1 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer active:scale-95 transition-all"
                    title="Hapus"
                  >
                    <Trash2 size={13} />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
