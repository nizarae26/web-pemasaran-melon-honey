"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-[100] w-full">
      {/* Container: px-4 (mobile) agar lebih ke pojok, px-12 (desktop) */}
      {/* Hapus 'max-w-7xl mx-auto' jika ingin logo benar-benar di ujung layar tanpa batas lebar */}
      <div className="w-full px-4 md:px-12 py-4 flex items-center justify-between relative h-20">
        {/* 1. Logo Section - Sekarang lebih ke arah pojok kiri */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0 relative z-[110]">
          <div className="w-9 h-9 md:w-10 md:h-10 bg-poktan-green rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white text-lg md:text-xl">🌿</span>
          </div>
          <span className="font-bold text-poktan-green leading-tight text-[12px] md:text-base">
            Kelompok Tani
            <br />
            Banyu Urip
          </span>
        </div>

        {/* 2. Navigasi Desktop */}
        <div className="hidden md:flex gap-8 font-bold text-gray-600 text-sm">
          <Link href="/" className="hover:text-poktan-green transition">
            Beranda
          </Link>
          <Link href="/profil" className="hover:text-poktan-green transition">
            Profil
          </Link>
          <Link href="/budidaya" className="hover:text-poktan-green transition">
            Budidaya
          </Link>
          <Link href="/katalog" className="hover:text-poktan-green transition">
            Katalog
          </Link>
          <Link href="/galeri" className="hover:text-poktan-green transition">
            Galeri & Berita
          </Link>
        </div>

        {/* 3. Action Buttons & Hamburger Menu */}
        <div className="flex items-center gap-2 md:gap-4 relative z-[110]">
          <Link
            href="/monitoring"
            className="bg-poktan-green text-white px-3 md:px-5 py-2 rounded-xl font-bold text-[10px] md:text-sm hover:bg-opacity-90 flex items-center gap-2 shadow-sm transition-transform active:scale-95"
          >
            <span>📊</span> <span className="hidden sm:inline">Monitoring</span>
          </Link>

          {/* Tombol Hamburger */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 border border-gray-100 rounded-lg bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-all relative z-[1001]"
          >
            {isOpen ? (
              <span className="text-xl font-bold text-gray-700">✕</span>
            ) : (
              <div className="space-y-1">
                <span className="block w-5 h-0.5 bg-gray-600"></span>
                <span className="block w-5 h-0.5 bg-gray-600"></span>
                <span className="block w-5 h-0.5 bg-gray-600"></span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden bg-white border-t absolute w-full left-0 transition-all duration-300 ease-in-out shadow-xl
        ${isOpen ? "translate-y-0 opacity-100 visible" : "-translate-y-full opacity-0 invisible"}`}
      >
        <div className="px-8 py-6 flex flex-col gap-4 font-bold text-gray-600 text-sm">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="hover:text-poktan-green py-2 border-b border-gray-50"
          >
            Beranda
          </Link>
          <Link
            href="/profil"
            onClick={() => setIsOpen(false)}
            className="hover:text-poktan-green py-2 border-b border-gray-50"
          >
            Profil
          </Link>
          <Link
            href="/budidaya"
            onClick={() => setIsOpen(false)}
            className="hover:text-poktan-green py-2 border-b border-gray-50"
          >
            Budidaya
          </Link>
          <Link
            href="/katalog"
            onClick={() => setIsOpen(false)}
            className="hover:text-poktan-green py-2 border-b border-gray-50"
          >
            Katalog
          </Link>
          <Link
            href="/galeri"
            onClick={() => setIsOpen(false)}
            className="hover:text-poktan-green py-2 border-b border-gray-50"
          >
            Galeri & Berita
          </Link>
        </div>
      </div>
    </nav>
  );
}
