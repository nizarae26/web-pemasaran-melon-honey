"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Image as ImageIcon, X, Upload, Loader2 } from "lucide-react";

export default function AdminGallery() {
  const [items, setItems] = useState<any[] /* eslint-disable-line @typescript-eslint/no-explicit-any */>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({ title: "", category: "Galeri Foto" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  async function fetchItems() {

    const { data, error } = await supabase
      .from("gallery")
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
    if (!confirm("Yakin ingin menghapus foto ini?")) return;
    const { error } = await supabase.from("gallery").delete().eq("id", id);
    if (!error) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchItems();
    } else {
      alert("Gagal menghapus foto");
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
    if (!imageFile) return alert("Silakan pilih gambar terlebih dahulu");
    setSubmitLoading(true);

    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `gallery_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `gallery/${fileName}`;
      
      const { error: uploadError } = await supabase.storage.from("image").upload(filePath, imageFile);
      if (uploadError) throw uploadError;
      
      const { data: publicUrlData } = supabase.storage.from("image").getPublicUrl(filePath);
      const image_url = publicUrlData.publicUrl;

      const { error: insertError } = await supabase.from("gallery").insert({
        title: formData.title,
        category: formData.category,
        image_url: image_url,
      });

      if (insertError) throw insertError;
      alert("Foto berhasil ditambahkan ke galeri!");
      setIsModalOpen(false);
      setFormData({ title: "", category: "Galeri Foto" });
      setImageFile(null);
      setPreviewUrl(null);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchItems();
    } catch (error: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
      alert(`Gagal: ${error.message}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Upload Galeri</h1>
          <p className="text-gray-500 mt-1 text-sm">Kelola foto-foto kegiatan dan dokumentasi.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#10b981] hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors shadow-md shadow-emerald-500/20"
        >
          <Plus size={18} />
          Upload Foto
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-gray-400">Loading...</div>
        ) : items.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-3xl border border-gray-100">Belum ada foto galeri.</div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group">
              <div className="aspect-square bg-gray-100 relative">
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="absolute top-2 right-2 p-2 bg-white/90 text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
                <div className="absolute top-2 left-2">
                  <span className="bg-white/90 backdrop-blur-md text-[10px] font-black px-2 py-1 rounded-md text-[#064e3b] uppercase">
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-sm text-gray-800 line-clamp-1">{item.title}</h3>
                <p className="text-xs text-gray-400 mt-1">{new Date(item.created_at).toLocaleDateString('id-ID')}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Tambah Galeri */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-black text-gray-900">Upload Foto Baru</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Judul Foto</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Panen Raya 2024"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#10b981] transition-all text-sm"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Kategori</label>
                <select
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#10b981] transition-all text-sm"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Galeri Foto">Galeri Foto</option>
                  <option value="Panen">Panen</option>
                  <option value="Pelatihan">Pelatihan</option>
                  <option value="Smart Farming">Smart Farming</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">File Foto</label>
                <div className="mt-2 flex justify-center rounded-2xl border border-dashed border-gray-300 px-6 py-8 hover:bg-gray-50 transition-colors relative cursor-pointer">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="text-center">
                    {previewUrl ? (
                      <div className="relative w-full h-40 mx-auto rounded-xl overflow-hidden border border-gray-200">
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
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
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


