"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, Image as ImageIcon, Newspaper, LogOut, Settings, Users, Calendar, Leaf, Menu } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Swal from "sweetalert2";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda akan keluar dari sesi administrator!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Ya, Keluar!",
      cancelButtonText: "Batal",
      customClass: {
        popup: 'rounded-3xl'
      }
    });

    if (result.isConfirmed) {
      await supabase.auth.signOut();
      document.cookie = "admin_session=; path=/; max-age=0; SameSite=Strict";
      router.push("/login");
    }
  };

  const mainGroup = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Produk Melon", href: "/admin/products", icon: Package },
    { name: "Galeri", href: "/admin/gallery", icon: ImageIcon },
    { name: "Artikel", href: "/admin/articles", icon: Newspaper },
  ];

  const othersGroup = [
    { name: "Keanggotaan", href: "/admin/members", icon: Users },
    { name: "Jadwal Panen", href: "/admin/schedule", icon: Calendar },
    { name: "Pengaturan", href: "/admin/settings", icon: Settings },
  ];

  // Mobile Bottom Bar has 5 slots: 4 primary links + 1 "More" menu
  const mobilePrimaryItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Produk", href: "/admin/products", icon: Package },
    { name: "Galeri", href: "/admin/gallery", icon: ImageIcon },
    { name: "Artikel", href: "/admin/articles", icon: Newspaper },
  ];

  return (
    <>
      {/* Mobile Top Brand Header */}
      <div className="md:hidden flex items-center justify-between h-14 px-4 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#10b981] rounded-lg flex items-center justify-center text-white font-black text-sm shrink-0">
            M
          </div>
          <span className="font-black text-sm text-gray-800 tracking-tight leading-none">Banyu Urip Admin</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-extrabold text-[9px]">
            A
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 text-red-500 hover:bg-red-55/10 rounded-lg transition-colors cursor-pointer"
            title="Keluar"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar (5 slots, Spacious) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-8px_20px_rgba(0,0,0,0.04)] z-40 px-2 py-1.5 flex justify-around pb-safe">
        {mobilePrimaryItems.map((item) => {
          const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 transition-all w-16 ${
                isActive ? "text-[#10b981]" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <div className={`p-1 rounded-full mb-0.5 transition-all ${isActive ? 'bg-emerald-50/70' : 'bg-transparent'}`}>
                <item.icon size={20} className={isActive ? "fill-emerald-100/30" : ""} />
              </div>
              <span className={`text-[9px] leading-none tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}

        {/* Slot 5: "Lainnya" (More menu drawer) */}
        <button
          onClick={() => setIsMoreOpen(true)}
          className={`flex flex-col items-center justify-center py-1 transition-all w-16 cursor-pointer ${
            isMoreOpen ? "text-[#10b981]" : "text-gray-400"
          }`}
        >
          <div className={`p-1 rounded-full mb-0.5 transition-all ${isMoreOpen ? 'bg-emerald-50/70' : 'bg-transparent'}`}>
            <Menu size={20} />
          </div>
          <span className={`text-[9px] leading-none tracking-tight ${isMoreOpen ? 'font-bold' : 'font-medium'}`}>
            Lainnya
          </span>
        </button>
      </div>

      {/* Mobile Menu "Lainnya" Bottom Sheet */}
      {isMoreOpen && (
        <>
          {/* Backdrop overlay */}
          <div 
            onClick={() => setIsMoreOpen(false)}
            className="md:hidden fixed inset-0 bg-black/45 backdrop-blur-xs z-50 transition-opacity"
          />
          {/* Bottom Sheet Drawer */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white rounded-t-[28px] z-55 p-5 pb-8 space-y-5 shadow-2xl border-t border-gray-50 transition-all duration-300 transform translate-y-0">
            {/* Drag Handle Indicator */}
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto -mt-2"></div>
            
            <div className="px-1">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Menu Lainnya</h4>
              <p className="text-sm font-black text-gray-800 mt-0.5">Kelola data administrasi</p>
            </div>

            {/* Menu options grid */}
            <div className="grid grid-cols-3 gap-3">
              {othersGroup.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMoreOpen(false)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all border ${
                      isActive 
                        ? "bg-emerald-50 border-emerald-100 text-[#10b981]" 
                        : "bg-gray-50/50 border-transparent text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon size={20} className="mb-1.5" />
                    <span className="text-[10px] font-bold text-center leading-tight">{item.name}</span>
                  </Link>
                );
              })}
            </div>

          </div>
        </>
      )}

      {/* Desktop Sidebar (Persistent) */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-100 flex-col h-screen sticky top-0 shrink-0">
        {/* Logo Section */}
        <div className="h-16 flex items-center px-6 border-b border-gray-50 gap-2.5">
          <div className="w-7 h-7 bg-[#10b981] rounded-lg flex items-center justify-center text-white font-black text-sm shrink-0">
            M
          </div>
          <span className="font-black text-base text-gray-800 tracking-tight leading-none">
            Banyu Urip
            <br />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Admin Panel</span>
          </span>
        </div>

        {/* Navigation Menus */}
        <div className="flex-1 py-6 px-4 space-y-6 overflow-y-auto">
          {/* Main Menu Group */}
          <div className="space-y-1.5">
            <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Main</p>
            <nav className="space-y-0.5">
              {mainGroup.map((item) => {
                const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
                      isActive 
                        ? "bg-emerald-50/75 text-[#10b981]" 
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-50/50"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#10b981] rounded-r-full" />
                    )}
                    <item.icon size={16} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Others Menu Group */}
          <div className="space-y-1.5">
            <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Others</p>
            <nav className="space-y-0.5">
              {othersGroup.map((item) => {
                const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all relative ${
                      isActive 
                        ? "bg-emerald-50/75 text-[#10b981]" 
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-50/50"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#10b981] rounded-r-full" />
                    )}
                    <item.icon size={16} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Banner & Logout */}
        <div className="p-4 border-t border-gray-50 space-y-4">
          {/* Promo Card similar to Reference Image */}
          <div className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white p-4 rounded-[20px] relative overflow-hidden shadow-md shadow-emerald-900/10">
            <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-emerald-700/20 rounded-full blur-xl"></div>
            <div className="relative space-y-3">
              <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400">
                <Leaf size={16} />
              </div>
              <div>
                <p className="text-[11px] font-black tracking-wide text-emerald-300 uppercase">Poktan Banyu Urip</p>
                <p className="text-[9px] text-emerald-100/70 font-medium mt-0.5 leading-relaxed">Melon Honey Premium Wisata Agro Tanggumong.</p>
              </div>
              <a 
                href="/" 
                target="_blank"
                className="block text-center w-full py-2 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl text-[10px] font-black transition-all active:scale-95 cursor-pointer"
              >
                Lihat Website
              </a>
            </div>
          </div>

          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-500 hover:bg-red-50 transition-colors cursor-pointer text-left">
            <LogOut size={16} />
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
}
