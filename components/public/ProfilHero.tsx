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
    <>
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
              Mengenal Lebih Dekat <br />
              Kelompok Tani{" "}
              <span className="text-poktan-leaf">Banyu Urip</span>
            </h1>
          </div>

          <p className="text-gray-500 text-xs sm:text-sm md:text-base leading-relaxed max-w-3xl">
            Berawal dari semangat kemandirian petani di Desa Tanggumong untuk
            menghadirkan pertanian melon premium yang modern dan berkelanjutan
            di Madura.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Garis Hitam Super Tipis */}
    <div className="w-full h-[1px] bg-black/15 relative z-10 translate-y-[84px] md:translate-y-[100px]"></div>

    {/* Floating Stats Grid */}
    <div className="relative z-50 -mt-8 sm:-mt-10 md:-mt-14 lg:-mt-16 translate-y-20 px-4 sm:px-6 md:px-12 flex justify-center w-full">
      <div className="w-full max-w-4xl bg-white border border-gray-100 shadow-[0_12px_40px_rgba(0,0,0,0.08)] p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-[32px] grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className="flex flex-col items-center justify-center text-center group"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50/80 border border-emerald-100 rounded-xl sm:rounded-2xl flex items-center justify-center text-poktan-leaf group-hover:scale-110 transition-transform mb-3">
              {stat.icon}
            </div>
            <p className="font-bold text-xs sm:text-sm text-gray-800 leading-tight">
              {stat.label}
            </p>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1 font-medium">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
