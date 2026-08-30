/* eslint-disable @typescript-eslint/no-explicit-any */
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import { Leaf } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import ScrollReveal from "@/components/ScrollReveal";

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Disable caching so it always fetches fresh data

export default async function Home() {
  // Fetch semua data secara paralel agar tidak memblokir render
  const [
    { data: settingsData },
    { data: galleryItems },
    { data: articles },
    { data: melonData }
  ] = await Promise.all([
    supabase.from("settings").select("*"),
    supabase
      .from("gallery")
      .select("*")
      .neq("category", "Video Dokumentasi")
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
  ]);

  const wa = settingsData?.find((s) => s.key === "wa_number");
  const rawWaNumber = wa?.value || "6287812345678";
  const cleanWa = rawWaNumber.replace(/\D/g, "");
  const waNumber = cleanWa.startsWith("620") ? "62" + cleanWa.substring(3) : cleanWa;

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
      status: "Tersedia",
      weight: item.weight || "1.0 kg",
      imageUrl: item.image_url,
      date: new Date(item.created_at).getTime(),
    }));
    combinedData = [...combinedData, ...mappedMelon];
  }

  const featuredProducts = combinedData.slice(0, 4);

  return (
    <main className="min-h-screen bg-slate-50/50">
      {/* 1. Header & Navigasi  */}
      <Navbar />

      {/* 2. Hero Section */}
      <Hero waNumber={waNumber} />

      {/* 3. Katalog Melon Honey Globe  */}
      <section className="py-12 px-6 md:px-12 bg-slate-50/50">
        <div className="max-w-6xl mx-auto">
          
          <ScrollReveal>
            <div className="text-center mb-16 space-y-3">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                Katalog <span className="text-poktan-emerald">Melon Premium</span>
              </h2>
              <p className="text-gray-500 text-sm max-w-md mx-auto leading-relaxed">
                Melon Honey Globe segar dengan tingkat kemanisan brix tinggi, dipanen langsung dari kebun kami.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => (
                <ProductCard 
                  key={index} 
                  name={product.name}
                  grade={product.grade}
                  price={product.price}
                  weight={product.weight}
                  status={product.status}
                  imageUrl={product.imageUrl}
                  waNumber={waNumber}
                />
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="text-center mt-16">
              <Link
                href="/katalog"
                className="group border border-poktan-emerald text-poktan-emerald px-10 py-3.5 rounded-xl font-bold hover:bg-poktan-emerald hover:text-white transition-all duration-300 flex items-center gap-2 mx-auto active:scale-95 w-fit text-sm"
              >
                <span>Lihat Semua Katalog</span>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 4. Sekilas Tentang Poktan Banyu Urip */}
      <ScrollReveal>
        <AboutSection />
      </ScrollReveal>

      {/* 5. Galeri & Berita (Preview) */}
      <section className="py-12 px-6 md:px-12 bg-slate-50/50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Kolom Galeri Kegiatan */}
          <ScrollReveal>
            <div>
              <div className="flex justify-between items-center mb-8 border-b border-[#f0f4f1] pb-4">
                <h3 className="text-xl md:text-2xl font-extrabold text-poktan-green">
                  Galeri Kegiatan
                </h3>
                <Link href="/galeri" className="text-xs md:text-sm text-poktan-leaf font-bold hover:text-poktan-green hover:underline transition-all">
                  Lihat Semua Galeri →
                </Link>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {galleryItems && galleryItems.length > 0 ? (
                  galleryItems.map((item) => (
                    <div
                      key={item.id}
                      className="aspect-square bg-white rounded-xl overflow-hidden relative group cursor-pointer border border-[#f0f4f1]/55 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <img 
                        src={item.image_url} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-end justify-start p-3 transition-opacity duration-300">
                        <span className="text-white font-bold text-xs line-clamp-2">{item.title}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 aspect-[3/1] bg-white rounded-xl flex items-center justify-center text-gray-400 text-sm border border-[#f0f4f1] shadow-sm">
                    Belum ada foto galeri.
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>

          {/* Kolom Berita & Artikel */}
          <ScrollReveal delay={0.1}>
            <div>
              <div className="flex justify-between items-center mb-8 border-b border-[#f0f4f1] pb-4">
                <h3 className="text-xl md:text-2xl font-extrabold text-poktan-green">
                  Berita & Artikel Terbaru
                </h3>
                <Link href="/galeri" className="text-xs md:text-sm text-poktan-leaf font-bold hover:text-poktan-green hover:underline transition-all">
                  Lihat Semua Berita →
                </Link>
              </div>
              
              <div className="space-y-4">
                {articles && articles.length > 0 ? (
                  articles.map((item) => (
                    <Link href="/galeri" key={item.id} className="flex gap-4 p-3 bg-white hover:bg-slate-50 rounded-xl transition cursor-pointer border border-[#f0f4f1]/55 shadow-sm hover:shadow-md">
                      <div className="w-24 h-20 bg-slate-50 rounded-lg flex-shrink-0 overflow-hidden border border-[#f0f4f1]/40">
                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <div>
                          <span className="text-[8px] tracking-wider font-extrabold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full uppercase border border-emerald-100/50">
                            BERITA
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-gray-800 mt-2 line-clamp-1 group-hover:text-poktan-leaf transition-colors">
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
                  <div className="bg-white p-6 rounded-xl shadow-sm text-center text-sm text-gray-400 border border-[#f0f4f1]">
                    Belum ada berita & artikel.
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 6. CTA Bawah */}
      <section className="py-12 px-6 md:px-12 bg-slate-50/50">
        <ScrollReveal>
          <div className="max-w-5xl mx-auto bg-poktan-accent/40 border border-poktan-leaf/10 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              {/* Ikon Utama */}
              <div className="w-16 h-16 bg-white border border-[#f0f4f1] rounded-xl flex items-center justify-center text-poktan-leaf shrink-0 shadow-sm">
                <Leaf size={28} strokeWidth={2} />
              </div>

              <div>
                <h4 className="font-extrabold text-2xl text-gray-900 tracking-tight mb-1">
                  Tertarik dengan <span className="text-poktan-emerald">Melon Honey Globe</span> kami?
                </h4>
                <p className="text-gray-500 text-sm font-medium max-w-md leading-relaxed">
                  Hubungi kami sekarang untuk pemesanan atau konsultasi produk unggulan dari petani Tanggumong.
                </p>
              </div>
            </div>

            {/* Tombol WhatsApp Modern */}
            <a 
              href={`https://wa.me/${waNumber}?text=${encodeURIComponent("Halo Admin Poktan Banyu Urip, saya tertarik dengan Melon Honey Globe & Golden Apollo Anda. Boleh minta info katalog dan ketersediaan panen terbaru? Terima kasih!")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto bg-poktan-leaf hover:bg-poktan-green text-white px-8 py-4 rounded-xl font-bold shadow-md shadow-poktan-leaf/10 hover:scale-102 transition-all duration-300 text-sm flex items-center justify-center gap-3 shrink-0"
            >
              <WhatsAppIcon size={20} />
              <span>Hubungi via WhatsApp</span>
            </a>
          </div>
        </ScrollReveal>
      </section>

      {/* 7. Footer */}
      <Footer waNumber={waNumber} />
    </main>
  );
}
