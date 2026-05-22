import { Users, Droplets, Award, CalendarCheck } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[600px] md:h-[650px] flex items-center justify-start text-left text-white overflow-hidden py-12 md:py-0">
      {/* Background & Linear Gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/bgmelon.jpg')] bg-cover bg-center"></div>
        {/* Gradient diperkuat di sisi kiri agar teks putih sangat kontras */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/30 to-transparent"></div>
      </div>

      {/* Konten Utama - Menggunakan z-10 agar tetap di bawah Navbar (z-1000) */}
      <div className="relative z-10 w-full max-w-6xl px-8 md:px-20 flex flex-col justify-center h-full mt-4 md:mt-0">
        <div className="max-w-2xl">
          <span className="bg-poktan-green px-3 py-1 rounded-md text-[10px] font-bold mb-4 inline-block uppercase tracking-wider">
            Melon Honey Globe Premium
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Melon Honey Globe <br />
            Premium dari <br />
            Petani <span className="text-[#10b981]">Tanggumong</span>
          </h1>
          <p className="text-sm md:text-base mb-8 opacity-90 max-w-xl leading-relaxed">
            Dibudidayakan dengan sistem irigasi tetes pintar <br />
            untuk kualitas manis, renyah, dan konsisten.
          </p>

          <div className="flex flex-wrap justify-start gap-3 mb-10 md:mb-12">
            <a
              href="https://wa.me/(nomorwapetani)?text=halo%2C%20saya%20ingin%20bertanya%2Fmemesan%20melon%2Folahan%20..."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <button className="bg-poktan-green px-6 py-3 rounded-full text-sm font-bold hover:scale-105 transition shadow-lg active:scale-95 flex items-center gap-2">
                <span>Beli Sekarang via WhatsApp</span>
              </button>
            </a>
            <Link href="/katalog">
              <button className="bg-white text-poktan-green px-8 py-3 rounded-full text-sm font-bold hover:scale-105 transition shadow-lg active:scale-95">
                Cek Ketersediaan
              </button>
            </Link>
          </div>
        </div>

        {/* 4 Label Keunggulan - Dibuat lebih rapat (pt-4) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-6 border-t border-white/10 max-w-3xl pt-6">
          {/* 1. Petani Lokal */}
          <div className="flex items-center gap-3 group">
            {/* Menggunakan Green-500 atau Emerald-500 untuk kesan hijau terang yang segar */}
            <div className="w-11 h-11 bg-poktan-green rounded-xl shadow-lg shadow-poktan-green/20 flex items-center justify-center text-white transition-transform group-hover:scale-110">
              <Users size={22} strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-bold text-[11px] md:text-xs leading-tight text-white">
                100% Petani Lokal
              </p>
              <p className="text-[9px] text-white/70 leading-tight">
                Desa Tanggumong, Sampang
              </p>
            </div>
          </div>

          {/* 2. Irigasi Pintar */}
          <div className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-poktan-green rounded-xl shadow-lg shadow-poktan-green/20 flex items-center justify-center text-white transition-transform group-hover:scale-110">
              <Droplets size={22} strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-bold text-[11px] md:text-xs leading-tight text-white">
                Irigasi Tetes Pintar
              </p>
              <p className="text-[9px] text-white/70 leading-tight">
                Hemat air, hasil maksimal
              </p>
            </div>
          </div>

          {/* 3. Kualitas Premium */}
          <div className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-poktan-green rounded-xl shadow-lg shadow-poktan-green/20 flex items-center justify-center text-white transition-transform group-hover:scale-110">
              <Award size={22} strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-bold text-[11px] md:text-xs leading-tight text-white">
                Kualitas Premium
              </p>
              <p className="text-[9px] text-white/70 leading-tight">
                Manis, renyah, konsisten
              </p>
            </div>
          </div>

          {/* 4. Panen Terpilih */}
          <div className="flex items-center gap-3 group">
            <div className="w-11 h-11 bg-poktan-green rounded-xl shadow-lg shadow-poktan-green/20 flex items-center justify-center text-white transition-transform group-hover:scale-110">
              <CalendarCheck size={22} strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-bold text-[11px] md:text-xs leading-tight text-white">
                Panen Terpilih
              </p>
              <p className="text-[9px] text-white/70 leading-tight">
                Dipetik saat matang Optimal
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
