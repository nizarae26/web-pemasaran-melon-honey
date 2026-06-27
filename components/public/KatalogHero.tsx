import { Star, ShieldCheck, ShoppingBag, Truck } from "lucide-react";

export default function KatalogHero() {
  return (
    <section className="relative min-h-[600px] md:h-[650px] flex items-center justify-start text-left text-white overflow-hidden py-12 md:py-0">
      {/* Background & Linear Gradient */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/bgmelon.jpg')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/30 to-transparent"></div>
      </div>

      {/* Konten Utama */}
      <div className="relative z-10 w-full max-w-6xl px-8 md:px-20 flex flex-col justify-center h-full mt-4 md:mt-0">
        <div className="max-w-2xl">
          <span className="bg-poktan-green px-3 py-1 rounded-md text-[10px] font-bold mb-4 inline-block uppercase tracking-wider shadow-sm">
            Katalog Produk Premium
          </span>

          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight tracking-tight">
            Pilih Kualitas <br />
            <span className="text-[#10b981]">Terbaik</span> Untuk <br />
            Keluarga Anda
          </h1>

          <p className="text-sm md:text-base mb-8 opacity-90 max-w-xl leading-relaxed text-white/80">
            Menyediakan varietas unggulan Melon Honey Globe yang manis renyah
            dan Golden Apollo yang premium, dipetik segar langsung dari Kelompok Tani Banyu Urip.
          </p>
        </div>

        {/* 3 Label Fitur Katalog - Dibuat memadat rapi di bawah teks utama */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6 border-t border-white/10 pt-8 max-w-3xl">
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-poktan-green rounded-xl flex items-center justify-center text-white transition-transform group-hover:scale-110 shrink-0 shadow-sm shadow-poktan-green/10">
              <Star size={20} strokeWidth={2.5} />
            </div>
            <p className="font-bold text-[11px] md:text-xs leading-tight text-white">Produk Unggulan</p>
          </div>

          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-poktan-green rounded-xl flex items-center justify-center text-white transition-transform group-hover:scale-110 shrink-0 shadow-sm shadow-poktan-green/10">
              <ShieldCheck size={20} strokeWidth={2.5} />
            </div>
            <p className="font-bold text-[11px] md:text-xs leading-tight text-white">Jaminan Mutu</p>
          </div>

          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-poktan-green rounded-xl flex items-center justify-center text-white transition-transform group-hover:scale-110 shrink-0 shadow-sm shadow-poktan-green/10">
              <ShoppingBag size={20} strokeWidth={2.5} />
            </div>
            <p className="font-bold text-[11px] md:text-xs leading-tight text-white">Stok Terjaga</p>
          </div>

        </div>
      </div>
    </section>
  );
}