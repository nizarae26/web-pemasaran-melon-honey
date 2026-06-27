import { Camera, PlaySquare, FileText, Calendar } from "lucide-react";

export default function GaleriHero({ displayBulan = "Update Musim Tanam" }: { displayBulan?: string }) {
  return (
    <section className="relative min-h-[600px] md:h-[650px] flex items-center justify-start text-left text-white overflow-hidden py-12 md:py-0">
      {/* Background & Overlay */}
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
            {" "}
            Media & Informasi
          </span>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight tracking-tight">
            Jejak Digital <br />
            Kelompok Tani <br />
            <span className="text-[#10b981]">Banyu Urip</span>
          </h1>

          <p className="text-sm md:text-base mb-8 opacity-90 max-w-xl leading-relaxed text-white/80">
            Kumpulan dokumentasi kegiatan, informasi edukatif, serta kabar
            terbaru mengenai perkembangan pertanian melon modern di Tanggumong.
          </p>
        </div>

        {/* 4 Label Fitur Galeri */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 border-t border-white/10 pt-8 max-w-4xl">
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-poktan-green rounded-xl flex items-center justify-center text-white transition-transform group-hover:scale-110 shrink-0 shadow-sm shadow-poktan-green/10">
              <Camera size={20} strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-bold text-[11px] md:text-xs leading-tight text-white">Dokumentasi Kegiatan</p>
              <p className="text-[9px] text-white/60 leading-tight">Galeri Foto & Pelatihan</p>
            </div>
          </div>

          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-poktan-green rounded-xl flex items-center justify-center text-white transition-transform group-hover:scale-110 shrink-0 shadow-sm shadow-poktan-green/10">
              <FileText size={20} strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-bold text-[11px] md:text-xs leading-tight text-white">Berita & Artikel</p>
              <p className="text-[9px] text-white/60 leading-tight">Info Terkini Pertanian</p>
            </div>
          </div>

          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-poktan-green rounded-xl flex items-center justify-center text-white transition-transform group-hover:scale-110 shrink-0 shadow-sm shadow-poktan-green/10">
              <PlaySquare size={20} strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-bold text-[11px] md:text-xs leading-tight text-white">Video Dokumentasi</p>
              <p className="text-[9px] text-white/60 leading-tight">Profil & Edukasi Visual</p>
            </div>
          </div>

          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-poktan-green rounded-xl flex items-center justify-center text-white transition-transform group-hover:scale-110 shrink-0 shadow-sm shadow-poktan-green/10">
              <Calendar size={20} strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-bold text-[11px] md:text-xs leading-tight text-white">Jadwal Panen</p>
              <p className="text-[9px] text-white/60 leading-tight">{displayBulan}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
