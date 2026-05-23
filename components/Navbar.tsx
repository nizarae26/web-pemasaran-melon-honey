"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Menu, X, Leaf } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Profil", href: "/profil" },
    { name: "Katalog", href: "/katalog" },
    { name: "Galeri & Berita", href: "/galeri" },
    { name: "Budidaya", href: "/budidaya" },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-[100] w-full">
      <div className="w-full px-4 md:px-12 py-4 flex items-center justify-between relative h-20">
        
        {/* 1. Logo Section */}
        <Link href="/" className="flex items-center gap-2 md:gap-3 shrink-0 relative z-[110]">
          <div className="w-9 h-9 md:w-10 md:h-10 bg-poktan-green rounded-lg flex items-center justify-center shadow-sm">
            <Leaf size={20} className="text-white" />
          </div>
          <span className="font-bold text-poktan-green leading-tight text-[12px] md:text-base">
            Kelompok Tani
            <br />
            Banyu Urip
          </span>
        </Link>

        {/* 2. Navigasi Desktop dengan Animasi Pergeseran */}
        <div className="hidden md:flex gap-8 font-bold text-sm relative">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 transition-colors duration-300 ${
                  isActive ? "text-poktan-green" : "text-gray-600 hover:text-poktan-green"
                }`}
              >
                {link.name}
                
                {/* Garis Bawah yang Bergeser */}
                {isActive && (
                  <div
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-poktan-green"
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* 3. Action Buttons */}
        <div className="flex items-center gap-2 md:gap-4 relative z-[110]">
          <Link
            href="/monitoring"
            className={`px-3 md:px-5 py-2 rounded-xl font-bold text-[10px] md:text-sm flex items-center gap-2 shadow-sm transition-all active:scale-95 ${
              pathname === "/monitoring"
                ? "bg-poktan-leaf text-white"
                : "bg-poktan-green text-white hover:bg-opacity-90"
            }`}
          >
            <LayoutDashboard size={16} />
            <span className="hidden sm:inline">Monitoring</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 border border-gray-100 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white border-t absolute w-full left-0 transition-all duration-300 ease-in-out shadow-xl
        ${isOpen ? "translate-y-0 opacity-100 visible" : "-translate-y-full opacity-0 invisible"}`}
      >
        <div className="px-8 py-6 flex flex-col gap-4 font-bold text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`py-2 border-b border-gray-50 transition-colors ${
                pathname === link.href ? "text-poktan-green" : "text-gray-600"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}