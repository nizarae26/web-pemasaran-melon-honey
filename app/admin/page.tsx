"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  Package, 
  Users, 
  Calendar, 
  FileText, 
  Image as ImageIcon, 
  Clock, 
  ArrowRight, 
  Phone, 
  Info, 
  CalendarDays,
  ExternalLink,
  Plus
} from "lucide-react";

interface ActivityItem {
  id: string;
  desc: string;
  type: "Produk" | "Artikel" | "Galeri" | "Anggota";
  date: string;
  rawDate: number;
  link: string;
  badgeColor: string;
}

interface ScheduleItem {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  status?: string;
}

export default function AdminDashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [productCount, setProductCount] = useState(0);
  const [memberCount, setMemberCount] = useState(0);
  const [articleCount, setArticleCount] = useState(0);
  const [galleryCount, setGalleryCount] = useState(0);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [waNumber, setWaNumber] = useState<string>("");
  const [tentangKami, setTentangKami] = useState<string>("");
  const [currentDateString, setCurrentDateString] = useState("");

  useEffect(() => {
    // Real dynamic date in Indonesian
    const today = new Date();
    const formattedDate = new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(today);
    setCurrentDateString(formattedDate);

    async function fetchDashboardData() {
      setLoading(true);
      try {
        // 1. Fetch real counts & recent records in parallel
        const [
          productsRes,
          membersRes,
          articlesRes,
          galleryRes,
          settingsRes,
        ] = await Promise.all([
          supabase.from("products").select("id, name, created_at").order("created_at", { ascending: false }),
          supabase.from("members").select("id, name, role, created_at").order("created_at", { ascending: false }),
          supabase.from("articles").select("id, title, tag, created_at").order("created_at", { ascending: false }),
          supabase.from("gallery").select("id, title, category, created_at").order("created_at", { ascending: false }),
          supabase.from("settings").select("*"),
        ]);

        // Products
        const productsList = productsRes.data || [];
        setProductCount(productsList.length);

        // Members
        const membersList = membersRes.data || [];
        setMemberCount(membersList.length);

        // Articles
        const articlesList = articlesRes.data || [];
        setArticleCount(articlesList.length);

        // Gallery
        const galleryList = galleryRes.data || [];
        setGalleryCount(galleryList.length);

        // Settings (Schedules & Profile & WA)
        let parsedSchedules: ScheduleItem[] = [];
        if (settingsRes.data) {
          const multiSched = settingsRes.data.find((s) => s.key === "jadwal_panen_multi");
          const singleSched = settingsRes.data.find((s) => s.key === "jadwal_panen");
          const waSetting = settingsRes.data.find((s) => s.key === "wa_number");
          const tentangSetting = settingsRes.data.find((s) => s.key === "tentang_kami");

          if (multiSched?.value) {
            try {
              const parsed = JSON.parse(multiSched.value);
              if (Array.isArray(parsed)) {
                parsedSchedules = parsed;
              }
            } catch (e) {
              console.error("Error parsing multi schedule:", e);
            }
          } else if (singleSched?.value) {
            try {
              const parsed = JSON.parse(singleSched.value);
              if (parsed.start_date) {
                parsedSchedules = [{
                  id: "1",
                  title: "Jadwal Panen",
                  start_date: parsed.start_date,
                  end_date: parsed.end_date || parsed.start_date,
                  status: parsed.status || "PANEN",
                }];
              }
            } catch (e) {
              console.error("Error parsing single schedule:", e);
            }
          }

          if (waSetting?.value) {
            setWaNumber(waSetting.value.replace(/\D/g, ""));
          }
          if (tentangSetting?.value) {
            setTentangKami(tentangSetting.value);
          }
        }
        setSchedules(parsedSchedules);

        // 2. Build real activity feed from actual database rows
        const combinedActivities: ActivityItem[] = [];

        const formatActivityDate = (dateStr?: string) => {
          if (!dateStr) return "Baru saja";
          try {
            const d = new Date(dateStr);
            return new Intl.DateTimeFormat("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }).format(d);
          } catch {
            return dateStr;
          }
        };

        // Add real products
        productsList.slice(0, 5).forEach((p) => {
          combinedActivities.push({
            id: `PROD-${p.id}`,
            desc: `Produk: "${p.name}" ditambahkan`,
            type: "Produk",
            date: formatActivityDate(p.created_at),
            rawDate: p.created_at ? new Date(p.created_at).getTime() : 0,
            link: `/admin/products/form?id=${p.id}`,
            badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
          });
        });

        // Add real articles
        articlesList.slice(0, 5).forEach((a) => {
          combinedActivities.push({
            id: `ART-${a.id}`,
            desc: `Artikel: "${a.title}" dipublikasikan`,
            type: "Artikel",
            date: formatActivityDate(a.created_at),
            rawDate: a.created_at ? new Date(a.created_at).getTime() : 0,
            link: `/admin/articles/form?id=${a.id}`,
            badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
          });
        });

        // Add real gallery items
        galleryList.slice(0, 5).forEach((g) => {
          combinedActivities.push({
            id: `GAL-${g.id}`,
            desc: `Dokumentasi: "${g.title}" diunggah`,
            type: "Galeri",
            date: formatActivityDate(g.created_at),
            rawDate: g.created_at ? new Date(g.created_at).getTime() : 0,
            link: `/admin/gallery/form?id=${g.id}`,
            badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
          });
        });

        // Add real members
        membersList.slice(0, 5).forEach((m) => {
          combinedActivities.push({
            id: `MEM-${m.id}`,
            desc: `Anggota: ${m.name} (${m.role || "Anggota"}) terdaftar`,
            type: "Anggota",
            date: formatActivityDate(m.created_at),
            rawDate: m.created_at ? new Date(m.created_at).getTime() : 0,
            link: `/admin/members/form?id=${m.id}`,
            badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
          });
        });

        // Sort all real database entries newest first
        combinedActivities.sort((a, b) => b.rawDate - a.rawDate);
        setActivities(combinedActivities.slice(0, 7));

      } catch (err) {
        console.error("Error loading admin dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const stats = [
    {
      title: "Katalog Produk",
      value: productCount,
      subtext: "Produk melon aktif",
      icon: Package,
      path: "/admin/products",
      theme: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      title: "Anggota Poktan",
      value: memberCount,
      subtext: "Pengurus & anggota",
      icon: Users,
      path: "/admin/members",
      theme: "text-emerald-700 bg-emerald-50 border-emerald-100",
    },
    {
      title: "Jadwal Panen",
      value: schedules.length,
      subtext: "Siklus panen aktif",
      icon: Calendar,
      path: "/admin/schedule",
      theme: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      title: "Artikel & Berita",
      value: articleCount,
      subtext: "Publikasi terbit",
      icon: FileText,
      path: "/admin/articles",
      theme: "text-emerald-700 bg-emerald-50 border-emerald-100",
    },
    {
      title: "Galeri Foto & Video",
      value: galleryCount,
      subtext: "Dokumentasi media",
      icon: ImageIcon,
      path: "/admin/gallery",
      theme: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
  ];

  const getScheduleStatusBadge = (startDateStr: string, endDateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(startDateStr);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDateStr);
    end.setHours(23, 59, 59, 999);

    if (today >= start && today <= end) {
      return {
        label: "Sedang Berlangsung",
        color: "bg-emerald-100 text-emerald-800 border-emerald-200",
        isCurrent: true,
      };
    } else if (today < start) {
      return {
        label: "Akan Datang",
        color: "bg-blue-50 text-blue-700 border-blue-200",
        isCurrent: false,
      };
    } else {
      return {
        label: "Selesai",
        color: "bg-gray-100 text-gray-600 border-gray-200",
        isCurrent: false,
      };
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Top Welcome Title & Live Date */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-3xl font-black text-gray-900 tracking-tight">Dasbor</h1>
          <p className="text-gray-500 text-xs md:text-sm">Ringkasan performa perkebunan dan manajemen Poktan.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold text-gray-700 shadow-sm flex items-center gap-2">
            <Clock size={14} className="text-emerald-600" />
            <span>{currentDateString || "Memuat tanggal..."}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards Row (Real counts from database) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            onClick={() => router.push(stat.path)}
            className="bg-white p-4 md:p-5 rounded-2xl border border-gray-100/90 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider line-clamp-1">{stat.title}</span>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-transform group-hover:scale-110 ${stat.theme}`}>
                <stat.icon size={16} />
              </div>
            </div>

            <div>
              <p className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
                {loading ? "..." : stat.value}
              </p>
              <p className="text-[10px] md:text-xs text-gray-500 font-medium mt-1 flex items-center justify-between">
                <span>{stat.subtext}</span>
                <ArrowRight size={12} className="text-gray-300 group-hover:text-emerald-600 transition-colors" />
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* Left 2 Columns: Real Activity Logs */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-sm md:text-base font-bold text-gray-800">Log Aktivitas Data Terbaru</h3>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">Catatan data riil yang tersimpan di sistem database</p>
              </div>
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-gray-400">
                Memuat data aktivitas dari database...
              </div>
            ) : activities.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-400 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                <p className="font-medium text-gray-600 mb-1">Belum ada data atau aktivitas tercatat di database.</p>
                <p className="text-[10px] text-gray-400">Tambahkan produk, anggota, atau artikel untuk melihat log aktivitas di sini.</p>
              </div>
            ) : (
              <>
                {/* Desktop View Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-500">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold">
                        <th className="py-3 px-2">ID</th>
                        <th className="py-3">Deskripsi Aktivitas</th>
                        <th className="py-3">Kategori</th>
                        <th className="py-3">Waktu Pencatatan</th>
                        <th className="py-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 font-medium text-gray-700">
                      {activities.map((act) => (
                        <tr key={act.id} className="hover:bg-gray-50/60 transition-colors">
                          <td className="py-3.5 px-2 font-bold text-gray-800 font-mono text-[11px]">{act.id}</td>
                          <td className="py-3.5 max-w-[280px] truncate text-gray-900 font-semibold">{act.desc}</td>
                          <td className="py-3.5">
                            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${act.badgeColor}`}>
                              {act.type}
                            </span>
                          </td>
                          <td className="py-3.5 text-gray-500 text-[11px] font-medium">{act.date}</td>
                          <td className="py-3.5 text-right">
                            <button
                              onClick={() => router.push(act.link)}
                              className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
                            >
                              Detail
                              <ArrowRight size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View Card List */}
                <div className="block md:hidden space-y-3">
                  {activities.map((act) => (
                    <div 
                      key={act.id} 
                      onClick={() => router.push(act.link)}
                      className="bg-gray-50/60 p-3.5 rounded-xl border border-gray-100 flex items-center justify-between gap-3 text-xs active:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] font-bold text-gray-500">{act.id}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${act.badgeColor}`}>
                            {act.type}
                          </span>
                        </div>
                        <p className="text-gray-800 truncate font-bold leading-normal">{act.desc}</p>
                        <p className="text-[10px] text-gray-400 font-medium leading-none">{act.date}</p>
                      </div>
                      <ArrowRight size={14} className="text-gray-400 shrink-0" />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right 1 Column: Real Harvest Schedules & WA Profile */}
        <div className="space-y-6">
          {/* Real Harvest Schedules Card */}
          <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-sm md:text-base font-bold text-gray-800">Jadwal Panen Riil</h3>
                <p className="text-[11px] text-gray-400 font-medium mt-0.5">Monitoring agenda panen dari database</p>
              </div>
              <button 
                onClick={() => router.push("/admin/schedule")}
                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                title="Kelola Jadwal"
              >
                <CalendarDays size={16} />
              </button>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-gray-400">
                Memuat data jadwal...
              </div>
            ) : schedules.length === 0 ? (
              <div className="py-8 px-4 text-center text-xs text-gray-400 bg-gray-50/60 rounded-xl border border-dashed border-gray-200">
                <p className="font-medium text-gray-600 mb-1">Belum ada jadwal panen tersimpan.</p>
                <button
                  onClick={() => router.push("/admin/schedule")}
                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-colors cursor-pointer"
                >
                  <Plus size={12} />
                  Atur Jadwal Panen
                </button>
              </div>
            ) : (
              <div className="relative pl-5 border-l-2 border-emerald-100 space-y-5 ml-2 py-1">
                {schedules.map((item, idx) => {
                  const status = getScheduleStatusBadge(item.start_date, item.end_date);
                  return (
                    <div key={item.id || idx} className="relative">
                      {/* Timeline dot */}
                      <div className={`absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full border-2 bg-white ${
                        status.isCurrent ? "border-emerald-600" : "border-gray-300"
                      }`}>
                        {status.isCurrent && (
                          <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mx-auto mt-0.5 animate-ping"></div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-xs md:text-sm font-bold ${status.isCurrent ? "text-emerald-700" : "text-gray-800"}`}>
                            {item.title}
                          </p>
                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 font-medium">
                          {new Date(item.start_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                          {" s/d "}
                          {new Date(item.end_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Real WhatsApp Contact & Help Widget */}
          <div className="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-800">Kontak WhatsApp Admin</h3>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">Nomor WhatsApp sistem publik</p>
              </div>
              <button 
                onClick={() => router.push("/admin/settings")}
                className="text-[10px] font-bold text-emerald-600 hover:underline cursor-pointer"
              >
                Pengaturan
              </button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50/70 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">
                    {waNumber ? `+${waNumber}` : "Belum diatur"}
                  </p>
                  <p className="text-[9px] text-gray-400 font-medium">
                    {waNumber ? "Nomor aktif website" : "Atur nomor di Pengaturan"}
                  </p>
                </div>
              </div>
              {waNumber ? (
                <a 
                  href={`https://wa.me/${waNumber}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold shadow-sm flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Test WA</span>
                  <ExternalLink size={10} />
                </a>
              ) : (
                <button 
                  onClick={() => router.push("/admin/settings")}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                >
                  Atur
                </button>
              )}
            </div>

            {/* Profile snippet if available */}
            {tentangKami && (
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700 mb-1">
                  <Info size={12} className="text-emerald-600" />
                  <span>Profil Singkat Poktan</span>
                </div>
                <p className="text-[11px] text-gray-500 line-clamp-3 leading-relaxed font-medium">
                  {tentangKami}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

