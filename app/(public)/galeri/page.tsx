"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GaleriHero from "@/components/public/GaleriHero";
import {
  Search,
  Calendar,
  Play,
  ArrowRight,
  Filter,
  Camera,
  Newspaper,
  GraduationCap,
  Users,
} from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";

export default function GaleriPage() {
  // State untuk Filter Aktif
  const [activeTab, setActiveTab] = useState("Semua");

  // Definisi data statistik media
  const stats = [
    { icon: <Camera size={22} />, label: "Dokumentasi", value: "120+" },
    { icon: <Newspaper size={22} />, label: "Berita & Artikel", value: "15" },
    { icon: <GraduationCap size={22} />, label: "Pelatihan", value: "3" },
    { icon: <Users size={22} />, label: "Petani Terlibat", value: "25+" },
  ];

  // State untuk Data Supabase
  const [galleryItems, setGalleryItems] = useState<any[] /* eslint-disable-line @typescript-eslint/no-explicit-any */>([]);
  const [articles, setArticles] = useState<any[] /* eslint-disable-line @typescript-eslint/no-explicit-any */>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // Fetch Gallery
      const { data: galleryData } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });

      if (galleryData) {
        setGalleryItems(galleryData.map((g) => ({
          title: g.title,
          date: new Date(g.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
          cat: g.category,
          image: g.image_url,
        })));
      }

      // Fetch Articles
      const { data: articleData } = await supabase
        .from("articles")
        .select("*")
        .order("created_at", { ascending: false });

      if (articleData) {
        setArticles(articleData.map((a) => ({
          title: a.title,
          date: new Date(a.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
          tag: a.tag,
          desc: a.description,
          image: a.image_url,
        })));
      }

      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  // Logika Filter
  const showGallery =
    activeTab === "Semua" ||
    activeTab === "Galeri Foto" ||
    activeTab === "Panen" ||
    activeTab === "Pelatihan" ||
    activeTab === "Smart Farming";

  const showArticles = activeTab === "Semua" || activeTab === "Berita & Artikel";
  const showVideos = activeTab === "Semua" || activeTab === "Galeri Foto";

  const filteredGalleryItems = galleryItems.filter((item) => {
    if (activeTab === "Semua" || activeTab === "Galeri Foto") return true;
    return item.cat === activeTab;
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F8FAFC] w-full overflow-x-hidden">
        <GaleriHero />

      {/* Konten Utama yang Menabrak Hero (z-20 dan -mt) */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-12 xl:px-16 relative z-20 -mt-20 md:-mt-26">
        {/* === WADAH GABUNGAN: Gandeng, Putih Murni, Bershadow Tipis === */}
        <div className="bg-white rounded-[32px] shadow-sm shadow-black-200/90 border border-gray-100/80 mb-12 flex flex-col gap-0 overflow-hidden">
          {/* 1. KONTEN ATAS: Stats Bar Card */}
          <div className="p-8 pb-6 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 group">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-4 group/item">
                {/* Box Ikon dengan aksen warna pastel Emerald */}
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#10b981] flex items-center justify-center border border-emerald-100/30 shrink-0 transition-transform group-hover/item:scale-105 duration-300 shadow-sm shadow-emerald-500/5">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-black text-gray-900 leading-none mb-1">
                    {stat.value}
                  </p>
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest leading-none">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Garis Pemisah Tipis di Tengah */}
          <div className="border-t border-gray-100 mx-8"></div>

          {/* 2. KONTEN BAWAH: Navigation Tab Bar (Pill Style Gandeng) */}
          <div className="p-4 px-6 md:px-8 flex flex-wrap items-center justify-center gap-2 w-full">
            {[
              "Semua",
              "Galeri Foto",
              "Berita & Artikel",
              "Panen",
              "Pelatihan",
              "Smart Farming",
            ].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab
                    ? "bg-[#064e3b] text-white shadow-md shadow-emerald-900/10"
                    : "text-gray-500 hover:bg-gray-50 bg-gray-50/50"
                }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Tata Letak Dua Kolom Utama (Grid Konten & Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* SISI KIRI: GRID KONTEN UTAMA (8 KOLOM) */}
          <div className="lg:col-span-8 space-y-20">
            {/* Sub-Section: Galeri Foto Kegiatan */}
            {showGallery && (
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                    Galeri Foto Kegiatan
                  </h3>
                  <button className="text-xs font-bold text-[#10b981] flex items-center gap-2 hover:gap-3 transition-all">
                    <span>LIHAT SEMUA FOTO</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {loading ? (
                    <div className="col-span-full py-12 text-center text-gray-400">Memuat Galeri...</div>
                  ) : filteredGalleryItems.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-3xl border border-gray-100 shadow-sm">Belum ada foto kegiatan.</div>
                  ) : (
                    filteredGalleryItems.map((item, i) => (
                    <div key={i} className="group cursor-pointer">
                      <div className="aspect-square bg-zinc-100 rounded-[24px] overflow-hidden relative mb-4 border border-gray-100 shadow-sm">
                        <img
                          src={item.image}
                          alt={`Dokumentasi kegiatan ${item.title}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-white/90 backdrop-blur-md text-[9px] font-black px-2 py-1 rounded-md text-[#064e3b] uppercase">
                            {item.cat}
                          </span>
                        </div>
                      </div>
                      <h4 className="font-bold text-gray-800 text-sm leading-tight group-hover:text-[#10b981] transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest">
                        {item.date}
                      </p>
                    </div>
                  )))}
                </div>
              </div>
            )}

            {/* Sub-Section: Berita & Artikel Terbaru */}
            {showArticles && (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gray-200 pb-4 gap-4 md:gap-0">
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                    Berita & Artikel Terbaru
                  </h3>
                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-48">
                      <Search
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        placeholder="Cari berita..."
                        className="pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-lg text-[11px] focus:outline-none focus:ring-1 focus:ring-[#10b981] w-full"
                      />
                    </div>
                    <button className="p-1.5 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-[#10b981] transition-colors shrink-0">
                      <Filter size={14} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {loading ? (
                    <div className="col-span-full py-12 text-center text-gray-400">Memuat Artikel...</div>
                  ) : articles.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-3xl border border-gray-100 shadow-sm">Belum ada artikel.</div>
                  ) : (
                    articles.map((item, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full"
                    >
                      <div className="aspect-video bg-zinc-100 relative overflow-hidden">
                        <img
                          src={item.image}
                          alt="Thumbnail artikel berita seputar pertanian melon Tanggumong"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      </div>
                      <div className="p-6 space-y-4 flex flex-col flex-1">
                        <div className="flex gap-2">
                          <span className="text-[10px] font-black text-[#10b981] uppercase">
                            {item.tag}
                          </span>
                          <span className="text-[10px] font-bold text-gray-300">
                            Ã¢â‚¬Â¢
                          </span>
                          <span className="text-[10px] font-bold text-gray-400">
                            {item.date}
                          </span>
                        </div>
                        <h4 className="text-lg font-black text-gray-900 leading-tight group-hover:text-[#10b981] transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                          {item.desc}
                        </p>
                        <button className="flex items-center gap-2 text-[11px] font-black text-gray-900 mt-auto pt-4 group-hover:gap-3 transition-all">
                          <span>BACA SELENGKAPNYA</span>
                          <ArrowRight size={14} className="text-[#10b981]" />
                        </button>
                      </div>
                    </div>
                  )))}
                </div>
              </div>
            )}

            {/* Sub-Section: Video Dokumentasi */}
            {showVideos && (
              <div className="space-y-8 mb-16">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                    Video Dokumentasi
                  </h3>
                  <button className="text-xs font-bold text-gray-400 flex items-center gap-2 hover:text-gray-600 transition-colors">
                    <span>LIHAT CHANNEL YOUTUBE</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      title: "Profil Kelompok Tani Banyu Urip 2024",
                      image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=600"
                    },
                    {
                      title: "Tutorial Budidaya Melon Hidroponik Skala Rumah",
                      image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=600"
                    }
                  ].map((video, i) => (
                    <div
                      key={i}
                      className="aspect-video bg-[#064e3b] rounded-[24px] overflow-hidden relative group cursor-pointer border-4 border-white shadow-lg"
                    >
                      <img
                        src={video.image}
                        alt="Frame video profil atau edukasi budidaya Banyu Urip"
                        className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-[#10b981] rounded-full flex items-center justify-center text-white shadow-xl group-hover:scale-125 transition-transform duration-300">
                          <Play size={24} fill="white" />
                        </div>
                      </div>
                      <div className="absolute bottom-6 left-6 right-6">
                        <p className="text-white font-black text-sm drop-shadow-md">
                          {video.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SISI KANAN: ASIDE SIDEBAR (4 KOLOM) */}
          <aside className="lg:col-span-4 space-y-10">
            {/* Widget 1: Artikel Populer */}
            <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
              <h4 className="font-black text-sm text-gray-900 uppercase tracking-widest mb-6 pb-4 border-b border-gray-50 flex items-center gap-2">
                <SparklesIcon size={16} className="text-[#10b981]" />
                <span>ARTIKEL POPULER</span>
              </h4>
              <div className="space-y-6">
                {[
                  {
                    title: "Teknik Irigasi Tetes Pintar untuk Melon Premium Tanggumong",
                    views: "120 Views",
                    image: "https://images.unsplash.com/photo-1463121044474-70a11a2f7f64?q=80&w=150"
                  },
                  {
                    title: "Manfaat Melon Honey Globe bagi Kesehatan Tubuh",
                    views: "98 Views",
                    image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=150"
                  },
                  {
                    title: "Cara Memilih Melon Matang Sempurna dari Pohonnya",
                    views: "85 Views",
                    image: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?q=80&w=150"
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group cursor-pointer">
                    <div className="w-16 h-16 rounded-xl bg-gray-100 shrink-0 overflow-hidden border border-gray-100">
                      <img
                        src={item.image}
                        alt="Thumbnail artikel terpopuler"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-gray-800 leading-snug group-hover:text-[#10b981] transition-colors line-clamp-2">
                        {item.title}
                      </h5>
                      <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-wider">
                        {item.views}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget 2: Jadwal Musim Panen */}
            <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
              <h4 className="font-black text-sm text-gray-900 uppercase tracking-widest mb-6 pb-4 border-b border-gray-50 flex items-center gap-2">
                <Calendar size={16} className="text-[#10b981]" />
                <span>JADWAL MUSIM PANEN</span>
              </h4>
              <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100/50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black text-[#064e3b]">
                    Mei - Juli 2024
                  </span>
                  <span className="text-[9px] bg-[#10b981] text-white px-2 py-0.5 rounded-full font-black">
                    PANEN
                  </span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {["M", "S", "S", "R", "K", "J", "S"].map((d) => (
                    <span
                      key={d}
                      className="text-[9px] font-black text-gray-300"
                    >
                      {d}
                    </span>
                  ))}
                  {Array.from({ length: 28 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-[10px] p-1 font-bold ${
                        i > 10 && i < 20
                          ? "bg-[#10b981] text-white rounded-md shadow-sm shadow-emerald-500/20"
                          : "text-gray-400"
                      }`}
                    >
                      {i + 1}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Widget 3: Tanya & Pesan Call to Action */}
            <div className="bg-[#064e3b] rounded-[32px] p-8 text-white relative overflow-hidden group shadow-md">
              <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-[#10b981]/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
              <h4 className="font-black text-lg mb-4 relative z-10 leading-tight tracking-tight">
                Tanya & Pesan <br /> Sekarang Secara{" "}
                <span className="text-[#10b981]">Langsung</span>
              </h4>
              <p className="text-xs text-white/60 mb-8 relative z-10 font-medium leading-relaxed">
                Tim admin kami siap membantu menjawab pertanyaan Anda seputar
                Melon Honey Globe premium.
              </p>
              <a
                href="https://wa.me/6287812345678"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#10b981] text-white py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-xl shadow-emerald-950/20 relative z-10"
              >
                <WhatsAppIcon size={18} />
                <span>CHAT VIA WHATSAPP</span>
              </a>
            </div>

            {/* Widget 4: Kategori Berita Plain List */}
            <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
              <h4 className="font-black text-sm text-gray-900 uppercase tracking-widest mb-6">
                Kategori Berita
              </h4>
              <ul className="space-y-4">
                {[
                  "Budidaya",
                  "Pelatihan",
                  "Berita",
                  "Panen",
                  "Smart Farming",
                ].map((cat) => (
                  <li
                    key={cat}
                    className="flex justify-between items-center group cursor-pointer"
                  >
                    <span className="text-xs font-bold text-gray-500 group-hover:text-gray-900 transition-colors">
                      {cat}
                    </span>
                    <span className="w-6 h-6 bg-gray-50 rounded-lg flex items-center justify-center text-[10px] font-black text-gray-300 group-hover:bg-[#10b981] group-hover:text-white transition-all">
                      0{cat.length}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
      </main>
    </>
  );
}

// Sub-komponen Sparkles Aksesibilitas Khusus Sidebar
const SparklesIcon = ({
  size,
  className,
}: {
  size: number;
  className: string;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </svg>
);


