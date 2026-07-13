"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import {
  Leaf,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react";

// Komponen Ikon Manual (Anti-Error)
const FacebookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

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
    <footer className="bg-poktan-green text-white pt-20 pb-10 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 mb-16">
        {/* 1. Branding Section */}
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Image 
                src="/images/logo-putih.png" 
                alt="Logo KING Agro Wisata Putih" 
                width={60} 
                height={60} 
                className="w-full h-full object-contain"
              />
            </div>
            {/* Mengurangi ketebalan font agar lebih ringan dibaca */}
            <span className="font-medium text-lg tracking-tight leading-none">
              Kelompok Tani
              <br />
              <span className="font-bold text-xl">Banyu Urip</span>
            </span>
          </Link>
          <p className="text-sm text-white/80 leading-relaxed max-w-xs">
            Pelopor pertanian melon modern di Madura. Menghasilkan kualitas
            premium melalui teknologi irigasi tetes pintar dan dedikasi petani
            lokal Tanggumong.
          </p>
        </div>



        {/* 3. Kontak Info */}
        <div>
          <h4 className="font-bold text-lg mb-8 relative inline-block">
            Kontak Kami
            <span className="absolute -bottom-2 left-0 w-8 h-1 bg-poktan-leaf"></span>
          </h4>
          <ul className="space-y-6">
            {/* Alamat: menggunakan items-start karena teksnya panjang */}
            <li className="flex items-start gap-4 group">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white shrink-0 group-hover:bg-white group-hover:text-poktan-green transition-colors">
                <MapPin size={20} />
              </div>
              <span className="text-sm text-white/80 leading-relaxed">
                Desa Tanggumong, Kec. Sampang, Kabupaten Sampang, Madura, Jawa
                Timur 69217
              </span>
            </li>

            {/* Telepon: items-center agar sejajar tengah */}
            <li className="flex items-center gap-4 group">
              <a 
                href={`https://wa.me/${waNumber}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 group cursor-pointer"
              >
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white shrink-0 group-hover:bg-white group-hover:text-poktan-green transition-colors">
                  <Phone size={20} />
                </div>
                <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                  {formatPhoneNumber(waNumber)}
                </span>
              </a>
            </li>

          </ul>
        </div>

        {/* 4. Jam Kerja */}
        <div>
          <h4 className="font-bold text-lg mb-8 relative inline-block">
            Jam Kerja
            <span className="absolute -bottom-2 left-0 w-8 h-1 bg-poktan-leaf"></span>
          </h4>
          <div className="bg-white/10 border border-white/20 p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
              <span className="text-sm text-white/70 font-medium">
                Senin – Sabtu
              </span>
              <span className="text-sm font-bold text-white">
                07:00 – 16:00
              </span>
            </div>
            <p className="text-[11px] text-white/60 italic leading-relaxed">
              *Layanan bantuan via WhatsApp tersedia 24 jam untuk mitra dan
              pembeli.
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-white/40 font-medium tracking-wider">
        <p>© 2024 KELOMPOK TANI BANYU URIP.</p>
        <div className="flex gap-8 uppercase">
        </div>
      </div>
    </footer>
  );
}
