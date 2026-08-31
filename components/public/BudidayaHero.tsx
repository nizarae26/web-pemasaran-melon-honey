"use client";

import { motion } from "framer-motion";
import { Cpu, FlaskConical, Droplets, Activity, Leaf } from "lucide-react";

export default function BudidayaHero() {
  return (
    <section className="relative bg-gradient-to-b from-poktan-accent/40 via-poktan-accent/10 to-slate-50/50 py-14 md:py-20 lg:py-24 px-4 sm:px-6 md:px-12 overflow-hidden">
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
              Teknologi Budidaya Modern
            </span>

            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-gray-900 tracking-tight leading-tight lg:whitespace-nowrap">
              Budidaya Melon Honey Globe dengan Teknologi <span className="text-poktan-emerald">Modern</span>
            </h1>
          </div>

          <p className="text-gray-500 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl">
            Kami menerapkan praktik budidaya terbaik melalui sistem irigasi
            tetes pintar dan pengelolaan nutrisi terukur untuk hasil premium
            yang konsisten.
          </p>

          {/* 4 Label Keunggulan (2 Baris di Tablet & Mobile, Ukuran Luas di Desktop Seperti Tentang Kami) */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 md:gap-4 pt-2 max-w-md sm:max-w-lg md:max-w-xl lg:max-w-6xl">
            {/* 1. Smart Farming */}
            <div className="bg-white/80 backdrop-blur-xs border border-[#f0f4f1] p-2.5 sm:p-3.5 md:p-4 rounded-xl sm:rounded-2xl shadow-xs hover:shadow-sm transition-all flex items-center gap-2 sm:gap-3 md:gap-3.5 group min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-50/60 border border-emerald-100/50 rounded-lg sm:rounded-xl flex items-center justify-center text-poktan-leaf group-hover:scale-105 transition-transform shrink-0">
                <Cpu size={18} strokeWidth={2.5} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-[11px] sm:text-xs text-gray-800 leading-tight">Smart Farming</p>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 leading-snug font-medium">Irigasi IoT</p>
              </div>
            </div>

            {/* 2. Nutrisi Terukur */}
            <div className="bg-white/80 backdrop-blur-xs border border-[#f0f4f1] p-2.5 sm:p-3.5 md:p-4 rounded-xl sm:rounded-2xl shadow-xs hover:shadow-sm transition-all flex items-center gap-2 sm:gap-3 md:gap-3.5 group min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-50/60 border border-emerald-100/50 rounded-lg sm:rounded-xl flex items-center justify-center text-poktan-leaf group-hover:scale-105 transition-transform shrink-0">
                <FlaskConical size={18} strokeWidth={2.5} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-[11px] sm:text-xs text-gray-800 leading-tight">Nutrisi Terukur</p>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 leading-snug font-medium">Dosis Presisi</p>
              </div>
            </div>

            {/* 3. Irigasi Tetes Pintar */}
            <div className="bg-white/80 backdrop-blur-xs border border-[#f0f4f1] p-2.5 sm:p-3.5 md:p-4 rounded-xl sm:rounded-2xl shadow-xs hover:shadow-sm transition-all flex items-center gap-2 sm:gap-3 md:gap-3.5 group min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-50/60 border border-emerald-100/50 rounded-lg sm:rounded-xl flex items-center justify-center text-poktan-leaf group-hover:scale-105 transition-transform shrink-0">
                <Droplets size={18} strokeWidth={2.5} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-[11px] sm:text-xs text-gray-800 leading-tight">Irigasi Tetes</p>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 leading-snug font-medium">Hemat Air</p>
              </div>
            </div>

            {/* 4. pH Kesuburan Tanah */}
            <div className="bg-white/80 backdrop-blur-xs border border-[#f0f4f1] p-2.5 sm:p-3.5 md:p-4 rounded-xl sm:rounded-2xl shadow-xs hover:shadow-sm transition-all flex items-center gap-2 sm:gap-3 md:gap-3.5 group min-w-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-50/60 border border-emerald-100/50 rounded-lg sm:rounded-xl flex items-center justify-center text-poktan-leaf group-hover:scale-105 transition-transform shrink-0">
                <Activity size={18} strokeWidth={2.5} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-[11px] sm:text-xs text-gray-800 leading-tight">Kesuburan Tanah</p>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 leading-snug font-medium">Data Real-time</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
