"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Swal from "sweetalert2";
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Loader2,
  X
} from "lucide-react";

export default function MembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    section: "",
    description: "",
    is_primary: false,
    sort_order: 0,
  });

  useEffect(() => {
    fetchMembers();
  }, []);

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

  const handleOpenModal = (member: any = null) => {
    if (member) {
      setEditingId(member.id);
      setFormData({
        name: member.name || "",
        role: member.role || "",
        section: member.section || "",
        description: member.description || "",
        is_primary: member.is_primary || false,
        sort_order: member.sort_order || 0,
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        role: "",
        section: "",
        description: "",
        is_primary: false,
        sort_order: members.length > 0 ? Math.max(...members.map(m => m.sort_order || 0)) + 1 : 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    if (editingId) {
      const { error } = await supabase
        .from("members")
        .update(formData)
        .eq("id", editingId);
        
      if (error) {
        Swal.fire({
          title: "Gagal!",
          text: "Gagal memperbarui: " + error.message,
          icon: "error",
          confirmButtonColor: "#10b981",
        });
      } else {
        Swal.fire({
          title: "Berhasil!",
          text: "Data anggota berhasil diperbarui!",
          icon: "success",
          confirmButtonColor: "#10b981",
        });
        fetchMembers();
        handleCloseModal();
      }
    } else {
      const { error } = await supabase
        .from("members")
        .insert([formData]);
        
      if (error) {
        Swal.fire({
          title: "Gagal!",
          text: "Gagal menambahkan: " + error.message,
          icon: "error",
          confirmButtonColor: "#10b981",
        });
      } else {
        Swal.fire({
          title: "Berhasil!",
          text: "Anggota baru berhasil ditambahkan!",
          icon: "success",
          confirmButtonColor: "#10b981",
        });
        fetchMembers();
        handleCloseModal();
      }
    }
    setSaving(false);
  };

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
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight flex items-center gap-3">
            <Users className="text-[#10b981]" /> Keanggotaan
          </h1>
          <p className="text-gray-500 mt-2">
            Kelola struktur organisasi dan anggota Kelompok Tani Banyu Urip.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-[#10b981] text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20 active:scale-95"
        >
          <Plus size={20} />
          <span>Tambah Anggota</span>
        </button>
      </div>

      <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden mb-8">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari anggota, peran, atau seksi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#10b981] focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
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
                          onClick={() => handleOpenModal(member)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
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
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl my-auto overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-black text-gray-800">
                {editingId ? "Edit Anggota" : "Tambah Anggota Baru"}
              </h3>
              <button 
                onClick={handleCloseModal}
                className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#10b981] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Jabatan / Peran</label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#10b981] transition-all"
                    placeholder="Contoh: Ketua, Sekretaris, Anggota"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Seksi / Bidang (Opsional)</label>
                  <input
                    type="text"
                    value={formData.section}
                    onChange={(e) => setFormData({...formData, section: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#10b981] transition-all"
                    placeholder="Contoh: Seksi Pemasaran"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Urutan Tampil (Angka)</label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value)})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#10b981] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Deskripsi Tugas (Opsional)</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#10b981] transition-all"
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <input
                  type="checkbox"
                  id="is_primary"
                  checked={formData.is_primary}
                  onChange={(e) => setFormData({...formData, is_primary: e.target.checked})}
                  className="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                />
                <label htmlFor="is_primary" className="text-sm font-bold text-emerald-900 select-none cursor-pointer">
                  Tandai sebagai Pengurus Inti / Ketua
                  <p className="text-xs font-normal text-emerald-700 mt-0.5">Akan ditampilkan menonjol di halaman Profil (Kartu Hijau Besar).</p>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-[#10b981] text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors shadow-md shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
