/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Edit, Package } from "lucide-react";
import Swal from "sweetalert2";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const router = useRouter();

  return (
    <div className="space-y-6 md:space-y-8 relative">
      <div className="flex flex-row items-center justify-between gap-3 md:gap-4">
        <div>
          <h1 className="text-lg md:text-2xl font-black text-gray-900 tracking-tight leading-tight">Manajemen Produk</h1>
          <p className="text-gray-500 mt-0.5 text-xs md:text-sm">Kelola katalog dan varian melon Anda.</p>
        </div>
        <button
          onClick={() => router.push("/admin/products/form")}
          className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <Plus size={16} />
          <span>Tambah Produk</span>
        </button>
      </div>

      {/* Tampilan Desktop (Tabel) */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Produk</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Harga</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-sm text-gray-400">Memuat produk...</td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-sm text-gray-400">Belum ada produk terdaftar.</td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gray-50 overflow-hidden shrink-0 border border-gray-100 p-1 flex items-center justify-center">
                          {p.image_url ? (
                            <img src={p.image_url} alt={p.name} className="w-full h-full object-contain" />
                          ) : (
                            <Package size={22} className="text-emerald-500" />
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-sm text-gray-800">
                            {p.weight ? `${p.name} • ${p.weight}` : p.name}
                          </span>
                          {p.type_melon && (
                            <span className="text-xs text-emerald-600 font-semibold mt-0.5">{p.type_melon}</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-gray-800">
                      Rp {Number(p.price).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => router.push(`/admin/products/form?id=${p.id}`)}
                          className="p-2 text-amber-600 hover:bg-amber-50 rounded-xl transition-colors cursor-pointer"
                          title="Edit Produk"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(p.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                          title="Hapus Produk"
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

      {/* Tampilan Mobile (Grid 2 Kolom Modern) */}
      <div className="block md:hidden">
        {loading ? (
          <div className="py-12 text-center text-xs text-gray-400">Memuat produk...</div>
        ) : products.length === 0 ? (
          <div className="py-12 text-center text-xs text-gray-400 bg-white rounded-2xl border border-gray-100 shadow-2xs">Belum ada produk terdaftar.</div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-2xs hover:shadow-xs overflow-hidden flex flex-col justify-between transition-all">
                <div>
                  <div className="aspect-square bg-gray-50/70 relative overflow-hidden flex items-center justify-center p-3 border-b border-gray-50">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-3xl">🍈</span>
                    )}
                  </div>
                  <div className="p-3 pb-1">
                    <span className="font-bold text-xs text-gray-800 line-clamp-2 leading-snug">
                      {p.weight ? `${p.name} (${p.weight})` : p.name}
                    </span>
                    {p.type_melon && (
                      <span className="text-[10px] text-emerald-600 font-bold block mt-1">{p.type_melon}</span>
                    )}
                    <span className="text-xs font-black text-gray-900 block mt-2">
                      Rp {Number(p.price).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <div className="flex gap-1.5 p-3 pt-2">
                  <button 
                    onClick={() => router.push(`/admin/products/form?id=${p.id}`)}
                    className="flex-1 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer active:scale-95 transition-all"
                  >
                    <Edit size={13} />
                    <span>Edit</span>
                  </button>
                  <button 
                    onClick={() => handleDelete(p.id)}
                    className="flex-1 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer active:scale-95 transition-all"
                  >
                    <Trash2 size={13} />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
