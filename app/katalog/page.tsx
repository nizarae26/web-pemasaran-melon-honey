import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

export default function KatalogPage() {
  // Data produk lengkap untuk katalog
  const allProducts = [
    { name: "Melon Honey Globe Grade A", grade: "1,5 – 2,5 kg / buah", price: "Rp 30.000 – Rp 35.000", weight: "Tersedia – Siap Kirim", status: "Tersedia" as const },
    { name: "Melon Honey Globe Grade B", grade: "1,2 – 1,5 kg / buah", price: "Rp 22.000 – Rp 28.000", weight: "Tersedia – Siap Kirim", status: "Tersedia" as const },
    { name: "Melon Honey Globe Grade Jumbo", grade: "2,5 – 3,5 kg / buah", price: "Rp 45.000 – Rp 55.000", weight: "Pre-Order – Panen Bulan Depan", status: "Pre-Order" as const },
    { name: "Melon Honey Globe Grade C", grade: "1,0 – 1,2 kg / buah", price: "Rp 18.000 – Rp 22.000", weight: "Stok Kosong", status: "Habis" as const },
  ];

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Katalog */}
      <section className="relative h-[300px] flex items-center justify-center text-center text-white">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <div className="absolute inset-0 bg-[url('/katalog-hero.jpg')] bg-cover bg-center"></div>
        <div className="relative z-20 px-4">
          <p className="text-sm font-bold uppercase tracking-widest mb-2">Beranda / Katalog</p>
          <h1 className="text-4xl font-bold mb-4 text-white">Katalog Melon Honey Globe</h1>
          <p className="max-w-2xl mx-auto opacity-90">
            Melon premium dengan rasa manis, tekstur renyah, dan kualitas terjamin hasil budidaya petani Desa Tanggumong menggunakan teknologi modern.
          </p>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-20 z-40 bg-white border-b border-gray-100 py-4 px-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3">
             <input type="text" placeholder="Cari produk melon..." className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-poktan-leaf" />
             <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-poktan-leaf">
               <option>Semua Grade</option>
               <option>Grade A</option>
               <option>Grade B</option>
               <option>Jumbo</option>
             </select>
             <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-poktan-leaf">
               <option>Semua Status</option>
               <option>Tersedia</option>
               <option>Pre-Order</option>
             </select>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
             Urutkan: 
             <select className="font-bold text-gray-800 bg-transparent focus:outline-none">
               <option>Terbaru</option>
               <option>Harga Termurah</option>
               <option>Harga Termahal</option>
             </select>
          </div>
        </div>
      </section>

      {/* Main Content: Grid & Sidebar */}
      <section className="py-12 px-4 max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
        {/* Left: Product Grid */}
        <div className="md:col-span-3 space-y-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allProducts.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
          <div className="text-center pt-8 border-t border-gray-100">
             <button className="text-poktan-green font-bold flex items-center gap-2 mx-auto hover:underline">
               Muat Lebih Banyak <span className="text-lg">⌄</span>
             </button>
          </div>
        </div>

        {/* Right: Sidebar sesuai Mockup */}
        <div className="space-y-6">
          {/* Box Musim Panen */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h4 className="font-bold text-poktan-green mb-4 flex items-center gap-2">📅 Musim Panen</h4>
            <div className="text-sm space-y-3">
              <p className="font-bold text-gray-800">Mei – Agustus 2024</p>
              <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold inline-block">
                PANEN BERLANGSUNG
              </div>
              <p className="text-gray-500 text-xs">Pemesanan sekarang akan dikirim sesuai ketersediaan stok harian.</p>
            </div>
          </div>

          {/* Kenapa Spesial */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h4 className="font-bold text-poktan-green mb-4 flex items-center gap-2">✨ Kenapa Melon Kami Spesial?</h4>
            <ul className="text-xs space-y-3 text-gray-600">
              <li className="flex gap-2"><span>✅</span> Varietas Honey Globe premium</li>
              <li className="flex gap-2"><span>✅</span> Teknologi irigasi tetes pintar</li>
              <li className="flex gap-2"><span>✅</span> Perawatan intensif & seleksi ketat</li>
              <li className="flex gap-2"><span>✅</span> Langsung dari petani tanpa perantara </li>
            </ul>
          </div>

          {/* Butuh Bantuan */}
          <div className="bg-poktan-accent/20 rounded-2xl p-6 text-center">
            <p className="font-bold text-poktan-green mb-2">Butuh Bantuan?</p>
            <p className="text-xs text-gray-500 mb-4">Hubungi kami untuk konsultasi atau pemesanan.</p>
            <button className="w-full bg-green-600 text-white py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2">
              <span>💬</span> Chat via WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* Service Info Bar */}
      <section className="bg-gray-50 py-10 px-4 border-t border-gray-100">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
           <div className="flex items-center gap-3">
             <span className="text-2xl">🚚</span>
             <div>
               <p className="font-bold text-xs">Pengiriman Cepat</p>
               <p className="text-[10px] text-gray-500">1-3 Hari Sampai</p>
             </div>
           </div>
           <div className="flex items-center gap-3">
             <span className="text-2xl">📦</span>
             <div>
               <p className="font-bold text-xs">Packing Aman</p>
               <p className="text-[10px] text-gray-500">Dus & Bubble Wrap</p>
             </div>
           </div>
           <div className="flex items-center gap-3">
             <span className="text-2xl">🏢</span>
             <div>
               <p className="font-bold text-xs">Partai Besar</p>
               <p className="text-[10px] text-gray-500">Harga Lebih Spesial</p>
             </div>
           </div>
           <div className="flex items-center gap-3">
             <span className="text-2xl">🛡️</span>
             <div>
               <p className="font-bold text-xs">Kualitas Terjamin</p>
               <p className="text-[10px] text-gray-500">Standar Mutu Terjaga </p>
             </div>
           </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}