"use client";

import { motion } from "framer-motion";
import { Users, Maximize, Calendar, Leaf } from "lucide-react";

export default function ProfilHero() {
  const stats = [
    { icon: <Users size={18} strokeWidth={2.5} />, label: "Anggota Aktif", value: "10+ Orang" },
    { icon: <Maximize size={18} strokeWidth={2.5} />, label: "Latar Belakang", value: "Petani Melon" },
    { icon: <Calendar size={18} strokeWidth={2.5} />, label: "Tahun Berdiri", value: "Sejak 2019" },
    { icon: <Leaf size={18} strokeWidth={2.5} />, label: "Visi & Misi", value: "Modern & Sejahtera" },
  ];

  return (
    <section className="relative bg-gradient-to-b from-poktan-accent/40 via-poktan-accent/10 to-slate-50/50 py-14 md:py-20 lg:py-28 px-4 sm:px-6 md:px-12 overflow-hidden">
      {/* Decorative Background Blob */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-poktan-accent/15 rounded-full blur-[120px] -z-10"></div>
      
      {/* Floating Organic Leaf 1 in the background */}
      <motion.div
        animate={{
          y: [0, -25, 0],
          x: [0, 15, 0],
          rotate: [0, 20, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-10 left-[8%] text-poktan-leaf/20 pointer-events-none hidden md:block"
      >
        <Leaf size={32} />
      </motion.div>

      {/* Floating Organic Leaf 2 in the background */}
      <motion.div
        animate={{
          y: [0, 30, 0],
          x: [0, -15, 0],
          rotate: [0, -25, 0]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-16 right-[12%] text-poktan-leaf/15 pointer-events-none hidden md:block"
      >
        <Leaf size={24} />
      </motion.div>

      {/* Konten Utama */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full space-y-6"
        >
          <div>
            <span className="bg-poktan-accent text-poktan-leaf px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] font-extrabold tracking-widest uppercase inline-block border border-poktan-leaf/5 mb-3">
              Tentang Kami
            </span>

            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-[2.65rem] font-black text-gray-900 tracking-tight leading-tight lg:whitespace-nowrap">
              Mengenal Lebih Dekat Kelompok Tani{" "}
              <span className="text-poktan-emerald">Banyu Urip</span>
            </h1>
          </div>

          <p className="text-gray-500 text-xs sm:text-sm md:text-base leading-relaxed max-w-3xl">
            Berawal dari semangat kemandirian petani di Desa Tanggumong untuk
            menghadirkan pertanian melon premium yang modern dan berkelanjutan
            di Madura.
          </p>

          {/* Statistik Utama & Visi Misi (2 Baris di Tablet & Mobile, 4 Kolom di Desktop) */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 md:gap-4 pt-2 max-w-md sm:max-w-lg md:max-w-xl lg:max-w-6xl">
            {stats.map((stat, i) => (
              <div 
                key={i} 
                className="bg-white/80 backdrop-blur-xs border border-[#f0f4f1] p-2.5 sm:p-3.5 md:p-4 rounded-xl sm:rounded-2xl shadow-xs hover:shadow-sm transition-all flex items-center gap-2 sm:gap-3 md:gap-3.5 group min-w-0"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-50/60 border border-emerald-100/50 rounded-lg sm:rounded-xl flex items-center justify-center text-poktan-leaf group-hover:scale-105 transition-transform shrink-0">
                  {stat.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-[11px] sm:text-xs text-gray-800 leading-tight">
                    {stat.label}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 leading-snug font-medium">
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
