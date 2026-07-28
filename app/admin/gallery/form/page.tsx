/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Loader2, Save, X } from "lucide-react";
import Swal from "sweetalert2";

function GalleryFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editingId = searchParams.get("id");

  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({ title: "", category: "Galeri Foto" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(!!editingId);
  const [videoError, setVideoError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId) {
      async function fetchItem() {
        const { data, error } = await supabase.from("gallery").select("*").eq("id", editingId).single();
        if (data && !error) {
          setFormData({
            title: data.category === "Video Dokumentasi" ? "" : data.title,
            category: data.category,
          });
          setPreviewUrl(data.image_url);
        } else {
          Swal.fire("Error", "Gagal memuat data galeri", "error");
          router.push("/admin/gallery");
        }
        setPageLoading(false);
      }
      fetchItem();
    }
  }, [editingId, router]);

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
    if (!imageFile && !previewUrl) {
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
      let image_url = previewUrl;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `gallery_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `gallery/${fileName}`;
        
        const { error: uploadError } = await supabase.storage.from("images").upload(filePath, imageFile, {
          contentType: imageFile.type,
          upsert: false
        });
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
          text: "Data foto/video berhasil diperbarui!",
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
          text: "Media berhasil ditambahkan ke galeri!",
          icon: "success",
          confirmButtonColor: "#10b981",
        });
      }
      
      router.push("/admin/gallery");
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
    return <div className="p-8 text-center text-gray-500">Memuat data...</div>;
  }

  const isVideo = formData.category === "Video Dokumentasi" || (imageFile && imageFile.type.startsWith('video/')) || (previewUrl && previewUrl.match(/\.(mp4|webm|ogg|mov)$/i));

  return (
    <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
      <div className="flex items-center gap-3 border-b border-gray-200 pb-4">
        <button 
          onClick={() => router.push('/admin/gallery')}
          className="p-1.5 hover:bg-gray-100 rounded-none transition-colors"
        >
          <ArrowLeft size={18} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-base md:text-xl font-black text-gray-900 leading-tight">
            {editingId ? "Edit Media" : "Upload Media Baru"}
          </h1>
          <p className="text-gray-500 mt-0.5 text-[10px] md:text-xs">Isi detail form di bawah ini</p>
        </div>
      </div>

      <div className="">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {!(editingId && formData.category === "Video Dokumentasi") && (
            <div className={`grid ${formData.category !== "Video Dokumentasi" ? 'grid-cols-2' : 'grid-cols-1'} gap-4 md:gap-5`}>
              {formData.category !== "Video Dokumentasi" && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-800">Judul Foto</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Panen Raya 2024"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm text-slate-700 placeholder-gray-400"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-800">Kategori</label>
                <select
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm text-slate-700"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Galeri Foto">Galeri Foto</option>
                  <option value="Panen">Panen</option>
                  <option value="Video Dokumentasi">Video Dokumentasi</option>
                  <option value="Smart Farming">Smart Farming</option>
                </select>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-800">Upload File</label>
            <input 
              type="file" 
              accept="image/*,video/*"
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
                <span className="text-sm text-gray-400 mt-1 mb-3">Or</span>
                <button type="button" className="px-5 py-2 border border-gray-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-gray-100 transition-colors">
                  Browse
                </button>
              </div>
            ) : (
              <div className="mt-1 flex flex-col items-center justify-center border border-gray-200 rounded-xl px-4 py-8 bg-white relative">
                 <div 
                   className="relative w-full md:w-80 aspect-video mx-auto border border-gray-100 rounded-lg overflow-hidden bg-slate-50 shadow-sm flex items-center justify-center cursor-pointer group"
                   onClick={(e) => {
                     // Prevent click when playing video controls, allow click on the overlay
                     if ((e.target as HTMLElement).tagName.toLowerCase() !== 'video') {
                       fileInputRef.current?.click();
                     }
                   }}
                 >
                    {isVideo ? (
                      <div className="w-full h-full relative group-hover:opacity-75 transition-opacity">
                        <div className="w-full h-full">
                          <video 
                            src={previewUrl!} 
                            className="w-full h-full object-contain bg-slate-900" 
                            controls 
                            onError={() => setVideoError(true)}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full relative group-hover:opacity-50 transition-opacity">
                        <div className="w-full h-full">
                          <img src={previewUrl!} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 pointer-events-none z-10">
                      <span className="text-white bg-black/60 px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-sm backdrop-blur-sm">Ganti Media</span>
                    </div>
                 </div>
                 
                 <div className="w-full mt-6 bg-slate-50 border border-gray-100 rounded-lg p-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700 truncate max-w-[200px] md:max-w-md">
                      {imageFile ? imageFile.name : (isVideo ? `${formData.title ? formData.title.replace(/\s+/g, '-').toLowerCase() : 'video'}-${editingId}.mp4` : `${formData.title ? formData.title.replace(/\s+/g, '-').toLowerCase() : 'gambar'}-${editingId}.png`)}
                    </span>
                    <button 
                      type="button" 
                      onClick={() => {setImageFile(null); setPreviewUrl(null);}}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <X size={16} />
                    </button>
                 </div>
                 
                 {videoError && (
                   <p className="text-xs text-red-500 font-bold mt-2 text-center">Codec video tidak didukung. Mohon upload format MP4 H.264.</p>
                 )}
              </div>
            )}
          </div>

          <div className="pt-2 flex gap-4">
            <button
              type="button"
              onClick={() => router.push('/admin/gallery')}
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
              {editingId ? "Perbarui Media" : "Unggah Media"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default function GalleryFormPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Memuat form...</div>}>
      <GalleryFormContent />
    </Suspense>
  );
}
