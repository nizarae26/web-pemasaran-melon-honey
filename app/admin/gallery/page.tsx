/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Edit } from "lucide-react";
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
    fetchItems();
  }, []);

  async function handleDelete(id: string) {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data foto/video akan dihapus secara permanen!",
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
        text: "Media berhasil dihapus.",
        icon: "success",
        confirmButtonColor: "#10b981",
      });
      fetchItems();
    } else {
      Swal.fire({
        title: "Gagal!",
        text: "Gagal menghapus media",
        icon: "error",
        confirmButtonColor: "#10b981",
      });
    }
  }

  return (
    <div className="space-y-6 md:space-y-8 relative">
      <div className="flex flex-row items-center justify-between gap-3 md:gap-4">
        <div>
          <h1 className="text-lg md:text-2xl font-black text-gray-900 tracking-tight leading-tight">Upload Galeri</h1>
          <p className="text-gray-500 mt-0.5 text-xs md:text-sm">Kelola foto dan video kegiatan serta dokumentasi.</p>
        </div>
        <button
          onClick={() => router.push('/admin/gallery/form')}
          className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <Plus size={16} />
          <span>Unggah Media</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
        {loading ? (
          <div className="col-span-full py-12 text-center text-xs text-gray-400">Memuat galeri...</div>
        ) : items.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-gray-400 bg-white rounded-2xl border border-gray-100 shadow-2xs">Belum ada media galeri.</div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-2xs hover:shadow-xs overflow-hidden flex flex-col justify-between group transition-all">
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
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  )}

                  {item.category && (
                    <div className="absolute top-2 left-2 z-10 pointer-events-none">
                      <span className="bg-white/95 backdrop-blur-xs text-[9px] font-bold text-emerald-800 px-2 py-0.5 rounded-md shadow-xs border border-emerald-100/50">
                        {item.category}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-3 pb-1">
                  <h3 className="font-bold text-xs md:text-sm text-gray-800 line-clamp-2 leading-snug">{item.title}</h3>
                </div>
              </div>
                
              <div className="flex gap-1.5 p-3 pt-2 mt-auto">
                <button 
                  onClick={() => router.push(`/admin/gallery/form?id=${item.id}`)}
                  className="flex-1 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer active:scale-95 transition-all"
                  title="Edit Media"
                >
                  <Edit size={13} />
                  <span>Edit</span>
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="flex-1 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer active:scale-95 transition-all"
                  title="Hapus Media"
                >
                  <Trash2 size={13} />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


