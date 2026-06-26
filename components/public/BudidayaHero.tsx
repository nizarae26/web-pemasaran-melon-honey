import { Cpu, FlaskConical, Award, Leaf, Droplets, Activity, Map } from "lucide-react";

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

          <p className="text-sm md:text-base lg:text-lg opacity-80 max-w-xl leading-relaxed font-medium mb-8">
            Kami menerapkan praktik budidaya terbaik melalui sistem irigasi
            tetes pintar dan pengelolaan nutrisi terukur untuk hasil premium
            yang konsisten.
          </p>

        </div>

        {/* 4 Label Keunggulan - Dibuat memadat ke kiri dengan max-w-3xl */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 border-t border-white/10 pt-8 max-w-4xl">
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

          {/* 3. dihapus */}

          {/* 3. Irigasi Tetes Pintar */}
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-poktan-green rounded-xl shadow-lg shadow-white-500/20 flex items-center justify-center text-white transition-transform group-hover:scale-110 shrink-0">
              <Droplets size={20} strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-bold text-[11px] md:text-xs leading-tight text-white">
                Irigasi Tetes Pintar
              </p>
              <p className="text-[9px] text-white/60 leading-tight">
                Hemat air, hasil maksimal
              </p>
            </div>
          </div>

          {/* 4. pH Kesuburan Tanah */}
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-poktan-green rounded-xl shadow-lg shadow-white-500/20 flex items-center justify-center text-white transition-transform group-hover:scale-110 shrink-0">
              <Activity size={20} strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-bold text-[11px] md:text-xs leading-tight text-white">
                pH Kesuburan Tanah
              </p>
              <p className="text-[9px] text-white/60 leading-tight">
                Data real-time presisi
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
