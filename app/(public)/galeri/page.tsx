"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GaleriHero from "@/components/public/GaleriHero";
import { ArrowRight, Calendar, Camera, Filter, GraduationCap, Newspaper, PlaySquare, Search, Users, X, Link2, Sparkles } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { Toaster } from "react-hot-toast";
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
  const [schedules, setSchedules] = useState<any[]>([
    {
      id: "1",
      title: "Panen Utama",
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
      status: "PANEN"
    }
  ]);

  const [categorizedVideos, setCategorizedVideos] = useState<{
    landscape: any[];
    portrait: any[];
  }>({ landscape: [], portrait: [] });

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

      // Fetch Settings for Schedule (Try multi first, then fallback to single)
      const { data: scheduleMultiSetting } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "jadwal_panen_multi")
        .single();
        
      if (scheduleMultiSetting?.value) {
        try {
          const parsed = JSON.parse(scheduleMultiSetting.value);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSchedules(parsed);
          }
        } catch (e) {
          console.error("Error parsing schedule_multi:", e);
        }
      } else {
        // Fallback
        const { data: scheduleSetting } = await supabase
          .from("settings")
          .select("value")
          .eq("key", "jadwal_panen")
          .single();
          
        if (scheduleSetting?.value) {
          try {
            const parsed = JSON.parse(scheduleSetting.value);
            setSchedules([{
              id: "1",
              title: "Panen",
              start_date: parsed.start_date,
              end_date: parsed.end_date || parsed.start_date,
              status: parsed.status || "PANEN"
            }]);
          } catch (e) {
            console.error("Error parsing schedule:", e);
          }
        }
      }

      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  useEffect(() => {
    const videos = galleryItems.filter(g => g.cat === "Video Dokumentasi");
    if (videos.length === 0) {
      setCategorizedVideos({ landscape: [], portrait: [] });
      return;
    }

    const landscape: any[] = [];
    const portrait: any[] = [];
    let processed = 0;

    videos.forEach((video) => {
      if (typeof window === 'undefined') return;
      const vid = document.createElement('video');
      vid.src = video.image;
      vid.preload = 'metadata';
      vid.onloadedmetadata = () => {
        if (vid.videoHeight > vid.videoWidth) {
          portrait.push(video);
        } else {
          landscape.push(video);
        }
        processed++;
        if (processed === videos.length) {
          setCategorizedVideos({ landscape, portrait });
        }
      };
      vid.onerror = () => {
        landscape.push(video);
        processed++;
        if (processed === videos.length) {
          setCategorizedVideos({ landscape, portrait });
        }
      };
    });
  }, [galleryItems]);

  // Logika Filter
  const showGallery = activeTab === "Semua" || activeTab === "Panen" || activeTab === "Smart Farming";
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
  let minDateObj = new Date();
  let maxDateObj = new Date();

  if (schedules.length > 0) {
    const startDates = schedules.map(s => new Date(s.start_date));
    const endDates = schedules.map(s => new Date(s.end_date));
    minDateObj = new Date(Math.min(...startDates.map(d => d.getTime())));
    maxDateObj = new Date(Math.max(...endDates.map(d => d.getTime())));
  }

  const today = new Date();
  if (minDateObj > today) minDateObj = today;
  if (maxDateObj < today) maxDateObj = today;

  const monthsToDisplay = [];
  let currYear = minDateObj.getFullYear();
  let currMonth = minDateObj.getMonth();

  const targetYear = maxDateObj.getFullYear();
  const targetMonth = maxDateObj.getMonth();

  while (
    currYear < targetYear || 
    (currYear === targetYear && currMonth <= targetMonth)
  ) {
    monthsToDisplay.push({ year: currYear, month: currMonth });
    currMonth++;
    if (currMonth > 11) {
      currMonth = 0;
      currYear++;
    }
  }

  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  
  const GRADIENTS = [
    "from-[#10b981] to-[#059669]", // emerald
    "from-[#f59e0b] to-[#d97706]", // amber
    "from-[#3b82f6] to-[#2563eb]", // blue
    "from-[#8b5cf6] to-[#7c3aed]", // violet
    "from-[#f43f5e] to-[#e11d48]"  // rose
  ];
  
  const BG_COLORS = [
    "bg-[#10b981]",
    "bg-[#f59e0b]",
    "bg-[#3b82f6]",
    "bg-[#8b5cf6]",
    "bg-[#f43f5e]"
  ];

  let displayBulan = "";
  if (monthsToDisplay.length === 1) {
    displayBulan = `${monthNames[minDateObj.getMonth()]} ${minDateObj.getFullYear()}`;
  } else if (minDateObj.getFullYear() === maxDateObj.getFullYear()) {
    displayBulan = `${monthNames[minDateObj.getMonth()]} - ${monthNames[maxDateObj.getMonth()]} ${minDateObj.getFullYear()}`;
  } else {
    displayBulan = `${monthNames[minDateObj.getMonth()]} ${minDateObj.getFullYear()} - ${monthNames[maxDateObj.getMonth()]} ${maxDateObj.getFullYear()}`;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F8FAFC] w-full overflow-x-hidden">
        <GaleriHero displayBulan={displayBulan} />

      <div className="max-w-[1440px] mx-auto px-6 md:px-10 lg:px-12 xl:px-16 relative z-20 py-8">
        <div className="bg-white rounded-3xl shadow-sm shadow-black-200/90 border border-gray-100/80 mb-12 flex flex-col gap-0 overflow-hidden">

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
                className={`px-6 py-2.5 rounded-full text-xs font-extrabold transition-all duration-300 whitespace-nowrap cursor-pointer active:scale-95 border ${
                  activeTab === tab
                    ? "bg-poktan-leaf text-white border-poktan-leaf shadow-md shadow-poktan-leaf/10"
                    : "text-gray-500 hover:bg-gray-50 bg-white border-slate-200"
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
                {activeTab === "Semua" && (
                  <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                      Galeri Foto Kegiatan
                    </h3>
                  </div>
                )}

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
                            className="aspect-square bg-zinc-100 rounded-2xl overflow-hidden relative mb-4 border border-gray-100 shadow-md group-hover:shadow-2xl transition-all duration-500"
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
                {activeTab === "Semua" && (
                  <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                      Berita & Artikel Terbaru
                    </h3>
                  </div>
                )}

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
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: i * 0.05 }}
                          whileHover={{ y: -6 }}
                          className={`bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:border-poktan-leaf/25 transition-all duration-300 group flex flex-col ${
                            i === 0 ? "col-span-full md:flex-row md:h-[280px]" : "h-full"
                          }`}
                        >
                          <div className={`bg-zinc-50 relative overflow-hidden shrink-0 ${
                            i === 0 ? "w-full md:w-1/2 h-[200px] md:h-full" : "w-full h-[180px] md:h-[200px]"
                          }`}>
                            <img
                              src={item.image}
                              alt="Thumbnail artikel berita"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {i === 0 && (
                              <div className="absolute top-4 left-4 z-20">
                                <span className="bg-poktan-green text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-md uppercase tracking-wider flex items-center gap-1.5">
                                  <Sparkles size={10} className="text-[#f0cc4b] animate-pulse" />
                                  Sorotan
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <div className={`p-6 md:p-8 flex flex-col flex-1 justify-between`}>
                            <div className="space-y-3">
                              <div className="flex items-center text-xs text-gray-400 gap-2 font-semibold uppercase tracking-wider">
                                <span className="text-poktan-green bg-poktan-accent/30 px-2 py-0.5 rounded-md text-[10px] font-bold">
                                  {item.date}
                                </span>
                                <span>• Admin</span>
                              </div>
                              
                              <h4 className={`font-bold text-gray-800 leading-snug group-hover:text-poktan-leaf transition-colors ${
                                i === 0 ? "text-xl md:text-2xl" : "text-base md:text-lg"
                              }`}>
                                {item.title}
                              </h4>
                              
                              <p className="text-xs md:text-sm text-gray-500 leading-relaxed line-clamp-3">
                                {item.desc}
                              </p>
                            </div>
                            
                            <button 
                              onClick={() => setSelectedArticle(item)}
                              className="flex items-center gap-2 text-xs font-extrabold text-white bg-poktan-leaf hover:bg-poktan-green px-6 py-3 rounded-full mt-4 self-start shadow-md shadow-poktan-leaf/10 hover:shadow-lg hover:shadow-poktan-leaf/20 active:scale-95 transition-all duration-300 cursor-pointer uppercase tracking-wider"
                            >
                              <span>Baca Artikel</span>
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
              <div className="space-y-12 mb-16">
                {/* 1. Video Landscape / Layar Lebar */}
                {categorizedVideos.landscape.length > 0 && (
                  <div className="space-y-6">
                    {activeTab === "Semua" && (
                      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">
                          Video Dokumentasi
                        </h4>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {categorizedVideos.landscape.map((video, i) => (
                        <div
                          key={`land-${i}`}
                          className="aspect-video bg-zinc-900 rounded-2xl overflow-hidden relative group border border-gray-100 shadow-sm"
                        >
                          <video
                            src={video.image}
                            controls
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Video Portrait / Shorts */}
                {categorizedVideos.portrait.length > 0 && (
                  <div className="space-y-6">
                    {activeTab === "Semua" && (
                      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">
                          Video Shorts
                        </h4>
                      </div>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                      {categorizedVideos.portrait.map((video, i) => (
                        <div
                          key={`port-${i}`}
                          className="aspect-[9/16] bg-zinc-900 rounded-2xl overflow-hidden relative group border border-gray-100 shadow-sm"
                        >
                          <video
                            src={video.image}
                            controls
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-4 left-4">
                            <span className="bg-white/90 backdrop-blur-md text-[10px] font-bold px-3 py-1.5 rounded-full text-poktan-green uppercase shadow-sm tracking-wider">
                              Shorts
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {categorizedVideos.landscape.length === 0 && categorizedVideos.portrait.length === 0 && (
                  <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    Belum ada video dokumentasi.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SISI KANAN: ASIDE SIDEBAR (4 KOLOM) */}
          <aside className="lg:col-span-4 space-y-10 sticky top-32 h-fit mb-24">
            {/* Widget 1: Artikel Populer */}
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
              <h4 className="font-black text-sm text-gray-900 uppercase tracking-widest mb-6 pb-4 border-b border-gray-50 flex items-center gap-2">
                <SparklesIcon size={16} className="text-poktan-accent" />
                <span>ARTIKEL TERBARU</span>
              </h4>
              <div className="space-y-6">
                {articles.slice(0, 5).map((item, i) => (
                  <div key={i} className="flex gap-4 group cursor-pointer" onClick={() => setSelectedArticle(item)}>
                    <div className="w-16 h-16 rounded-xl bg-gray-100 shrink-0 overflow-hidden border border-gray-100">
                      <img
                        src={item.image}
                        alt="Thumbnail artikel terpopuler"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h5 className="text-xs font-bold text-gray-800 leading-snug group-hover:text-poktan-leaf transition-colors line-clamp-2">
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
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
              <h4 className="font-black text-sm text-gray-900 uppercase tracking-widest mb-6 pb-4 border-b border-gray-50 flex items-center gap-2">
                <Calendar size={16} className="text-[#10b981]" />
                <span>JADWAL MUSIM PANEN</span>
              </h4>
              <div className="flex flex-col gap-6">
                {/* Daftar Keseluruhan Lahan */}
                {schedules.length > 0 && (
                  <div className="flex flex-col gap-3 mb-2 bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50">
                    <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest border-b border-emerald-200/50 pb-2">Daftar Lahan / Jadwal Panen:</span>
                    {schedules.map(s => {
                      const sIdx = schedules.findIndex(x => x.id === s.id);
                      return (
                      <div key={s.id} className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-emerald-100 shadow-sm">
                        <span className="text-xs font-bold text-gray-800">{s.title}</span>
                        <div className="text-right">
                          <span className={`text-[9px] text-white px-2 py-0.5 rounded-full font-bold shadow-sm ${BG_COLORS[sIdx % BG_COLORS.length]}`}>{s.status || "PANEN"}</span>
                          <p className="text-[9px] text-gray-400 mt-1 font-semibold">{new Date(s.start_date).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})} - {new Date(s.end_date).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})}</p>
                        </div>
                      </div>
                    )})}
                  </div>
                )}

                {monthsToDisplay.map(({ year, month }) => {
                  const daysInMonth = new Date(year, month + 1, 0).getDate();
                  const firstDay = new Date(year, month, 1).getDay();
                  const emptySlots = Array.from({ length: firstDay });
                  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
                  const monthLabel = `${monthNames[month]} ${year}`;

                  const monthStart = new Date(year, month, 1);
                  const monthEnd = new Date(year, month + 1, 0);
                  
                  const activeSchedulesInMonth = schedules.filter(s => {
                    const sStart = new Date(s.start_date);
                    sStart.setHours(0,0,0,0);
                    const sEnd = new Date(s.end_date);
                    sEnd.setHours(0,0,0,0);
                    return sStart <= monthEnd && sEnd >= monthStart;
                  });

                  return (
                    <div key={`${year}-${month}`} className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100/50">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-black text-[#064e3b]">
                          {monthLabel}
                        </span>
                        <div className="flex flex-col gap-1 items-end">
                          {activeSchedulesInMonth.map((s) => {
                            const sIdx = schedules.findIndex(x => x.id === s.id);
                            return (
                              <span key={s.id} className={`text-[9px] text-white px-2 py-0.5 rounded-full font-black ${BG_COLORS[sIdx % BG_COLORS.length]}`}>
                                {s.title}
                              </span>
                            );
                          })}
                        </div>
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
                          const today = new Date();
                          const isToday = currentDate.getDate() === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
                          
                          const matchedSchedules = schedules.filter(s => {
                            const sDate = new Date(s.start_date);
                            const eDate = new Date(s.end_date);
                            sDate.setHours(0,0,0,0);
                            eDate.setHours(0,0,0,0);
                            currentDate.setHours(0,0,0,0);
                            return currentDate >= sDate && currentDate <= eDate;
                          });
                          
                          const isHighlighted = matchedSchedules.length > 0;
                          const firstMatchedIdx = isHighlighted ? schedules.findIndex(x => x.id === matchedSchedules[0].id) : 0;
                          
                          return (
                            <div key={day} className="flex justify-center items-center relative">
                              <span
                                className={`w-7 h-7 flex items-center justify-center text-[11px] font-bold transition-all relative z-10 ${
                                  isHighlighted && isToday
                                    ? `bg-gradient-to-br ${GRADIENTS[firstMatchedIdx % GRADIENTS.length]} text-white rounded-xl shadow-lg scale-110 ring-2 ring-yellow-400 ring-offset-2`
                                    : isHighlighted
                                    ? `bg-gradient-to-br ${GRADIENTS[firstMatchedIdx % GRADIENTS.length]} text-white rounded-xl shadow-lg scale-110`
                                    : isToday
                                    ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-400 rounded-full font-black scale-110 shadow-sm"
                                    : "text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl"
                                }`}
                              >
                                {day}
                                {isHighlighted && (
                                  <span className="absolute -top-1.5 -right-1.5 text-[10px] leading-none drop-shadow-md z-20" title={matchedSchedules.map(s => s.title).join(", ")}>🍈</span>
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
            <div className="p-6 pb-0 md:p-10 md:pb-0 shrink-0">
              <div className="relative aspect-video sm:aspect-[21/9] bg-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <img
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-4 right-4 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60 transition-colors backdrop-blur-sm"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            
            <div className="p-6 md:p-10 overflow-y-auto flex-1">
              <div className="flex items-center text-sm text-gray-500 mb-4 gap-2.5">
                <span className="text-poktan-green bg-poktan-accent/30 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                  {selectedArticle.tag || "Berita"}
                </span>
                <span>•</span>
                <span className="font-semibold">{selectedArticle.date}</span>
                <span>•</span>
                <span>Oleh Admin</span>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 leading-tight">
                {selectedArticle.title}
              </h2>
              
              {/* Tombol Bagikan Sosial Media (Feature 1) */}
              <div className="flex items-center gap-2 mb-6 pb-6 border-b border-gray-100 flex-wrap">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1">Bagikan:</span>
                
                {/* Bagikan WA */}
                <button
                  onClick={() => {
                    const text = encodeURIComponent(`Baca berita terbaru dari Poktan Banyu Urip: "${selectedArticle.title}"\n\nSelengkapnya di website kami.`);
                    const url = encodeURIComponent(window.location.href);
                    window.open(`https://api.whatsapp.com/send?text=${text}%20${url}`, '_blank');
                  }}
                  className="bg-emerald-50/50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-800 border border-emerald-100/60 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-sm"
                >
                  <WhatsAppIcon size={12} />
                  <span>WhatsApp</span>
                </button>

                {/* Salin Tautan */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    import('react-hot-toast').then(({ default: toast }) => {
                      toast.success("Tautan berhasil disalin!");
                    });
                  }}
                  className="bg-gray-50/50 hover:bg-gray-100 text-gray-600 hover:text-gray-800 border border-gray-200/60 text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer shadow-sm"
                >
                  <Link2 size={12} />
                  <span>Salin Link</span>
                </button>
              </div>
              
              <div className="prose prose-emerald max-w-none text-gray-600 leading-relaxed text-sm md:text-base whitespace-pre-wrap">
                {selectedArticle.desc}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <Toaster position="top-center" reverseOrder={false} />
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


