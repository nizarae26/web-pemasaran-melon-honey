"use client";

import { motion } from "framer-motion";
import { Star, ShieldCheck, ShoppingBag, Leaf } from "lucide-react";

export default function KatalogHero() {
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
          className="max-w-3xl space-y-6"
        >
          <div>
            <span className="bg-poktan-accent text-poktan-leaf px-4 py-1.5 rounded-full text-[10px] font-extrabold tracking-widest uppercase inline-block border border-poktan-leaf/5 mb-4">
              Katalog Produk Premium
            </span>

            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Pilih Kualitas <span className="text-poktan-emerald">Terbaik</span> <br />
              Untuk Keluarga Anda
            </h1>
          </div>

          <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-2xl">
            Menyediakan varietas unggulan Melon Honey Globe yang manis renyah
            dan Golden Apollo yang premium, dipetik segar langsung dari Kelompok Tani Banyu Urip.
          </p>

          {/* 3 Label Fitur Katalog */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 max-w-3xl">
            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-white border border-[#f0f4f1] rounded-xl flex items-center justify-center text-poktan-leaf transition-transform group-hover:scale-105 shrink-0 shadow-sm">
                <Star size={18} strokeWidth={2.5} />
              </div>
              <p className="font-bold text-xs text-gray-700">Produk Unggulan</p>
            </div>

            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-white border border-[#f0f4f1] rounded-xl flex items-center justify-center text-poktan-leaf transition-transform group-hover:scale-105 shrink-0 shadow-sm">
                <ShieldCheck size={18} strokeWidth={2.5} />
              </div>
              <p className="font-bold text-xs text-gray-700">Jaminan Mutu</p>
            </div>

            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-white border border-[#f0f4f1] rounded-xl flex items-center justify-center text-poktan-leaf transition-transform group-hover:scale-105 shrink-0 shadow-sm">
                <ShoppingBag size={18} strokeWidth={2.5} />
              </div>
              <p className="font-bold text-xs text-gray-700">Kualitas Terjaga</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
