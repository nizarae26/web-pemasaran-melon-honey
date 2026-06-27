"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GaleriHero from "@/components/public/GaleriHero";
import { ArrowRight, Calendar, Camera, Filter, GraduationCap, Newspaper, PlaySquare, Search, Users, X } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { motion, AnimatePresence } from "framer-motion";

export default function GaleriPage() {
  // State untuk Filter Aktif
  const [activeTab, setActiveTab] = useState("Semua");
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [scheduleData, setScheduleData] = useState({
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
    status: "PANEN"
  });

  // Definisi data statistik media
  const stats = [
    { icon: <Camera size={22} />, label: "Dokumentasi", value: loading ? "..." : galleryItems.length },
    { icon: <Newspaper size={22} />, label: "Berita & Artikel", value: loading ? "..." : articles.length },
    { icon: <GraduationCap size={22} />, label: "Pelatihan", value: loading ? "..." : galleryItems.filter(g => g.cat === "Pelatihan").length },
    { icon: <Users size={22} />, label: "Petani Terlibat", value: "25+" },
  ];

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

      // Fetch Settings for Schedule
      const { data: scheduleSetting } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "jadwal_panen")
        .single();
        
      if (scheduleSetting?.value) {
        try {
          setScheduleData(JSON.parse(scheduleSetting.value));
        } catch (e) {
          console.error("Error parsing schedule:", e);
        }
      }

      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  // Logika Filter
  const showGallery = activeTab === "Semua" || activeTab === "Panen" || activeTab === "Smart Farming" || activeTab === "Video Dokumentasi";

  const showArticles = activeTab === "Semua" || activeTab === "Berita & Artikel";
  const showVideos = activeTab === "Semua" || activeTab === "Video Dokumentasi";

  const filteredGalleryItems = galleryItems.filter((item) => {
    if (activeTab === "Semua") return item.cat !== "Video Dokumentasi";
    return item.cat === activeTab;
  });

  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (article.desc && article.desc.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (article.tag && article.tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Logika Kalender Real-Time (Fix Timezone & Multi-Month)
  const [sYear, sMonth, sDay] = scheduleData.start_date.split('-').map(Number);
  const startDateObj = new Date(sYear, sMonth - 1, sDay);

  const [eYear, eMonth, eDay] = scheduleData.end_date.split('-').map(Number);
  const endDateObj = new Date(eYear, eMonth - 1, eDay);

  const monthsToDisplay = [];
  let currYear = startDateObj.getFullYear();
  let currMonth = startDateObj.getMonth();

  while (
    currYear < endDateObj.getFullYear() || 
    (currYear === endDateObj.getFullYear() && currMonth <= endDateObj.getMonth())
  ) {
    monthsToDisplay.push({ year: currYear, month: currMonth });
    currMonth++;
    if (currMonth > 11) {
      currMonth = 0;
      currYear++;
    }
  }

  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  
  let displayBulan = "";
  if (monthsToDisplay.length === 1) {
    displayBulan = `${monthNames[startDateObj.getMonth()]} ${startDateObj.getFullYear()}`;
  } else if (startDateObj.getFullYear() === endDateObj.getFullYear()) {
    displayBulan = `${monthNames[startDateObj.getMonth()]} - ${monthNames[endDateObj.getMonth()]} ${startDateObj.getFullYear()}`;
  } else {
    displayBulan = `${monthNames[startDateObj.getMonth()]} ${startDateObj.getFullYear()} - ${monthNames[endDateObj.getMonth()]} ${endDateObj.getFullYear()}`;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F8FAFC] w-full overflow-x-hidden">
        <GaleriHero displayBulan={displayBulan} />

      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-12 xl:px-16 relative z-20 py-8">
        <div className="bg-white rounded-[32px] shadow-sm shadow-black-200/90 border border-gray-100/80 mb-12 flex flex-col gap-0 overflow-hidden">

          {/* 2. KONTEN BAWAH: Navigation Tab Bar (Pill Style Gandeng) */}
          <div className="p-4 px-6 md:px-8 flex flex-wrap items-center justify-center gap-2 w-full">
            {[
              "Semua",
              "Berita & Artikel",
              "Video Dokumentasi",
              "Panen",
              "Smart Farming",
            ].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                  activeTab === tab
                    ? "bg-poktan-green text-white shadow-md shadow-poktan-green/10"
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
                  <button 
                    onClick={() => setActiveTab("Semua")}
                    className="text-xs font-bold text-poktan-green flex items-center gap-2 hover:gap-3 transition-all"
                  >
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
                    <AnimatePresence>
                      {filteredGalleryItems.map((item, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, y: 30, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.4, delay: i * 0.05 }}
                          whileHover={{ y: -8, scale: 1.03, rotateX: 2, rotateY: -2 }}
                          style={{ perspective: 1000 }}
                          className="group cursor-pointer relative"
                        >
                          <div 
                            className="aspect-square bg-zinc-100 rounded-[24px] overflow-hidden relative mb-4 border border-gray-100 shadow-md group-hover:shadow-2xl transition-all duration-500"
                            onClick={() => setSelectedImage(item.image)}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                            <img
                              src={item.image || "/api/placeholder/400/300"}
                              alt={`Dokumentasi kegiatan ${item.title}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute bottom-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                               <p className="text-white text-xs font-bold bg-poktan-green/90 backdrop-blur-md px-3 py-1 rounded-full shadow-lg">Lihat HD</p>
                            </div>
                          </div>
                          <h4 className="font-bold text-gray-800 text-sm leading-tight group-hover:text-poktan-accent transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest">
                            {item.date}
                          </p>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
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
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-lg text-[11px] focus:outline-none focus:ring-1 focus:ring-poktan-green w-full"
                      />
                    </div>
                    <button className="p-1.5 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-poktan-accent transition-colors shrink-0">
                      <Filter size={14} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {loading ? (
                    <div className="col-span-full py-12 text-center text-gray-400">Memuat Artikel...</div>
                  ) : filteredArticles.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-3xl border border-gray-100 shadow-sm">Belum ada artikel yang sesuai.</div>
                  ) : (
                    <AnimatePresence>
                      {filteredArticles.map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 50, rotateX: 5 }}
                          animate={{ opacity: 1, y: 0, rotateX: 0 }}
                          transition={{ duration: 0.6, delay: i * 0.1, type: "spring" }}
                          whileHover={{ scale: 1.02, y: -5 }}
                          className={`bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-lg hover:shadow-[0_20px_50px_rgba(16,185,129,0.15)] transition-all duration-500 group flex flex-col ${i === 0 ? "col-span-full md:flex-row md:h-[300px]" : "h-full"}`}
                        >
                          <div className={`bg-zinc-100 relative overflow-hidden shrink-0 ${i === 0 ? "w-full md:w-1/2 h-[200px] md:h-full" : "w-full h-[200px] md:h-[220px]"}`}>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                            <img
                              src={item.image}
                              alt="Thumbnail artikel berita"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            {/* 3D Modern News Overlay */}
                            <div className="absolute bottom-6 left-6 right-6 z-20 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                               <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-2xl">
                                  <p className="text-white text-xs font-bold uppercase tracking-wider mb-1 opacity-80">{item.tag || "Update Terbaru"}</p>
                                  <p className="text-white font-black text-sm line-clamp-2 leading-tight">{item.title}</p>
                               </div>
                            </div>
                          </div>
                          <div className={`p-6 md:p-8 space-y-4 flex flex-col flex-1 ${i === 0 ? "justify-center" : ""}`}>
                            <div className="flex items-center text-xs text-gray-500 mb-2 gap-2 font-bold tracking-wider uppercase">
                              <span className="text-poktan-green bg-emerald-50 px-2 py-1 rounded-md">{item.date}</span>
                              <span>• Admin</span>
                            </div>
                            <h4 className={`font-black text-gray-900 leading-tight group-hover:text-poktan-accent transition-colors ${i === 0 ? "text-2xl" : "text-lg"}`}>
                              {item.title}
                            </h4>
                            <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                              {item.desc}
                            </p>
                            <button 
                              onClick={() => setSelectedArticle(item)}
                              className="flex items-center gap-2 text-xs font-black text-white bg-gray-900 hover:bg-poktan-accent px-5 py-3 rounded-xl mt-auto self-start group-hover:shadow-lg group-hover:shadow-poktan-accent/30 transition-all duration-300"
                            >
                              <span>BACA ARTIKEL</span>
                              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>
              </div>
            )}

            {/* Sub-Section: Video Dokumentasi */}
            {showVideos && (
              <div className="space-y-8 mb-16">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                    Video Dokumentasi & Galeri
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {galleryItems.filter(g => g.cat === "Video Dokumentasi").length > 0 ? (
                    galleryItems.filter(g => g.cat === "Video Dokumentasi").map((video, i) => (
                      <div
                        key={i}
                        className="aspect-video bg-zinc-900 rounded-[24px] overflow-hidden relative group border border-gray-100 shadow-sm"
                      >
                        <video
                          src={video.image}
                          controls
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-white/90 backdrop-blur-md text-[10px] font-black px-3 py-1.5 rounded-lg text-[#064e3b] uppercase shadow-sm">
                            Video
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-3xl border border-gray-100 shadow-sm">
                      Belum ada video dokumentasi.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* SISI KANAN: ASIDE SIDEBAR (4 KOLOM) */}
          <aside className="lg:col-span-4 space-y-10 sticky top-32 h-fit mb-24">
            {/* Widget 1: Artikel Populer */}
            <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
              <h4 className="font-black text-sm text-gray-900 uppercase tracking-widest mb-6 pb-4 border-b border-gray-50 flex items-center gap-2">
                <SparklesIcon size={16} className="text-poktan-accent" />
                <span>ARTIKEL TERBARU</span>
              </h4>
              <div className="space-y-6">
                {articles.slice(0, 3).map((item, i) => (
                  <div key={i} className="flex gap-4 group cursor-pointer">
                    <div className="w-16 h-16 rounded-xl bg-gray-100 shrink-0 overflow-hidden border border-gray-100">
                      <img
                        src={item.image}
                        alt="Thumbnail artikel terpopuler"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h5 className="text-xs font-bold text-gray-800 leading-snug group-hover:text-poktan-accent transition-colors line-clamp-2">
                        {item.title}
                      </h5>
                      <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-wider">
                        {item.date}
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
              <div className="flex flex-col gap-6">
                {monthsToDisplay.map(({ year, month }) => {
                  const daysInMonth = new Date(year, month + 1, 0).getDate();
                  const firstDay = new Date(year, month, 1).getDay();
                  const emptySlots = Array.from({ length: firstDay });
                  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
                  const monthLabel = `${monthNames[month]} ${year}`;

                  return (
                    <div key={`${year}-${month}`} className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100/50">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-black text-[#064e3b]">
                          {monthLabel}
                        </span>
                        <span className="text-[9px] bg-[#10b981] text-white px-2 py-0.5 rounded-full font-black">
                          {scheduleData.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center mt-2">
                        {["M", "S", "S", "R", "K", "J", "S"].map((d, index) => (
                          <div
                            key={index}
                            className="text-[10px] font-black text-emerald-600/70 mb-1"
                          >
                            {d}
                          </div>
                        ))}
                        {emptySlots.map((_, i) => (
                          <div key={`empty-${i}`}></div>
                        ))}
                        {days.map((day) => {
                          const currentDate = new Date(year, month, day);
                          const isHighlighted = currentDate >= startDateObj && currentDate <= endDateObj;
                          const today = new Date();
                          const isToday = currentDate.getDate() === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
                          
                          return (
                            <div key={day} className="flex justify-center items-center relative">
                              <span
                                className={`w-7 h-7 flex items-center justify-center text-[11px] font-bold transition-all relative z-10 ${
                                  isHighlighted
                                    ? "bg-gradient-to-br from-[#10b981] to-[#059669] text-white rounded-xl shadow-lg shadow-emerald-500/30 scale-110"
                                    : isToday
                                    ? "border border-[#10b981] text-[#10b981] rounded-full"
                                    : "text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl"
                                }`}
                              >
                                {day}
                                {isHighlighted && (
                                  <span className="absolute -top-1.5 -right-1.5 text-[10px] leading-none drop-shadow-md z-20" title="Jadwal Panen">🍈</span>
                                )}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>


          </aside>
        </div>
      </div>
      {/* <div className="pt-2 md:pt-2"></div> */}

      {/* Modal Gambar HD */}
      {selectedImage && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage}
              alt="Gambar HD"
              className="max-w-full max-h-[90vh] object-contain rounded-xl"
            />
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors shadow-lg"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Modal Artikel */}
      {selectedArticle && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="relative aspect-video sm:aspect-[21/9] bg-gray-100 overflow-hidden shrink-0">
              <img
                src={selectedArticle.image}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
              />
              <button 
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="p-6 md:p-10 overflow-y-auto flex-1">
              <div className="flex items-center text-sm text-gray-500 mb-4 gap-2">
                <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full font-bold text-xs">
                  Berita
                </span>
                <span>•</span>
                <span>{selectedArticle.date}</span>
                <span>•</span>
                <span>Oleh Admin</span>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 leading-tight">
                {selectedArticle.title}
              </h2>
              
              <div className="prose prose-emerald max-w-none text-gray-600 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                {selectedArticle.desc}
              </div>
            </div>
          </div>
        </div>
      )}

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


