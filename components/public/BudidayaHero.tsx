import { Cpu, FlaskConical, Award, Leaf } from "lucide-react";

export default function BudidayaHero() {
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
            Teknologi Budidaya Modern
          </span>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight tracking-tight">
            Budidaya Melon <br />
            Honey Globe dengan <br />
            Teknologi <span className="text-[#10b981]">Modern</span>
          </h1>

          <p className="text-sm md:text-base lg:text-lg opacity-80 max-w-xl leading-relaxed font-medium">
            Kami menerapkan praktik budidaya terbaik melalui sistem irigasi
            tetes pintar dan pengelolaan nutrisi terukur untuk hasil premium
            yang konsisten.
          </p>

          {/* Menambahkan mt-8 (margin-top) untuk memberikan ruang napas yang cukup dari paragraf atas */}
          <div className="flex flex-wrap justify-start gap-3 mt-8 mb-10">
            <button className="bg-white text-poktan-green px-8 py-3 rounded-full text-sm font-bold hover:scale-105 active:scale-95 transition flex items-center justify-center shadow-lg min-h-[44px]">
              <span>Konsultasi Budidaya</span>
            </button>
          </div>
        </div>

        {/* 4 Label Keunggulan - Dibuat memadat ke kiri dengan max-w-3xl */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6 border-t border-white/10 pt-6 max-w-3xl">
          {/* 1. Smart Farming */}
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-poktan-green rounded-xl shadow-lg shadow-white-500/20 flex items-center justify-center text-white transition-transform group-hover:scale-110 shrink-0">
              <Cpu size={20} strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-bold text-[11px] md:text-xs leading-tight text-white">
                Smart Farming
              </p>
              <p className="text-[9px] text-white/60 leading-tight">
                Irigasi & Monitoring IoT
              </p>
            </div>
          </div>

          {/* 2. Nutrisi Terukur */}
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-poktan-green rounded-xl shadow-lg shadow-white-500/20 flex items-center justify-center text-white transition-transform group-hover:scale-110 shrink-0">
              <FlaskConical size={20} strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-bold text-[11px] md:text-xs leading-tight text-white">
                Nutrisi Terukur
              </p>
              <p className="text-[9px] text-white/60 leading-tight">
                Dosis nutrisi presisi
              </p>
            </div>
          </div>

          {/* 3. Kualitas Premium */}
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-poktan-green rounded-xl shadow-lg shadow-white-500/20 flex items-center justify-center text-white transition-transform group-hover:scale-110 shrink-0">
              <Award size={20} strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-bold text-[11px] md:text-xs leading-tight text-white">
                Kualitas Premium
              </p>
              <p className="text-[9px] text-white/60 leading-tight">
                Standar mutu tinggi
              </p>
            </div>
          </div>

          {/* 4. Ramah Lingkungan */}
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-poktan-green rounded-xl shadow-lg shadow-white-500/20 flex items-center justify-center text-white transition-transform group-hover:scale-110 shrink-0">
              <Leaf size={20} strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-bold text-[11px] md:text-xs leading-tight text-white">
                Ramah Lingkungan
              </p>
              <p className="text-[9px] text-white/60 leading-tight">
                Eco Farming
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
