import { Users, Maximize, Calendar, Award } from "lucide-react";

export default function ProfilHero() {
  const stats = [
    { icon: <Users size={20} strokeWidth={2.5} />, label: "Anggota Aktif", value: "10+ Orang" },
    { icon: <Maximize size={20} strokeWidth={2.5} />, label: "Luas Lahan", value: "± 2 Hektar" },
    { icon: <Calendar size={20} strokeWidth={2.5} />, label: "Tahun Berdiri", value: "Sejak 2019" },
    { icon: <Award size={20} strokeWidth={2.5} />, label: "Produk Unggulan", value: "2 Varian" },
  ];

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
            Tentang Kami
          </span>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight tracking-tight">
            Mengenal Lebih Dekat <br />
            Kelompok Tani <br />
            <span className="text-[#10b981]">Banyu Urip</span>
          </h1>

          <p className="text-sm md:text-base mb-8 opacity-90 max-w-xl leading-relaxed text-white/80">
            Berawal dari semangat kemandirian petani di Desa Tanggumong untuk
            menghadirkan pertanian melon premium yang modern dan berkelanjutan
            di Madura.
          </p>
        </div>

        {/* 4 Statistik Utama (Stat Bar) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 border-t border-white/10 pt-8 max-w-4xl">
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-poktan-green rounded-xl flex items-center justify-center text-white transition-transform group-hover:scale-110 shrink-0 shadow-sm shadow-poktan-green/10">
                {stat.icon}
              </div>
              <div>
                <p className="font-bold text-[11px] md:text-xs leading-tight text-white">
                  {stat.label}
                </p>
                <p className="text-[9px] text-white/60 leading-tight">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
