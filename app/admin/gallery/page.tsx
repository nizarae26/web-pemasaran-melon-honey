"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Edit, Image as ImageIcon, X, Upload, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

export default function AdminGallery() {
  const [items, setItems] = useState<any[] /* eslint-disable-line @typescript-eslint/no-explicit-any */>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", category: "Galeri Foto" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [videoError, setVideoError] = useState(false);

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
    const result = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data foto akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#10b981",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    const { error } = await supabase.from("gallery").delete().eq("id", id);
    if (!error) {
      Swal.fire({
        title: "Terhapus!",
        text: "Foto berhasil dihapus.",
        icon: "success",
        confirmButtonColor: "#10b981",
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchItems();
    } else {
      Swal.fire({
        title: "Gagal!",
        text: "Gagal menghapus foto",
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
      setVideoError(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile && !editingId) {
      Swal.fire({
        title: "Peringatan",
        text: `Silakan pilih file ${formData.category === "Video Dokumentasi" ? "video" : "gambar"} terlebih dahulu`,
        icon: "warning",
        confirmButtonColor: "#10b981",
      });
      return;
    }
    setSubmitLoading(true);

    try {
      let image_url = previewUrl; // Use existing image if not uploading a new one
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `gallery_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `gallery/${fileName}`;
        
        const { error: uploadError } = await supabase.storage.from("images").upload(filePath, imageFile);
        if (uploadError) throw uploadError;
        
        const { data: publicUrlData } = supabase.storage.from("images").getPublicUrl(filePath);
        image_url = publicUrlData.publicUrl;
      }

      if (editingId) {
        const { error: updateError } = await supabase.from("gallery").update({
          title: formData.category === "Video Dokumentasi" ? "Video" : formData.title,
          category: formData.category,
          image_url: image_url,
        }).eq("id", editingId);
        
        if (updateError) throw updateError;
        Swal.fire({
          title: "Berhasil!",
          text: "Data foto berhasil diperbarui!",
          icon: "success",
          confirmButtonColor: "#10b981",
        });
      } else {
        const { error: insertError } = await supabase.from("gallery").insert({
          title: formData.category === "Video Dokumentasi" ? "Video" : formData.title,
          category: formData.category,
          image_url: image_url,
        });

        if (insertError) throw insertError;
        Swal.fire({
          title: "Berhasil!",
          text: "Foto berhasil ditambahkan ke galeri!",
          icon: "success",
          confirmButtonColor: "#10b981",
        });
      }
      
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ title: "", category: "Galeri Foto" });
      setImageFile(null);
      setPreviewUrl(null);
      setVideoError(false);
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
          <h1 className="text-2xl font-black text-gray-900">Upload Galeri</h1>
          <p className="text-gray-500 mt-1 text-sm">Kelola foto dan video kegiatan serta dokumentasi.</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ title: "", category: "Galeri Foto" });
            setImageFile(null);
            setPreviewUrl(null);
            setVideoError(false);
            setIsModalOpen(true);
          }}
          className="bg-[#10b981] hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors shadow-md shadow-emerald-500/20"
        >
          <Plus size={18} />
          Upload Media
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
                {item.category === "Video Dokumentasi" ? (
                  <video src={item.image_url} className="w-full h-full object-cover" />
                ) : (
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-contain p-2" />
                )}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                  <button 
                    onClick={() => {
                      setEditingId(item.id);
                      setFormData({ title: item.title, category: item.category });
                      setPreviewUrl(item.image_url);
                      setImageFile(null);
                      setVideoError(false);
                      setIsModalOpen(true);
                    }}
                    className="p-2 bg-white/90 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-white/90 text-red-500 hover:bg-red-50 rounded-lg transition-colors shadow-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
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
              <h2 className="text-lg font-black text-gray-900">
                {editingId ? "Edit Media" : "Upload Media Baru"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
              {formData.category !== "Video Dokumentasi" && (
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
              )}

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Kategori</label>
                <select
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#10b981] transition-all text-sm"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Galeri Foto">Galeri Foto</option>
                  <option value="Panen">Panen</option>
                  <option value="Video Dokumentasi">Video Dokumentasi</option>
                  <option value="Smart Farming">Smart Farming</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">{formData.category === "Video Dokumentasi" ? "File Video" : "File Foto"}</label>
                <div className="mt-2 flex justify-center rounded-2xl border border-dashed border-gray-300 px-6 py-8 hover:bg-gray-50 transition-colors relative cursor-pointer group">
                  <input 
                    type="file" 
                    accept="image/*,video/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
                  />
                  <div className="text-center w-full">
                    {previewUrl ? (
                      <div className="flex flex-col items-center w-full">
                        <div className="relative w-full h-40 mx-auto rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50 flex items-center justify-center">
                          {imageFile?.type.startsWith('video/') || formData.category === "Video Dokumentasi" ? (
                            <div className="relative w-full h-full bg-gray-900 flex flex-col items-center justify-center">
                              <video 
                                src={previewUrl} 
                                className="w-full h-full object-contain p-2" 
                                controls 
                                onError={() => setVideoError(true)}
                              />
                              {videoError && (
                                <div className="absolute inset-0 bg-red-950/95 flex flex-col items-center justify-center p-4 text-center z-30">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white mb-1"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                  <p className="text-[10px] text-white font-bold leading-tight">Codec Tidak Didukung</p>
                                  <p className="text-[9px] text-red-200 mt-1 leading-snug">Format HEVC/H.265 HP tidak didukung browser. Gunakan format MP4 H.264 standar.</p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-2" />
                          )}
                          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <Edit className="w-6 h-6 text-white mb-1 drop-shadow-lg" />
                            <span className="text-white text-xs font-bold drop-shadow-lg">Ubah File</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-2 font-medium">Klik kotak ini untuk mengganti file</p>
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


