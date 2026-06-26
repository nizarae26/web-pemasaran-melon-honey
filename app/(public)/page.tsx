import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import OlahanCard from "@/components/public/OlahanCard";
import { Leaf } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const revalidate = 0; // Disable caching so it always fetches fresh data

export default async function Home() {
  // Fetch latest 6 gallery items
  const { data: galleryItems } = await supabase
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(6);

  // Fetch latest 3 articles
  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  // Fetch Melon dari tabel products
  const { data: melonData } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  let combinedData: any[] = [];

  if (melonData) {
    const mappedMelon = melonData.map((item) => ({
      ...item,
      type: "melon",
      type_melon: item.type_melon || "Honey Globe",
      price_raw: item.price,
      name: `${item.name} (${item.weight ? (String(item.weight).toLowerCase().includes('kg') ? item.weight : item.weight + ' kg') : "1 kg"})`,
      grade: item.type_melon || "Honey Globe",
      price: `Rp.${Number(item.price).toLocaleString('id-ID')}`,
      status: item.stock > 0 ? "Tersedia" : "Habis",
      weight: item.weight || "1.0 kg",
      imageUrl: item.image_url,
      date: new Date(item.created_at).getTime(),
    }));
    combinedData = [...combinedData, ...mappedMelon];
  }

  // Urutkan agar produk yang "Tersedia" tampil di atas
  combinedData.sort((a, b) => {
    if (a.status === "Tersedia" && b.status === "Habis") return -1;
    if (a.status === "Habis" && b.status === "Tersedia") return 1;
    return 0;
  });

  const featuredProducts = combinedData.slice(0, 4);


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
            <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-2 tracking-tight inline-block relative">
              Katalog <span className="text-poktan-emerald">Melon</span>
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-20 h-1 bg-poktan-emerald"></span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Mengambil hanya 4 data pertama dari array featuredProducts */}
            {featuredProducts.map((product, index) => (
              <ProductCard 
                key={index} 
                name={product.name}
                grade={product.grade}
                price={product.price}
                weight={product.weight}
                status={product.status}
                imageUrl={product.imageUrl}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/katalog"
              className="group border-2 border-poktan-emerald text-poktan-emerald px-10 py-3 rounded-xl font-bold hover:bg-poktan-emerald hover:text-white transition-all duration-300 flex items-center gap-2 mx-auto active:scale-95 shadow-sm hover:shadow-poktan-emerald/20 w-fit"
            >
              <span>Lihat Semua Katalog</span>
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
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
              <Link href="/galeri" className="text-sm text-poktan-leaf font-semibold hover:text-poktan-green transition-colors">
                Lihat Semua Galeri →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {galleryItems && galleryItems.length > 0 ? (
                galleryItems.map((item) => (
                  <div
                    key={item.id}
                    className="aspect-square bg-gray-200 rounded-lg overflow-hidden relative group cursor-pointer"
                  >
                    <img 
                      src={item.image_url} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-end justify-start p-3 transition-opacity duration-300">
                      <span className="text-white font-bold text-xs line-clamp-2">{item.title}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 aspect-[3/1] bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 text-sm border border-gray-100">
                  Belum ada foto galeri.
                </div>
              )}
            </div>
          </div>

          {/* Kolom Berita & Artikel */}
          <div>
            <div className="flex justify-between items-end mb-6">
              <h3 className="text-2xl font-bold text-poktan-green">
                Berita & Artikel Terbaru
              </h3>
              <Link href="/galeri" className="text-sm text-poktan-leaf font-semibold hover:text-poktan-green transition-colors">
                Lihat Semua Berita →
              </Link>
            </div>
            <div className="space-y-4">
              {articles && articles.length > 0 ? (
                articles.map((item) => (
                  <Link href="/galeri" key={item.id} className="flex gap-4 p-3 hover:bg-gray-50 rounded-xl transition cursor-pointer border border-transparent hover:border-gray-100">
                    <div className="w-24 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded">
                        BERITA
                      </span>
                      <h4 className="font-bold text-sm text-gray-800 mt-1 line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {new Date(item.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="bg-gray-50 p-6 rounded-xl text-center text-sm text-gray-400 border border-gray-100">
                  Belum ada berita & artikel.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA Bawah  */}
      <section className="bg-poktan-accent/20 py-20 px-8 border-y border-poktan-accent/50">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            {/* Ikon Utama dengan Efek Glow */}
            <div className="w-16 h-16 bg-poktan-emerald rounded-2xl flex items-center justify-center text-white shadow-xl shadow-poktan-emerald/20 shrink-0">
              <Leaf size={32} strokeWidth={2.5} />
            </div>

            <div>
              <h4 className="font-black text-2xl text-gray-800 tracking-tight mb-1">
                Tertarik dengan{" "}
                <span className="text-poktan-emerald">Melon Honey Globe</span> kami?
              </h4>
              <p className="text-gray-500 font-medium max-w-md">
                Hubungi kami sekarang untuk pemesanan atau konsultasi produk
                unggulan dari petani Tanggumong.
              </p>
            </div>
          </div>

          {/* Tombol WhatsApp Modern */}
          <button className="w-full md:w-auto bg-poktan-emerald text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-poktan-emerald/20 hover:bg-poktan-green hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-3">
            <WhatsAppIcon size={22} />
            <span>Hubungi Kami via WhatsApp</span>
          </button>
        </div>
      </section>

      {/* 7. Footer [cite: 32] */}
      <Footer />
    </main>
  );
}
