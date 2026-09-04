/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface HeroProps {
  waNumber?: string;
}

export default function Hero({ waNumber = "6287812345678" }: HeroProps) {
  return (
    <section className="relative bg-gradient-to-b from-poktan-accent/40 via-poktan-accent/10 to-slate-50/50 py-16 md:py-24 lg:py-28 px-6 md:px-12 overflow-hidden">
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
        <i className="fa-solid fa-leaf text-[32px]"></i>
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
        <i className="fa-solid fa-leaf text-[24px]"></i>
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
        {/* Left Column (Text & Actions) */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full space-y-6 md:space-y-8 text-left"
        >
          <div className="space-y-4">
            <span className="bg-poktan-accent text-poktan-leaf px-4 py-1.5 rounded-full text-[10px] md:text-xs font-extrabold tracking-widest uppercase inline-block border border-poktan-leaf/5">
              Melon Honey Globe Premium
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.15]">
              Nikmati Kesegaran <br />
              Melon Premium dari <br />
              Petani <span className="text-poktan-leaf font-black">Tanggumong</span>
            </h1>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed max-w-xl">
             Dibudidayakan dengan sistem irigasi tetes pintar dan pemantauan pH tanah untuk menjaga kesuburan lahan, menghasilkan Melon Honey Globe premium yang manis alami, renyah, segar, dan berkualitas tinggi.
            </p>
          </div>

          <div className="flex items-center justify-between gap-3 sm:gap-4 max-w-md w-full">
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-poktan-leaf hover:bg-poktan-green text-white px-4 sm:px-6 md:px-8 py-3.5 sm:py-4 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-poktan-leaf/25 active:scale-95 transition-all duration-300 hover:scale-102 text-center whitespace-nowrap"
            >
              <span>Pesan Sekarang</span>
              <i className="fa-solid fa-arrow-right shrink-0"></i>
            </Link>
            <Link
              href="/katalog"
              className="flex-1 inline-flex items-center justify-center gap-2 border border-slate-200 hover:border-poktan-leaf text-gray-700 hover:text-poktan-green bg-white px-4 sm:px-6 md:px-8 py-3.5 sm:py-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 hover:bg-slate-50 active:scale-95 text-center whitespace-nowrap"
            >
              Lihat Katalog
            </Link>
          </div>

        </motion.div>

        {/* Right Column (Floating Showcase Image) - Ditampilkan hanya di Tablet & Desktop (md ke atas) */}
        <div className="hidden md:flex w-full relative items-center justify-center">
          {/* Accent blur behind image */}
          <div className="absolute inset-0 bg-poktan-accent/40 rounded-full blur-3xl -z-10 scale-95"></div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: [0, -15, 0] 
            }}
            transition={{
              opacity: { duration: 0.8, ease: "easeOut" },
              scale: { duration: 0.8, ease: "easeOut" },
              y: {
                duration: 6,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut"
              }
            }}
            className="w-full max-w-sm lg:max-w-md aspect-square relative flex items-center justify-center cursor-pointer group"
          >
            <img
              src="/images/melon-hero-removebg.png"
              alt="Melon Honey Globe Premium Banyu Urip"
              className="w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(72,110,92,0.18)] group-hover:scale-105 transition-transform duration-500"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
