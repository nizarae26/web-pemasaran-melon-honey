"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Edit, Package, X, Upload, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[] /* eslint-disable-line @typescript-eslint/no-explicit-any */>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", type_melon: "Honey Globe", price: "", stock: "", weight: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  async function fetchProducts() {

    const { data, error } = await supabase
      .from("products")
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
    const result = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data produk akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#10b981",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (!result.isConfirmed) return;

    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) {
      Swal.fire({
        title: "Terhapus!",
        text: "Produk berhasil dihapus.",
        icon: "success",
        confirmButtonColor: "#10b981",
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchProducts();
    } else {
      Swal.fire({
        title: "Gagal!",
        text: "Gagal menghapus produk",
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
        text: "Silakan pilih gambar terlebih dahulu",
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
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `products/${fileName}`;
        const { error: uploadError } = await supabase.storage.from("images").upload(filePath, imageFile);
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage.from("images").getPublicUrl(filePath);
        image_url = publicUrlData.publicUrl;
      }

      if (editingId) {
        const { error: updateError } = await supabase.from("products").update({
          name: formData.name,
          type_melon: formData.type_melon,
          price: Number(formData.price),
          stock: Number(formData.stock),
          weight: formData.weight,
          image_url: image_url,
        }).eq("id", editingId);

        if (updateError) throw updateError;
        Swal.fire({
          title: "Berhasil!",
          text: "Data produk berhasil diperbarui!",
          icon: "success",
          confirmButtonColor: "#10b981",
        });
      } else {
        const { error: insertError } = await supabase.from("products").insert({
          name: formData.name,
          type_melon: formData.type_melon,
          price: Number(formData.price),
          stock: Number(formData.stock),
          weight: formData.weight,
          image_url: image_url,
        });

        if (insertError) throw insertError;
        Swal.fire({
          title: "Berhasil!",
          text: "Produk berhasil ditambahkan!",
          icon: "success",
          confirmButtonColor: "#10b981",
        });
      }

      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ name: "", type_melon: "Honey Globe", price: "", stock: "", weight: "" });
      setImageFile(null);
      setPreviewUrl(null);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchProducts();
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
    <div className="space-y-6 md:space-y-8 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg md:text-2xl font-black text-gray-900">Manajemen Produk</h1>
          <p className="text-gray-500 mt-1 text-xs md:text-sm">Kelola katalog melon Anda</p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ name: "", type_melon: "Honey Globe", price: "", stock: "", weight: "" });
            setImageFile(null);
            setPreviewUrl(null);
            setIsModalOpen(true);
          }}
          className="w-full md:w-auto justify-center bg-[#10b981] hover:bg-emerald-600 text-white px-5 py-2 md:py-2.5 rounded-xl font-bold text-xs md:text-sm flex items-center gap-2 transition-colors shadow-md shadow-emerald-500/20 active:scale-95"
        >
          <Plus size={16} className="md:w-[18px] md:h-[18px]" />
          Tambah Produk
        </button>
      </div>

      {/* Tampilan Desktop (Tabel) */}
      <div className="hidden md:block bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Produk</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Harga</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Stok</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-400">Loading...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-400">Belum ada produk.</td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-100">
                          {p.image_url ? (
                            <img src={p.image_url} alt={p.name} className="w-full h-full object-contain p-1" />
                          ) : (
                            <div className="w-full h-full bg-emerald-50 flex items-center justify-center text-emerald-200">
                              <Package size={24} />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-gray-800">
                            {p.weight ? `${p.name} • ${p.weight}` : p.name}
                          </span>
                          {p.type_melon && (
                            <span className="text-xs text-emerald-600 font-bold mt-0.5">{p.type_melon}</span>
                          )}
                          {p.stock <= 0 && (
                            <span className="text-[10px] text-red-500 font-bold mt-0.5">Sedang Kosong / Pre-Order</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-600">
                      Rp {Number(p.price).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {p.stock > 0 ? `${p.stock} Tersedia` : 'Habis'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            setEditingId(p.id);
                            setFormData({ 
                              name: p.name, 
                              type_melon: p.type_melon || "Honey Globe", 
                              price: String(p.price), 
                              stock: String(p.stock),
                              weight: p.weight || ""
                            });
                            setPreviewUrl(p.image_url);
                            setImageFile(null);
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                        >
                          <Edit size={16} />
                        </button>
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

      {/* Tampilan Mobile (Grid 2 Kolom) */}
      <div className="block md:hidden">
        {loading ? (
          <div className="py-12 text-center text-xs text-gray-400">Loading...</div>
        ) : products.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-400 bg-white rounded-2xl border border-gray-100">Belum ada produk.</div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col p-2.5 relative justify-between">
                <div>
                  <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden mb-2 border border-gray-50 flex items-center justify-center relative shrink-0">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-contain p-1" />
                    ) : (
                      <span className="text-xl">🍈</span>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-xs text-gray-800 line-clamp-1">
                      {p.name}
                    </span>
                    {p.weight && (
                      <span className="text-[10px] text-gray-400 font-bold mt-0.5">{p.weight}</span>
                    )}
                    {p.type_melon && (
                      <span className="text-[10px] text-emerald-600 font-bold mt-0.5">{p.type_melon}</span>
                    )}
                    <span className="text-xs font-black text-gray-900 mt-1">
                      Rp {Number(p.price).toLocaleString('id-ID')}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold w-fit mt-1.5 ${p.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                      {p.stock > 0 ? `${p.stock} Pcs` : 'Habis'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-1.5 mt-3 pt-2 border-t border-gray-100">
                  <button 
                    onClick={() => {
                      setEditingId(p.id);
                      setFormData({ 
                        name: p.name, 
                        type_melon: p.type_melon || "Honey Globe", 
                        price: String(p.price), 
                        stock: String(p.stock),
                        weight: p.weight || ""
                      });
                      setPreviewUrl(p.image_url);
                      setImageFile(null);
                      setIsModalOpen(true);
                    }}
                    className="flex-1 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-lg text-center flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                  >
                    <Edit size={12} />
                  </button>
                  <button 
                    onClick={() => handleDelete(p.id)}
                    className="flex-1 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-center flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Tambah Produk */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-black text-gray-900">
                {editingId ? "Edit Produk" : "Tambah Produk Baru"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Nama Produk</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Melon Premium Grade A"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#10b981] transition-all text-sm"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Jenis Melon</label>
                <select
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#10b981] transition-all text-sm"
                  value={formData.type_melon}
                  onChange={(e) => setFormData({ ...formData, type_melon: e.target.value })}
                >
                  <option value="Honey Globe">Honey Globe</option>
                  <option value="Golden Apollo">Golden Apollo</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Harga (Rp)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="35000"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#10b981] transition-all text-sm"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Stok</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="100"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#10b981] transition-all text-sm"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Berat</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 1.5 kg"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#10b981] transition-all text-sm"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Gambar Produk</label>
                <div className="mt-2 flex justify-center rounded-2xl border border-dashed border-gray-300 px-6 py-8 hover:bg-gray-50 transition-colors relative cursor-pointer group">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
                  />
                  <div className="text-center">
                    {previewUrl ? (
                      <div className="flex flex-col items-center">
                        <div className="relative w-32 h-32 mx-auto rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50">
                          <img src={previewUrl} alt="Preview" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 p-2" />
                          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Edit className="w-6 h-6 text-white mb-1 drop-shadow-lg" />
                            <span className="text-white text-xs font-bold drop-shadow-lg">Ubah Gambar</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-2 font-medium">Klik kotak ini untuk mengganti</p>
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


