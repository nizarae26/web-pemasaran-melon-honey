export default function GaleriHero() {
  return (
    <section className="relative min-h-[500px] md:h-[550px] flex items-center justify-start text-left text-white overflow-hidden w-full pb-24">
      {/* Background & Overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/bgmelon.jpg')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/30 to-transparent"></div>
      </div>

      {/* Konten Utama */}
      <div className="relative z-10 w-full max-w-full px-6 md:px-10 lg:px-12 xl:px-20 flex flex-col justify-center">
        <div className="max-w-3xl">
          <span className="bg-poktan-green px-3 py-1 rounded-md text-[10px] font-bold mb-4 inline-block uppercase tracking-wider shadow-sm">
            {" "}
            Media & Informasi
          </span>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight tracking-tight">
            Jejak Digital <br />
            Kelompok Tani <br />
            <span className="text-[#10b981]">Banyu Urip</span>
          </h1>

          <p className="text-sm md:text-base lg:text-lg opacity-80 max-w-xl leading-relaxed font-medium">
            Kumpulan dokumentasi kegiatan, informasi edukatif, serta kabar
            terbaru mengenai perkembangan pertanian melon modern di Tanggumong.
          </p>
        </div>
      </div>
    </section>
  );
}
