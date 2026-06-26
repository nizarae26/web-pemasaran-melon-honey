"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Image as ImageIcon, Newspaper, LogOut, Coffee, Settings, Users, Calendar } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Produk Melon", href: "/admin/products", icon: Package },
    { name: "Galeri", href: "/admin/gallery", icon: ImageIcon },
    { name: "Artikel", href: "/admin/articles", icon: Newspaper },
    { name: "Keanggotaan", href: "/admin/members", icon: Users },
    { name: "Jadwal Panen", href: "/admin/schedule", icon: Calendar },
    { name: "Pengaturan", href: "/admin/settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Top App Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <LayoutDashboard size={16} className="text-white" />
          </div>
          <span className="font-black text-lg text-gray-900 tracking-tight">AdminPanel</span>
        </div>
        <Link href="/" className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
          <LogOut size={20} />
        </Link>
      </div>

      {/* Mobile Bottom Navigation (PWA Style) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-50 px-2 py-2 flex justify-between pb-safe">
        {menuItems.map((item) => {
          const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full py-1 rounded-xl transition-all ${
                isActive ? "text-[#10b981]" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <div className={`p-1.5 rounded-full mb-1 transition-all ${isActive ? 'bg-emerald-50' : 'bg-transparent'}`}>
                <item.icon size={22} className={isActive ? "fill-emerald-100/50" : ""} />
              </div>
              <span className={`text-[10px] leading-none ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.name.split(" ")[0]} {/* Shorten name for mobile */}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col h-screen sticky top-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <span className="font-black text-xl text-[#064e3b]">AdminPanel</span>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                  isActive ? "bg-emerald-50 text-[#10b981]" : "text-gray-600 hover:text-[#10b981] hover:bg-emerald-50"
                }`}
              >
                <item.icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-500 hover:bg-red-50 transition-colors">
            <LogOut size={18} />
            Keluar
          </Link>
        </div>
      </aside>
    </>
  );
}
