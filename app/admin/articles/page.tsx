"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Edit, Newspaper, X, Upload, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

export default function AdminArticles() {
  const [items, setItems] = useState<any[] /* eslint-disable-line @typescript-eslint/no-explicit-any */>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", tag: "Berita", description: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  async function fetchItems() {

    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setItems(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchItems();
  }, []);

  async function handleDelete(id: string) {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data artikel akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#10b981",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (!error) {
      Swal.fire({
        title: "Terhapus!",
        text: "Artikel berhasil dihapus.",
        icon: "success",
        confirmButtonColor: "#10b981",
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchItems();
    } else {
      Swal.fire({
        title: "Gagal!",
        text: "Gagal menghapus artikel",
        icon: "error",
        confirmButtonColor: "#10b981",
      });
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile && !editingId) {
      Swal.fire({
        title: "Peringatan",
        text: "Silakan pilih gambar (thumbnail) terlebih dahulu",
        icon: "warning",
        confirmButtonColor: "#10b981",
      });
      return;
    }
    setSubmitLoading(true);

    try {
      let image_url = previewUrl;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `article_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `articles/${fileName}`;
        const { error: uploadError } = await supabase.storage.from("images").upload(filePath, imageFile);
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage.from("images").getPublicUrl(filePath);
        image_url = publicUrlData.publicUrl;
      }

      if (editingId) {
        const { error: updateError } = await supabase.from("articles").update({
          title: formData.title,
          tag: formData.tag,
          description: formData.description,
          image_url: image_url,
        }).eq("id", editingId);

        if (updateError) throw updateError;
        Swal.fire({
          title: "Berhasil!",
          text: "Artikel berhasil diperbarui!",
          icon: "success",
          confirmButtonColor: "#10b981",
        });
      } else {
        const { error: insertError } = await supabase.from("articles").insert({
          title: formData.title,
          tag: formData.tag,
          description: formData.description,
          image_url: image_url,
        });

        if (insertError) throw insertError;
        Swal.fire({
          title: "Berhasil!",
          text: "Artikel berhasil diterbitkan!",
          icon: "success",
          confirmButtonColor: "#10b981",
        });
      }

      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ title: "", tag: "Berita", description: "" });
      setImageFile(null);
      setPreviewUrl(null);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchItems();
    } catch (error: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
      Swal.fire({
        title: "Gagal!",
        text: error.message,
        icon: "error",
        confirmButtonColor: "#10b981",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Manajemen Artikel</h1>
          <p className="text-gray-500 mt-1 text-sm">Kelola berita, artikel, dan tips pertanian.</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ title: "", tag: "Berita", description: "" });
            setImageFile(null);
            setPreviewUrl(null);
            setIsModalOpen(true);
          }}
          className="bg-[#10b981] hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors shadow-md shadow-emerald-500/20"
        >
          <Plus size={18} />
          Tulis Artikel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-gray-400">Loading...</div>
        ) : items.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-3xl border border-gray-100">Belum ada artikel.</div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm flex flex-col group relative">
              <div className="aspect-video bg-gray-100 relative">
                <img src={item.image_url} alt={item.title} className="w-full h-full object-contain p-2" />
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 flex items-center gap-2 transition-opacity">
                  <button 
                    onClick={() => {
                      setEditingId(item.id);
                      setFormData({ title: item.title, tag: item.tag, description: item.description });
                      setPreviewUrl(item.image_url);
                      setImageFile(null);
                      setIsModalOpen(true);
                    }}
                    className="p-2 bg-white/90 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors shadow-sm"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-white/90 text-red-500 hover:bg-red-50 rounded-lg transition-colors shadow-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex gap-2 mb-3">
                  <span className="text-[10px] font-black text-[#10b981] uppercase">{item.tag}</span>
                  <span className="text-[10px] font-bold text-gray-400">
                    â€¢ {new Date(item.created_at).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <h4 className="text-lg font-black text-gray-900 leading-tight mb-2">{item.title}</h4>
                <p className="text-xs text-gray-500 line-clamp-3">{item.description}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Tulis Artikel */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-black text-gray-900">
                {editingId ? "Edit Artikel" : "Tulis Artikel Baru"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Judul Artikel</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Panen Raya Melon Tanggumong"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#10b981] transition-all text-sm"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Kategori / Tag</label>
                <select
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#10b981] transition-all text-sm"
                  value={formData.tag}
                  onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                >
                  <option value="Berita">Berita</option>
                  <option value="Tips & Trik">Tips & Trik</option>
                  <option value="Teknologi">Teknologi</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Isi Artikel</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tuliskan isi artikel..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#10b981] transition-all text-sm resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Thumbnail Artikel</label>
                <div className="mt-2 flex justify-center rounded-2xl border border-dashed border-gray-300 px-6 py-8 hover:bg-gray-50 transition-colors relative cursor-pointer group">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
                  />
                  <div className="text-center">
                    {previewUrl ? (
                      <div className="flex flex-col items-center w-full">
                        <div className="relative w-full h-40 mx-auto rounded-xl overflow-hidden border border-gray-200 group shadow-sm bg-gray-50">
                          <img src={previewUrl} alt="Preview" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-2" />
                          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <Edit className="w-6 h-6 text-white mb-1 drop-shadow-lg" />
                            <span className="text-white text-xs font-bold drop-shadow-lg">Ubah Gambar</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-2 font-medium">Klik gambar untuk mengganti</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="mx-auto h-10 w-10 text-gray-300" />
                        <div className="mt-4 flex text-sm text-gray-600 justify-center">
                          <span className="font-bold text-[#10b981]">Upload a file</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </form>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitLoading}
                className="bg-[#10b981] hover:bg-emerald-600 disabled:bg-emerald-300 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-md shadow-emerald-500/20 flex items-center gap-2"
              >
                {submitLoading ? <Loader2 size={18} className="animate-spin" /> : null}
                Terbitkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


