import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';

export default function Home() {
  // Data dummy untuk katalog sesuai mockup [cite: 19-24]
  const featuredProducts = [
    { name: "Melon Honey Globe", grade: "Grade A", price: "Rp 30.000 - Rp 35.000", weight: "1,5 - 2,5 kg / buah", status: "Tersedia" as const },
    { name: "Melon Honey Globe", grade: "Grade B", price: "Rp 22.000 - Rp 28.000", weight: "1,2 - 1,5 kg / buah", status: "Tersedia" as const },
    { name: "Melon Honey Globe", grade: "Grade C", price: "Rp 18.000 - Rp 22.000", weight: "1,0 - 1,2 kg / buah", status: "Tersedia" as const },
    { name: "Melon Honey Globe", grade: "Grade Jumbo", price: "Rp 45.000 - Rp 55.000", weight: "2,5 - 3,5 kg / buah", status: "Pre-Order" as const },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* 1. Header & Navigasi  */}
      <Navbar />

      {/* 2. Hero Section [cite: 15-18] */}
      <Hero />

      {/* 3. Katalog Melon Honey Globe  */}
      <section className="py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-poktan-green">Katalog Melon Honey Globe</h2>
            <div className="w-20 h-1 bg-poktan-leaf mx-auto mt-2"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="border-2 border-poktan-green text-poktan-green px-8 py-2 rounded-lg font-bold hover:bg-poktan-green hover:text-white transition">
              Lihat Semua Katalog
            </button>
          </div>
        </div>
      </section>

      {/* 4. Sekilas Tentang Poktan Banyu Urip [cite: 26, 27] */}
      <AboutSection />

      {/* 5. Galeri & Berita (Preview) [cite: 28-30] */}
      <section className="py-20 px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
          {/* Kolom Galeri Kegiatan */}
          <div>
            <div className="flex justify-between items-end mb-6">
              <h3 className="text-2xl font-bold text-poktan-green">Galeri Kegiatan</h3>
              <span className="text-sm text-poktan-leaf font-semibold cursor-pointer">Lihat Semua Galeri →</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                  <div className="w-full h-full bg-poktan-accent/50 flex items-center justify-center text-[10px] text-poktan-green text-center p-2">
                    Foto Kegiatan {i}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kolom Berita & Artikel */}
          <div>
            <div className="flex justify-between items-end mb-6">
              <h3 className="text-2xl font-bold text-poktan-green">Berita & Artikel Terbaru</h3>
              <span className="text-sm text-poktan-leaf font-semibold cursor-pointer">Lihat Semua Berita →</span>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4 p-3 hover:bg-gray-50 rounded-xl transition cursor-pointer">
                <div className="w-24 h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
                <div>
                  <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded">PANEN</span>
                  <h4 className="font-bold text-sm text-gray-800 mt-1 line-clamp-2">Panen Raya Melon Honey Globe Bulan Agustus</h4>
                  <p className="text-[10px] text-gray-400 mt-1">20 Agustus 2024</p>
                </div>
              </div>
              <div className="flex gap-4 p-3 hover:bg-gray-50 rounded-xl transition cursor-pointer">
                <div className="w-24 h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
                <div>
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">BUDIDAYA</span>
                  <h4 className="font-bold text-sm text-gray-800 mt-1 line-clamp-2">Tips Perawatan Melon di Musim Kemarau</h4>
                  <p className="text-[10px] text-gray-400 mt-1">12 Agustus 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA Bawah  */}
      <section className="bg-poktan-accent/30 py-12 px-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl">🍈</div>
            <div>
              <h4 className="font-bold text-poktan-green">Tertarik dengan Melon Honey Globe kami?</h4>
              <p className="text-sm text-gray-600">Hubungi kami sekarang untuk pemesanan atau informasi lebih lanjut.</p>
            </div>
          </div>
          <button className="bg-poktan-leaf text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition flex items-center gap-2">
            <span>💬</span> Hubungi Kami via WhatsApp
          </button>
        </div>
      </section>

      {/* 7. Footer [cite: 32] */}
      <Footer />
    </main>
  );
}