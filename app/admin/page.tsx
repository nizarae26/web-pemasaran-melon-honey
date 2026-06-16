"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Package, TrendingUp, Users } from "lucide-react";

export default function AdminDashboard() {
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    async function fetchStats() {
      const { count } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });
      
      setProductCount(count || 0);
    }
    fetchStats();
  }, []);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1 text-sm">Ringkasan performa dan data terbaru</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-[#10b981] rounded-xl flex items-center justify-center shrink-0">
            <Package size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase">Total Produk</p>
            <p className="text-2xl font-black text-gray-900">{productCount}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase">Total Kunjungan</p>
            <p className="text-2xl font-black text-gray-900">1,204</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center shrink-0">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase">Pelanggan Aktif</p>
            <p className="text-2xl font-black text-gray-900">84</p>
          </div>
        </div>
      </div>
    </div>
  );
}
