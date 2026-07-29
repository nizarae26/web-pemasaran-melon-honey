"use client";

import { motion } from "framer-motion";
import { Cpu, FlaskConical, Droplets, Activity, Leaf } from "lucide-react";

export default function BudidayaHero() {
  return (
    <section className="relative bg-gradient-to-b from-poktan-accent/40 via-poktan-accent/10 to-slate-50/50 py-20 md:py-28 px-6 md:px-12 overflow-hidden">
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
          className="max-w-4xl space-y-6"
        >
          <div>
            <span className="bg-poktan-accent text-poktan-leaf px-4 py-1.5 rounded-full text-[10px] font-extrabold tracking-widest uppercase inline-block border border-poktan-leaf/5 mb-4">
              Teknologi Budidaya Modern
            </span>

            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Budidaya Melon Honey Globe <br />
              dengan Teknologi <span className="text-poktan-emerald">Modern</span>
            </h1>
          </div>

          <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-2xl">
            Kami menerapkan praktik budidaya terbaik melalui sistem irigasi
            tetes pintar dan pengelolaan nutrisi terukur untuk hasil premium
            yang konsisten.
          </p>

          {/* 4 Label Keunggulan */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4 max-w-4xl">
            {/* 1. Smart Farming */}
            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-white border border-[#f0f4f1] rounded-xl flex items-center justify-center text-poktan-leaf transition-transform group-hover:scale-105 shrink-0 shadow-sm">
                <Cpu size={18} strokeWidth={2.5} />
              </div>
              <div>
                <p className="font-bold text-xs text-gray-700 leading-tight">Smart Farming</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Irigasi IoT</p>
              </div>
            </div>

            {/* 2. Nutrisi Terukur */}
            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-white border border-[#f0f4f1] rounded-xl flex items-center justify-center text-poktan-leaf transition-transform group-hover:scale-105 shrink-0 shadow-sm">
                <FlaskConical size={18} strokeWidth={2.5} />
              </div>
              <div>
                <p className="font-bold text-xs text-gray-700 leading-tight">Nutrisi Terukur</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Dosis Presisi</p>
              </div>
            </div>

            {/* 3. Irigasi Tetes Pintar */}
            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-white border border-[#f0f4f1] rounded-xl flex items-center justify-center text-poktan-leaf transition-transform group-hover:scale-105 shrink-0 shadow-sm">
                <Droplets size={18} strokeWidth={2.5} />
              </div>
              <div>
                <p className="font-bold text-xs text-gray-700 leading-tight">Irigasi Tetes</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Hemat Air</p>
              </div>
            </div>

            {/* 4. pH Kesuburan Tanah */}
            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-white border border-[#f0f4f1] rounded-xl flex items-center justify-center text-poktan-leaf transition-transform group-hover:scale-105 shrink-0 shadow-sm">
                <Activity size={18} strokeWidth={2.5} />
              </div>
              <div>
                <p className="font-bold text-xs text-gray-700 leading-tight">Kesuburan Tanah</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Data Real-time</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
