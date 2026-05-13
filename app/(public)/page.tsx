import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import OlahanCard from "@/components/public/OlahanCard";
import { MessageCircle, Leaf } from "lucide-react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  // Data dummy untuk katalog sesuai mockup [cite: 19-24]
  const featuredProducts = [
    {
      name: "Melon Honey Globe",
      grade: "Grade Super",
      price: "Rp 60.000 - Rp 75.000",
      weight: "3,5 - 4,5 kg / buah",
      status: "Tersedia" as const,
      promo: "Terlaris" as const,
    },
    {
      name: "Melon Honey Globe",
      grade: "Grade A",
      price: "Rp 30.000 - Rp 35.000",
      weight: "1,5 - 2,5 kg / buah",
      status: "Pre-Order" as const,
      promo: "Hot" as const,
    },
    {
      name: "Melon Honey Globe",
      grade: "Grade B",
      price: "Rp 22.000 - Rp 28.000",
      weight: "1,2 - 1,5 kg / buah",
      status: "Habis" as const,
      promo: "Hot" as const,
    },
    {
      name: "Melon Honey Globe",
      grade: "Grade C",
      price: "Rp 18.000 - Rp 22.000",
      weight: "1,0 - 1,2 kg / buah",
      status: "Tersedia" as const,
      promo: "Diskon" as const,
      discountValue: "30%",
    },
    {
      name: "Melon Honey Globe",
      grade: "Grade Jumbo",
      price: "Rp 45.000 - Rp 55.000",
      weight: "2,5 - 3,5 kg / buah",
      status: "Pre-Order" as const,
    },
    {
      name: "Melon Honey Globe",
      grade: "Grade Small",
      price: "Rp 12.000 - Rp 15.000",
      weight: "0,7 - 1,0 kg / buah",
      status: "Tersedia" as const,
    },
    {
      name: "Paket Hampers Melon",
      grade: "Isi 2 Buah",
      price: "Rp 85.000",
      weight: "Box Premium",
      status: "Pre-Order" as const,
      promo: "Hot" as const,
    },
    {
      name: "Bibit Melon Honey",
      grade: "F1 Premium",
      price: "Rp 150.000",
      weight: "Pack Isi 50",
      status: "Tersedia" as const,
    },
  ];

  const produkOlahan = [
    {
      title: "Keripik Melon Crispy",
      description:
        "Keripik melon premium yang diproses dengan teknik vacuum frying untuk menjaga nutrisi dan rasa manis alami.",
      price: "Rp 15.000",
      image: "/images/keripik.jpg",
    },
    {
      title: "Selai Melon Honey",
      description:
        "Selai buah asli tanpa pemanis buatan, cocok untuk teman sarapan sehat keluarga Anda.",
      price: "Rp 25.000",
      image: "/images/selai.jpg",
    },
    {
      title: "Sirup Melon Tanggumong",
      description:
        "Kesegaran melon Honey Globe dalam bentuk sirup kental yang menyegarkan dahaga.",
      price: "Rp 35.000",
      image: "/images/sirup.jpg",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* 1. Header & Navigasi  */}
      <Navbar />

      {/* 2. Hero Section [cite: 15-18] */}
      <Hero />

      {/* 3. Katalog Melon Honey Globe  */}
      <section className="py-14 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-poktan-green">
              Katalog Melon Honey Globe
            </h2>
            <div className="w-20 h-1 bg-poktan-leaf mx-auto mt-2"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Mengambil hanya 4 data pertama dari array featuredProducts */}
            {featuredProducts.slice(0, 4).map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/katalog">
              <button className="group border-2 border-[#10b981] text-[#10b981] px-10 py-3 rounded-xl font-bold hover:bg-[#10b981] hover:text-white transition-all duration-300 flex items-center gap-2 mx-auto active:scale-95 shadow-sm hover:shadow-emerald-500/20">
                <span>Lihat Semua Katalog</span>
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section Produk Olahan */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-8 md:px-20">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Produk Olahan <span className="text-poktan-green">Kreatif</span>
            </h2>
            <p className="text-gray-500 max-w-xl">
              Selain buah segar, kami juga menghadirkan berbagai produk turunan
              melon berkualitas tinggi hasil karya petani Tanggumong.
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {produkOlahan.map((item, index) => (
              <OlahanCard
                key={index}
                title={item.title}
                description={item.description}
                price={item.price}
                image={item.image}
              />
            ))}
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
              <h3 className="text-2xl font-bold text-poktan-green">
                Galeri Kegiatan
              </h3>
              <span className="text-sm text-poktan-leaf font-semibold cursor-pointer">
                Lihat Semua Galeri →
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-200 rounded-lg overflow-hidden"
                >
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
              <h3 className="text-2xl font-bold text-poktan-green">
                Berita & Artikel Terbaru
              </h3>
              <span className="text-sm text-poktan-leaf font-semibold cursor-pointer">
                Lihat Semua Berita →
              </span>
            </div>
            <div className="space-y-4">
              <div className="flex gap-4 p-3 hover:bg-gray-50 rounded-xl transition cursor-pointer">
                <div className="w-24 h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
                <div>
                  <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded">
                    PANEN
                  </span>
                  <h4 className="font-bold text-sm text-gray-800 mt-1 line-clamp-2">
                    Panen Raya Melon Honey Globe Bulan Agustus
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-1">
                    20 Agustus 2024
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-3 hover:bg-gray-50 rounded-xl transition cursor-pointer">
                <div className="w-24 h-20 bg-gray-200 rounded-lg flex-shrink-0"></div>
                <div>
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                    BUDIDAYA
                  </span>
                  <h4 className="font-bold text-sm text-gray-800 mt-1 line-clamp-2">
                    Tips Perawatan Melon di Musim Kemarau
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-1">
                    12 Agustus 2024
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA Bawah  */}
      <section className="bg-emerald-50/50 py-16 px-8 border-y border-emerald-100">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            {/* Ikon Utama dengan Efek Glow */}
            <div className="w-16 h-16 bg-[#10b981] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 shrink-0">
              <Leaf size={32} strokeWidth={2.5} />
            </div>

            <div>
              <h4 className="font-black text-2xl text-gray-800 tracking-tight mb-1">
                Tertarik dengan{" "}
                <span className="text-[#10b981]">Melon Honey Globe</span> kami?
              </h4>
              <p className="text-gray-500 font-medium max-w-md">
                Hubungi kami sekarang untuk pemesanan atau konsultasi produk
                unggulan dari petani Tanggumong.
              </p>
            </div>
          </div>

          {/* Tombol WhatsApp Modern */}
          <button className="w-full md:w-auto bg-[#10b981] text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-emerald-500/20 hover:bg-[#059669] hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-3">
            <MessageCircle
              size={22}
              strokeWidth={2.5}
              fill="currentColor"
              fillOpacity={0.2}
            />
            <span>Hubungi Kami via WhatsApp</span>
          </button>
        </div>
      </section>

      {/* 7. Footer [cite: 32] */}
      <Footer />
    </main>
  );
}
