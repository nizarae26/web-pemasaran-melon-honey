/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Edit, Upload, Loader2, Save, X } from "lucide-react";
import Swal from "sweetalert2";

function ProductFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editingId = searchParams.get("id");

  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", type_melon: "Honey Globe", price: "", weight: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(!!editingId);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId) {
      async function fetchProduct() {
        const { data, error } = await supabase.from("products").select("*").eq("id", editingId).single();
        if (data && !error) {
          setFormData({
            name: data.name,
            type_melon: data.type_melon || "Honey Globe",
            price: String(data.price),
            weight: data.weight || ""
          });
          setPreviewUrl(data.image_url);
        } else {
          Swal.fire("Error", "Gagal memuat data produk", "error");
          router.push("/admin/products");
        }
        setPageLoading(false);
      }
      fetchProduct();
    }
  }, [editingId, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile && !previewUrl) {
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

      router.push("/admin/products");
    } catch (error: any) {
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

  if (pageLoading) {
    return <div className="p-8 text-center text-gray-500">Memuat data produk...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
      <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
        <button 
          onClick={() => router.push('/admin/products')}
          className="p-1.5 hover:bg-gray-100 rounded-none transition-colors"
        >
          <ArrowLeft size={18} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-base md:text-xl font-black text-gray-900 leading-tight">
            {editingId ? "Edit Produk" : "Tambah Produk Baru"}
          </h1>
          <p className="text-gray-500 mt-0.5 text-[10px] md:text-xs">Isi detail form di bawah ini</p>
        </div>
      </div>

      <div className="">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="grid grid-cols-2 gap-4 md:gap-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800">Nama Produk</label>
              <input
                type="text"
                required
                placeholder="Contoh: Melon Premium"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm text-slate-700 placeholder-gray-400"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800">Jenis Melon</label>
              <select
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm text-slate-700"
                value={formData.type_melon}
                onChange={(e) => setFormData({ ...formData, type_melon: e.target.value })}
              >
                <option value="Honey Globe">Honey Globe</option>
                <option value="Golden Apollo">Golden Apollo</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800">Harga (Rp)</label>
              <input
                type="number"
                required
                min="0"
                placeholder="35000"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm text-slate-700 placeholder-gray-400"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800">Berat</label>
              <input
                type="text"
                required
                placeholder="Contoh: 1.5 kg"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm text-slate-700 placeholder-gray-400"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-800">Upload File</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="hidden"
            />
            {!imageFile && !previewUrl ? (
              <div 
                className="mt-1 flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-xl px-4 py-10 bg-white hover:bg-slate-50 transition-colors relative cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="text-base font-black text-slate-800">Drop files here</span>
              </div>
            ) : (
              <div className="mt-1 flex flex-col items-center justify-center border border-gray-200 rounded-xl px-4 py-8 bg-white relative">
                 <div 
                   className="relative w-32 h-32 mx-auto border border-gray-100 rounded-lg overflow-hidden bg-slate-50 shadow-sm cursor-pointer group"
                   onClick={() => fileInputRef.current?.click()}
                 >
                    <div className="w-full h-full">
                      <img src={previewUrl!} alt="Preview" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <span className="text-white bg-black/60 px-2 py-1 rounded text-[10px] font-bold">Ganti Foto</span>
                    </div>
                 </div>
                 
                 <div className="w-full mt-6 bg-slate-50 border border-gray-100 rounded-lg p-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700 truncate max-w-[200px] md:max-w-md">
                      {imageFile ? imageFile.name : `${formData.name ? formData.name.replace(/\s+/g, '-').toLowerCase() : 'gambar'}-${editingId}.png`}
                    </span>
                    <button 
                      type="button" 
                      onClick={() => {setImageFile(null); setPreviewUrl(null);}}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <X size={16} />
                    </button>
                 </div>
              </div>
            )}
          </div>

          <div className="pt-2 flex gap-4">
            <button
              type="button"
              onClick={() => router.push('/admin/products')}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white px-5 py-3.5 rounded-none font-bold text-sm transition-colors shadow-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              className="flex-1 bg-[#10b981] hover:bg-emerald-600 disabled:bg-emerald-300 text-white px-5 py-3.5 rounded-none font-bold text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              {submitLoading ? <Loader2 size={16} className="animate-spin" /> : null}
              {editingId ? "Perbarui Produk" : "Tambah Produk"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default function ProductFormPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Memuat form...</div>}>
      <ProductFormContent />
    </Suspense>
  );
}
