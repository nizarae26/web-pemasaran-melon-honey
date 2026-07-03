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
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      <div>
        <h1 className="text-lg md:text-2xl font-black text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1 text-xs md:text-sm">Ringkasan performa dan data terbaru</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        <div className="bg-white p-3 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 md:gap-4">
          <div className="w-9 h-9 md:w-12 md:h-12 bg-emerald-50 text-[#10b981] rounded-xl flex items-center justify-center shrink-0">
            <Package className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <p className="text-[10px] md:text-sm font-bold text-gray-500 uppercase leading-none md:leading-normal">Total Produk</p>
            <p className="text-base md:text-2xl font-black text-gray-900 mt-1 md:mt-0">{productCount}</p>
          </div>
        </div>

        <div className="bg-white p-3 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 md:gap-4">
          <div className="w-9 h-9 md:w-12 md:h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <p className="text-[10px] md:text-sm font-bold text-gray-500 uppercase leading-none md:leading-normal">Kunjungan</p>
            <p className="text-base md:text-2xl font-black text-gray-900 mt-1 md:mt-0">1,204</p>
          </div>
        </div>

        <div className="bg-white p-3 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 md:gap-4 col-span-2 md:col-span-1">
          <div className="w-9 h-9 md:w-12 md:h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <p className="text-[10px] md:text-sm font-bold text-gray-500 uppercase leading-none md:leading-normal">Pelanggan Aktif</p>
            <p className="text-base md:text-2xl font-black text-gray-900 mt-1 md:mt-0">84</p>
          </div>
        </div>
      </div>
    </div>
  );
}
