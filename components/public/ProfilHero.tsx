"use client";

import { motion } from "framer-motion";
import { Users, Maximize, Calendar, Leaf } from "lucide-react";

export default function ProfilHero() {
  const stats = [
    { icon: <Users size={18} strokeWidth={2.5} />, label: "Anggota Aktif", value: "10+ Orang" },
    { icon: <Maximize size={18} strokeWidth={2.5} />, label: "Latar Belakang", value: "Petani Melon" },
    { icon: <Calendar size={18} strokeWidth={2.5} />, label: "Tahun Berdiri", value: "Sejak 2019" },
    { icon: <Leaf size={18} strokeWidth={2.5} />, label: "Visi & Misi", value: "Masyarakat Petani Melon yang Sejahtera, Mandiri, Modern, dan Berwawasan Lingkungan." },
  ];

  return (
    <section className="relative bg-gradient-to-b from-poktan-accent/40 via-poktan-accent/10 to-[#fcfdfb] py-20 md:py-28 px-6 md:px-12 overflow-hidden">
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
          className="max-w-5xl space-y-6"
        >
          <div>
            <span className="bg-poktan-accent text-poktan-leaf px-4 py-1.5 rounded-full text-[10px] font-extrabold tracking-widest uppercase inline-block border border-poktan-leaf/5 mb-4">
              Tentang Kami
            </span>

            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Mengenal Lebih Dekat Kelompok Tani <br />
              <span className="text-poktan-emerald">Banyu Urip</span>
            </h1>
          </div>

          <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-3xl">
            Berawal dari semangat kemandirian petani di Desa Tanggumong untuk
            menghadirkan pertanian melon premium yang modern and berkelanjutan
            di Madura.
          </p>

          {/* Statistik Utama */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 max-w-5xl">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-start gap-3 group">
                <div className="w-10 h-10 bg-white border border-[#f0f4f1] rounded-xl flex items-center justify-center text-poktan-leaf transition-transform group-hover:scale-105 shrink-0 shadow-sm">
                  {stat.icon}
                </div>
                <div>
                  <p className="font-bold text-xs text-gray-700 leading-tight">
                    {stat.label}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1 leading-relaxed max-w-[240px]">
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
