"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
  MapPin,
  Phone,
} from "lucide-react";

const sanitizeWaNumber = (num: string) => {
  const clean = num.replace(/\D/g, "");
  if (clean.startsWith("620")) {
    return "62" + clean.substring(3);
  }
  return clean;
};

const formatPhoneNumber = (num: string) => {
  const clean = sanitizeWaNumber(num);
  if (clean.startsWith("62")) {
    const withoutCountry = clean.substring(2);
    if (withoutCountry.length >= 8) {
      const part1 = withoutCountry.substring(0, 3);
      const part2 = withoutCountry.substring(3, 7);
      const part3 = withoutCountry.substring(7);
      return `0${part1}-${part2}-${part3}`;
    }
    return `0${withoutCountry}`;
  }
  if (clean.startsWith("0")) {
    const withoutZero = clean.substring(1);
    if (withoutZero.length >= 8) {
      const part1 = withoutZero.substring(0, 3);
      const part2 = withoutZero.substring(3, 7);
      const part3 = withoutZero.substring(7);
      return `0${part1}-${part2}-${part3}`;
    }
  }
  return num;
};

interface FooterProps {
  waNumber?: string;
}

export default function Footer({ waNumber: propWaNumber }: FooterProps) {
  const [waNumber, setWaNumber] = useState(
    propWaNumber ? sanitizeWaNumber(propWaNumber) : "6287812345678"
  );

  useEffect(() => {
    if (propWaNumber) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWaNumber(sanitizeWaNumber(propWaNumber));
      return;
    }
    async function fetchWa() {
      const { data } = await supabase.from("settings").select("*");
      if (data) {
        const wa = data.find((s) => s.key === "wa_number");
        if (wa?.value) {
          setWaNumber(sanitizeWaNumber(wa.value));
        }
      }
    }
    fetchWa();
  }, [propWaNumber]);

  return (
    <footer className="bg-poktan-green text-white pt-14 md:pt-16 pb-8 md:pb-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14 mb-12 md:mb-16">
        {/* 1. Branding Section (Tanpa Logo) */}
        <div className="space-y-4">
          <Link href="/" className="inline-block group">
            <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-white group-hover:text-emerald-200 transition-colors">
              Kelompok Tani Banyu Urip
            </h3>
          </Link>
          <p className="text-xs md:text-sm text-white/80 leading-relaxed max-w-sm">
            Pelopor pertanian melon modern di Madura. Menghasilkan varietas
            Melon Honey Globe & Golden Apollo berkualitas premium melalui teknologi irigasi tetes pintar dan dedikasi petani lokal Tanggumong.
          </p>
        </div>

        {/* 2. Kontak Info */}
        <div>
          <h4 className="font-bold text-base md:text-lg mb-5 relative inline-block text-white">
            Kontak Kami
            <span className="absolute -bottom-1.5 left-0 w-8 h-0.5 bg-poktan-emerald rounded-full"></span>
          </h4>
          <ul className="space-y-4">
            {/* Alamat */}
            <li className="flex items-start gap-3.5 group">
              <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center text-white shrink-0 group-hover:bg-white group-hover:text-poktan-green transition-colors mt-0.5">
                <MapPin size={18} />
              </div>
              <span className="text-xs md:text-sm text-white/80 leading-relaxed">
                Desa Tanggumong, Kec. Sampang, Kabupaten Sampang, Madura, Jawa Timur 69217
              </span>
            </li>

            {/* Telepon / WA */}
            <li>
              <a 
                href={`https://wa.me/${waNumber}?text=${encodeURIComponent("Halo Admin Poktan Banyu Urip, saya ingin bertanya seputar produk melon dan informasi perkebunan. Terima kasih!")}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 group cursor-pointer"
              >
                <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center text-white shrink-0 group-hover:bg-white group-hover:text-poktan-green transition-colors">
                  <Phone size={18} />
                </div>
                <span className="text-xs md:text-sm text-white/80 group-hover:text-white transition-colors">
                  {formatPhoneNumber(waNumber)}
                </span>
              </a>
            </li>
          </ul>
        </div>

        {/* 3. Jam Kerja */}
        <div>
          <h4 className="font-bold text-base md:text-lg mb-5 relative inline-block text-white">
            Jam Kerja
            <span className="absolute -bottom-1.5 left-0 w-8 h-0.5 bg-poktan-emerald rounded-full"></span>
          </h4>
          <div className="bg-white/10 border border-white/15 p-5 rounded-2xl">
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-white/10 text-xs md:text-sm">
              <span className="text-white/75 font-medium">
                Senin – Sabtu
              </span>
              <span className="font-bold text-white">
                07:00 – 16:00
              </span>
            </div>
            <p className="text-[10px] md:text-[11px] text-white/60 italic leading-relaxed">
              *Layanan bantuan via WhatsApp tersedia 24 jam untuk mitra dan pembeli.
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] md:text-xs text-white/70 font-medium tracking-wide">
        <p>© 2024 Kelompok Tani Banyu Urip. All rights reserved.</p>
      </div>
    </footer>
  );
}
