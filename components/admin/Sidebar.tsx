"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Image as ImageIcon, Newspaper, LogOut, Coffee } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Produk Melon", href: "/admin/products", icon: Package },
    { name: "Hasil Olahan", href: "/admin/olahan", icon: Coffee },
    { name: "Galeri", href: "/admin/gallery", icon: ImageIcon },
    { name: "Artikel", href: "/admin/articles", icon: Newspaper },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <span className="font-black text-xl text-[#064e3b]">AdminPanel</span>
        <button onClick={() => setIsOpen(true)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)}></div>
          <aside className="w-64 bg-white flex flex-col h-full z-50 animate-in slide-in-from-left">
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
              <span className="font-black text-xl text-[#064e3b]">AdminPanel</span>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
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
        </div>
      )}

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
