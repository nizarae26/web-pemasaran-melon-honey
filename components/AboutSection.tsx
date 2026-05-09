export default function AboutSection() {
  return (
    <section className="py-20 px-4 bg-poktan-accent/20">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Konten Teks */}
        <div>
          <h2 className="text-sm font-bold text-poktan-leaf uppercase tracking-wider mb-2">
            Sekilas Tentang
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-poktan-green mb-6">
            Poktan Banyu Urip
          </h3>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              Kelompok Tani Banyu Urip adalah kelompok tani yang berada di Desa Tanggumong, 
              Kecamatan Sampang, Kabupaten Sampang, Madura. 
            </p>
            <p>
              Kami berkomitmen menghasilkan Melon Honey Globe berkualitas premium 
              dengan dukungan teknologi pertanian modern dan kerja sama tim yang solid 
              untuk menyejahterakan petani lokal.
            </p>
          </div>
          <button className="mt-8 border-2 border-poktan-green text-poktan-green px-6 py-2 rounded-lg font-bold hover:bg-poktan-green hover:text-white transition-all">
            Selengkapnya Tentang Kami ↗
          </button>
        </div>

        {/* Grid Statistik sesuai Mockup */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col justify-center items-center">
            <span className="text-2xl mb-2">👥</span>
            <p className="text-3xl font-bold text-poktan-green">25+</p>
            <p className="text-xs text-gray-500 font-medium">Anggota Aktif</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col justify-center items-center">
            <span className="text-2xl mb-2">🗺️</span>
            <p className="text-3xl font-bold text-poktan-green">± 2 Ha</p>
            <p className="text-xs text-gray-500 font-medium">Luas Lahan</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col justify-center items-center">
            <span className="text-2xl mb-2">📅</span>
            <p className="text-3xl font-bold text-poktan-green">2018</p>
            <p className="text-xs text-gray-500 font-medium">Tahun Berdiri</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col justify-center items-center">
            <span className="text-2xl mb-2">🍈</span>
            <p className="text-3xl font-bold text-poktan-green">1</p>
            <p className="text-xs text-gray-500 font-medium">Produk Unggulan</p>
          </div>
        </div>
      </div>
    </section>
  );
}