"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Coffee, X, Upload, Loader2 } from "lucide-react";

export default function AdminOlahan() {
  const [products, setProducts] = useState<any[] /* eslint-disable-line @typescript-eslint/no-explicit-any */>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", price: "", description: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  async function fetchProducts() {

    const { data, error } = await supabase
      .from("olahan")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProducts(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Yakin ingin menghapus produk olahan ini?")) return;
    const { error } = await supabase.from("olahan").delete().eq("id", id);
    if (!error) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchProducts();
    } else {
      alert("Gagal menghapus produk olahan");
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
    setSubmitLoading(true);

    try {
      let image_url = null;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `products/${fileName}`;
        const { error: uploadError } = await supabase.storage.from("image").upload(filePath, imageFile);
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage.from("image").getPublicUrl(filePath);
        image_url = publicUrlData.publicUrl;
      }

      const { error: insertError } = await supabase.from("olahan").insert({
        name: formData.name,
        price: Number(formData.price),
        description: formData.description,
        image_url: image_url,
      });

      if (insertError) throw insertError;
      alert("Produk olahan berhasil ditambahkan!");
      setIsModalOpen(false);
      setFormData({ name: "", price: "", description: "" });
      setImageFile(null);
      setPreviewUrl(null);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchProducts();
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
          <h1 className="text-2xl font-black text-gray-900">Manajemen Hasil Olahan</h1>
          <p className="text-gray-500 mt-1 text-sm">Kelola produk keripik, sirup, dan olahan lainnya</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#10b981] hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors shadow-md shadow-emerald-500/20"
        >
          <Plus size={18} />
          Tambah Olahan
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Produk Olahan</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Harga</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-sm text-gray-400">Loading...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-sm text-gray-400">Belum ada produk olahan.</td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                          {p.image_url ? (
                            <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-emerald-50 flex items-center justify-center text-emerald-200">
                              <Coffee size={24} />
                            </div>
                          )}
                        </div>
                        <div>
                           <span className="font-bold text-sm text-gray-800 block">{p.name}</span>
                           <span className="text-xs text-gray-500 line-clamp-1">{p.description}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-600">
                      Rp {Number(p.price).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleDelete(p.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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

      {/* Modal Tambah Produk */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-black text-gray-900">Tambah Olahan Baru</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Nama Olahan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Keripik Melon Vacuum"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#10b981] transition-all text-sm"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Deskripsi</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Contoh: Keripik renyah dari melon asli tanpa tambahan pemanis buatan."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#10b981] transition-all text-sm resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Harga (Rp)</label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="25000"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#10b981] transition-all text-sm"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Gambar Olahan</label>
                <div className="mt-2 flex justify-center rounded-2xl border border-dashed border-gray-300 px-6 py-8 hover:bg-gray-50 transition-colors relative cursor-pointer">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="text-center">
                    {previewUrl ? (
                      <div className="relative w-32 h-32 mx-auto rounded-xl overflow-hidden border border-gray-200">
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
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


