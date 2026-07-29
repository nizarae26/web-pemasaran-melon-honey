/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Edit, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

export default function AdminGallery() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Render UI

  return (
    <div className="space-y-6 md:space-y-8 relative">
      <div className="flex flex-row items-center justify-between gap-2 md:gap-4">
        <div>
          <h1 className="text-base md:text-2xl font-black text-gray-900 leading-tight">Upload Galeri</h1>
          <p className="text-gray-500 mt-0.5 text-[10px] md:text-sm">Kelola foto dan video kegiatan serta dokumentasi.</p>
        </div>
        <button
          onClick={() => router.push('/admin/gallery/form')}
          className="shrink-0 bg-[#10b981] hover:bg-emerald-600 text-white px-3 py-2 md:px-5 md:py-2.5 rounded-none font-bold text-[10px] md:text-sm flex items-center gap-1.5 transition-colors shadow-sm active:scale-95"
        >
          <Plus size={14} className="md:w-[18px] md:h-[18px]" />
          Unggah Media
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-xs text-gray-400">Memuat...</div>
        ) : items.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-gray-400 bg-white border border-gray-100">Belum ada foto galeri.</div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="bg-white rounded-none border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between group">
              <div>
                <div className="aspect-square bg-gray-50 relative overflow-hidden group/media">
                  {item.image_url?.match(/\.(mp4|webm|ogg|mov)$/i) || item.category === "Video Dokumentasi" ? (
                    <div className="w-full h-full">
                      <video 
                        src={item.image_url} 
                        className="w-full h-full object-cover bg-slate-900" 
                        controls 
                        preload="metadata"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full">
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-contain p-2" />
                    </div>
                  )}


                </div>
                
                <div className="flex flex-col min-w-0 p-3 pb-1">
                  <h3 className="font-bold text-sm md:text-base text-gray-800 line-clamp-1">{item.title}</h3>
                </div>
                  
                <div className="flex gap-1.5 p-3 pt-2 mt-auto">
                  <button 
                    onClick={() => router.push(`/admin/gallery/form?id=${item.id}`)}
                    className="flex-1 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 rounded-none text-center flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                    title="Edit"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" className="md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-none text-center flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
                    title="Hapus"
                  >
                    <Trash2 size={12} className="md:w-4 md:h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


