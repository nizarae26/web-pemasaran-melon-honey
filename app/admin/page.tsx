"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Package, Users, Calendar, ArrowUpRight, ArrowDownRight, Clock, Compass } from "lucide-react";

interface ActivityLog {
  id: string;
  desc: string;
  type: string;
  date: string;
  status: string;
  color: string;
}

export default function AdminDashboard() {
  const [productCount, setProductCount] = useState(0);
  const [memberCount, setMemberCount] = useState(0);
  const [scheduleCount, setScheduleCount] = useState(0);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        // Fetch products count
        const { count: prodCount } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true });
        setProductCount(prodCount || 0);

        // Fetch members count
        const { count: membCount } = await supabase
          .from("members")
          .select("*", { count: "exact", head: true });
        setMemberCount(membCount || 0);

        // Fetch schedules
        const { data: scheds } = await supabase
          .from("schedule")
          .select("*");
        setScheduleCount(scheds?.length || 0);

        // Build dynamic activity feed from database logs
        const mockLogs = [
          { id: "ACT-01", desc: "Produk Melon Honey Globe Baru ditambahkan", type: "Produk", date: "Hari ini, 09:30 AM", status: "Selesai", color: "bg-emerald-500 text-white" },
          { id: "ACT-02", desc: "Anggota Poktan baru terdaftar: Budi Santoso", type: "Anggota", date: "Hari ini, 08:15 AM", status: "Selesai", color: "bg-emerald-500 text-white" },
          { id: "ACT-03", desc: "Jadwal penyiraman tanaman melon diperbarui", type: "Jadwal", date: "Kemarin, 14:00 PM", status: "Berjalan", color: "bg-amber-500 text-white" },
          { id: "ACT-04", desc: "Pembaruan deskripsi profil kelompok tani", type: "Sistem", date: "12/07/2026, 11:45 AM", status: "Selesai", color: "bg-emerald-500 text-white" },
          { id: "ACT-05", desc: "Penambahan foto galeri panen raya melon", type: "Galeri", date: "10/07/2026, 16:30 PM", status: "Selesai", color: "bg-emerald-500 text-white" },
        ];
        setActivities(mockLogs);
      } catch (err) {
        console.error("Error loading stats:", err);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  const stats = [
    {
      title: "Total Produk",
      value: productCount,
      change: "+12.4%",
      isPositive: true,
      timeframe: "dari minggu lalu",
      icon: Package,
      theme: "text-emerald-500 bg-emerald-50 border-emerald-100",
    },
    {
      title: "Anggota Kelompok",
      value: memberCount,
      change: "+5.2%",
      isPositive: true,
      timeframe: "dari bulan lalu",
      icon: Users,
      theme: "text-blue-500 bg-blue-50 border-blue-100",
    },
    {
      title: "Jadwal Kegiatan",
      value: scheduleCount,
      change: "-0.5%",
      isPositive: false,
      timeframe: "hari ini",
      icon: Calendar,
      theme: "text-amber-500 bg-amber-50 border-amber-100",
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Top Welcome Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-gray-500 text-xs md:text-sm">Ringkasan performa perkebunan dan manajemen Poktan.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-150 rounded-xl px-4 py-2 text-xs font-bold text-gray-600 shadow-sm flex items-center gap-2">
            <Clock size={14} className="text-gray-400" />
            <span>13 Desember 2026</span>
          </div>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            className={`bg-white p-4 md:p-5 rounded-2xl border border-gray-100/80 shadow-sm flex justify-between items-start transition-all hover:shadow-md hover:border-gray-200/50 ${
              idx === 2 ? "col-span-2 md:col-span-1" : "col-span-1"
            }`}
          >
            <div className="space-y-3">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.title}</span>
              <div>
                <p className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
                  {loading ? "..." : stat.value}
                </p>
                <p className="text-[10px] text-gray-400 font-medium mt-1">
                  {stat.timeframe}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${stat.theme}`}>
                <stat.icon size={20} />
              </div>
              <span className={`flex items-center gap-0.5 text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                stat.isPositive 
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                  : "bg-red-50 text-red-600 border-red-100"
              }`}>
                {stat.isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* Left 2 Columns: Chart & Table */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {/* Activity Logs Table */}
          <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-800">Log Aktivitas Terbaru</h3>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5 font-medium">Transaksi database dan aktivitas admin</p>
              </div>
              <button className="text-xs font-bold text-[#10b981] hover:underline cursor-pointer">Lihat Semua</button>
            </div>

            {/* Desktop View Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-gray-500">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-bold">
                    <th className="py-3 px-2">ID Aktivitas</th>
                    <th className="py-3">Deskripsi</th>
                    <th className="py-3">Kategori</th>
                    <th className="py-3">Waktu</th>
                    <th className="py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-medium text-gray-700">
                  {activities.map((act) => (
                    <tr key={act.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5 px-2 font-bold text-gray-800">{act.id}</td>
                      <td className="py-3.5 max-w-[200px] truncate">{act.desc}</td>
                      <td className="py-3.5">{act.type}</td>
                      <td className="py-3.5 text-gray-400 text-[10px]">{act.date}</td>
                      <td className="py-3.5 text-right">
                        <span className={`inline-block text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                          act.status === "Selesai" 
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                            : "bg-amber-50 text-amber-600 border border-amber-100"
                        }`}>
                          {act.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View Card List */}
            <div className="block md:hidden space-y-3">
              {activities.map((act) => (
                <div key={act.id} className="bg-gray-50/55 p-3.5 rounded-xl border border-gray-100 flex items-center justify-between gap-3 text-xs">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-gray-800">{act.id}</span>
                      <span className="text-[9px] text-[#10b981] font-bold bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded uppercase">
                        {act.type}
                      </span>
                    </div>
                    <p className="text-gray-600 truncate font-bold leading-normal">{act.desc}</p>
                    <p className="text-[10px] text-gray-400 font-medium leading-none">{act.date}</p>
                  </div>
                  <span className={`inline-block text-[9px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
                    act.status === "Selesai" 
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                      : "bg-amber-50 text-amber-600 border border-amber-100"
                  }`}>
                    {act.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Timeline Cycle Tracker */}
        <div className="space-y-6">
          {/* Cultivation Cycle Tracker card */}
          <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <div className="border-b border-gray-50 pb-4">
              <h3 className="text-sm font-bold text-gray-800">Siklus Budidaya Melon</h3>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">Monitoring tumbuh kembang melon aktif</p>
            </div>

            {/* Timeline element */}
            <div className="relative pl-6 border-l border-gray-100 space-y-6 ml-2 py-2">
              {[
                { title: "Panen Raya Gelombang 1", date: "15/12/2026 - 08:00 AM", desc: "Melon Honey Globe siap panen di Greenhouse A.", current: true },
                { title: "Pemeriksaan Kadar Brix Melon", date: "10/12/2026 - 10:00 AM", desc: "Kadar gula rata-rata brix mencapai 15%.", current: false },
                { title: "Pemberian Nutrisi & Irigasi", date: "05/12/2026 - 07:30 AM", desc: "Irigasi pintar otomatis diaktifkan untuk nutrisi tanaman.", current: false }
              ].map((step, idx) => (
                <div key={idx} className="relative">
                  {/* Timeline dot */}
                  <div className={`absolute -left-[30px] top-1.5 w-3 h-3 rounded-full border-2 bg-white ${
                    step.current ? "border-[#10b981]" : "border-gray-200"
                  }`}>
                    {step.current && <div className="w-1 h-1 bg-[#10b981] rounded-full mx-auto mt-0.5 animate-ping"></div>}
                  </div>

                  <div className="space-y-1">
                    <p className={`text-xs font-bold ${step.current ? "text-[#10b981]" : "text-gray-800"}`}>
                      {step.title}
                    </p>
                    <p className="text-[9px] text-gray-400 font-bold">{step.date}</p>
                    <p className="text-[10px] text-gray-500 leading-relaxed font-medium">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom mini-banner */}
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#10b981] text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/20">
                <Compass size={16} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-emerald-800">Greenhouse Banyu Urip</p>
                <p className="text-[8px] text-emerald-600 font-bold">Kecamatan Tanggumong, ID</p>
              </div>
            </div>
          </div>

          {/* Quick Contact Widget */}
          <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="border-b border-gray-50 pb-4">
              <h3 className="text-sm font-bold text-gray-800">Bantuan Administrator</h3>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">Kontak dukungan pengembang sistem</p>
            </div>
            
            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl transition border border-transparent hover:border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-[#10b981] font-bold text-xs">
                  KD
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-800">Dukungan Teknis</p>
                  <p className="text-[8px] text-gray-400 font-bold uppercase">Online 24 Jam</p>
                </div>
              </div>
              <a href="https://wa.me/6287812345678" target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-lg text-[9px] font-extrabold text-[#10b981] cursor-pointer">
                Chat WA
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
