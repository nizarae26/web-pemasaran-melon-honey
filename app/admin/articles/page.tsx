/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Edit } from "lucide-react";
import Swal from "sweetalert2";

export default function AdminArticles() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-6 md:space-y-8 relative">
      <div className="flex flex-row items-center justify-between gap-3 md:gap-4">
        <div>
          <h1 className="text-lg md:text-2xl font-black text-gray-900 tracking-tight leading-tight">Manajemen Artikel</h1>
          <p className="text-gray-500 mt-0.5 text-xs md:text-sm">Kelola berita, artikel, dan tips pertanian.</p>
        </div>
        <button
          onClick={() => router.push('/admin/articles/form')}
          className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <Plus size={16} />
          <span>Tulis Artikel</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
        {loading ? (
          <div className="col-span-full py-12 text-center text-xs text-gray-400">Memuat artikel...</div>
        ) : items.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-gray-400 bg-white rounded-2xl border border-gray-100 shadow-2xs">Belum ada artikel terbit.</div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-2xs hover:shadow-xs overflow-hidden flex flex-col justify-between group transition-all">
              <div>
                <div className="aspect-video bg-gray-50 relative overflow-hidden group/media">
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                
                <div className="p-3.5 pb-1">
                  <div className="flex gap-1.5 md:gap-2 mb-2 items-center">
                    {item.tag && (
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-100/60 text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {item.tag}
                      </span>
                    )}
                    <span className="text-[9px] md:text-[10px] font-bold text-gray-400">
                      • {new Date(item.created_at).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm md:text-base text-gray-800 line-clamp-2 leading-snug">{item.title}</h3>
                  <p className="text-[10.5px] md:text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                </div>
              </div>
                
              <div className="flex gap-1.5 p-3.5 pt-2 mt-auto">
                <button 
                  onClick={() => router.push(`/admin/articles/form?id=${item.id}`)}
                  className="flex-1 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer active:scale-95 transition-all"
                  title="Edit Artikel"
                >
                  <Edit size={13} />
                  <span>Edit</span>
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="flex-1 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer active:scale-95 transition-all"
                  title="Hapus Artikel"
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
