"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, XCircle, Flame, Star, Tag, ShoppingCart } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";

interface ProductProps {
  name: string;
  grade: string;
  price: string;
  weight: string;
  status: "Tersedia" | "Pre-Order" | "Habis";
  promo?: "Hot" | "Terlaris" | "Diskon";
  discountValue?: string; 
  imageUrl?: string;
  waNumber?: string;
}

export default function ProductCard({
  name,
  grade,
  price,
  weight,
  status,
  promo,
  discountValue,
  imageUrl,
  waNumber = "6287812345678",
}: ProductProps) {
  const statusConfig = {
    Tersedia: {
      buttonColor: "bg-poktan-leaf hover:bg-poktan-green text-white shadow-md shadow-poktan-leaf/10",
      badgeColor: "bg-emerald-50 text-emerald-700 border border-emerald-100",
      icon: (
        <WhatsAppIcon
          size={14}
          className="group-hover:translate-x-0.5 transition-transform"
        />
      ),
      label: "Pesan via WhatsApp",
    },
    "Pre-Order": {
      buttonColor: "bg-poktan-orange hover:opacity-95 text-white shadow-md shadow-poktan-orange/10",
      badgeColor: "bg-orange-50 text-orange-700 border border-orange-100",
      icon: <Clock size={16} strokeWidth={2.5} />,
      label: "Pre-Order Sekarang",
    },
    Habis: {
      buttonColor: "bg-slate-100 text-slate-400 cursor-not-allowed",
      badgeColor: "bg-slate-50 text-slate-400 border border-slate-100",
      icon: <XCircle size={16} strokeWidth={2.5} />,
      label: "Habis",
    },
  };

  // 1. Konfigurasi Promo Label (Pojok Kanan)
  const promoConfig = {
    Hot: {
      color: "bg-rose-50 text-rose-600 border border-rose-100",
      icon: <Flame size={12} fill="currentColor" className="text-rose-500" />,
      text: "HOT ITEM",
    },
    Terlaris: {
      color: "bg-amber-50 text-amber-600 border border-amber-100",
      icon: <Star size={12} fill="currentColor" className="text-amber-500" />,
      text: "BEST SELLER",
    },
    Diskon: {
      color: "bg-indigo-50 text-indigo-600 border border-indigo-100",
      icon: <Tag size={12} fill="currentColor" className="text-indigo-500" />,
      text: "PROMO",
    },
  };

  const current = statusConfig[status];
  const currentPromo = promo ? promoConfig[promo] : null;

  // Format pesan WhatsApp
  const waMessage = `Halo, saya tertarik untuk membeli/pre-order ${name} (Grade ${grade})`;
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

  return (
    <motion.div 
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="bg-white rounded-xl sm:rounded-2xl border border-[#f0f4f1] hover:border-poktan-leaf/25 hover:shadow-xl hover:shadow-[#486e5c]/5 transition-all duration-300 group flex flex-col h-full overflow-hidden"
    >
      <div className="relative aspect-[4/3] bg-slate-50/50 overflow-hidden border-b border-[#f0f4f1]/50">
        {/* Badge Status (Kiri Atas) */}
        <span
          className={`absolute top-2 left-2 sm:top-3.5 sm:left-3.5 text-[8px] sm:text-[9px] font-bold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full z-10 ${current.badgeColor}`}
        >
          {status.toUpperCase()}
        </span>

        {/* PROMO LABEL (Kanan Atas) */}
        {currentPromo && (
          <div
            className={`absolute top-3.5 right-3.5 flex items-center gap-1.5 text-[9px] font-bold px-2.5 py-1 rounded-full z-10 ${currentPromo.color}`}
          >
            {currentPromo.icon}
            <span>
              {promo === "Diskon" && discountValue
                ? `DISKON ${discountValue}`
                : currentPromo.text}
            </span>
          </div>
        )}

        {/* Gambar Produk atau Placeholder */}
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out" 
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 group-hover:scale-105 transition-transform duration-700 ease-in-out">
            <span className="text-5xl">🍈</span>
          </div>
        )}
      </div>

      <div className="p-3 sm:p-5 text-left flex flex-col flex-grow">
        <div className="flex items-center justify-start mb-1 sm:mb-2">
          <h3 
            title={name}
            className={`font-bold text-gray-800 tracking-tight leading-tight truncate ${
              name.length > 20 ? "text-xs sm:text-sm" : "text-xs sm:text-sm md:text-base"
            }`}
          >
            {name}
          </h3>
        </div>
        <p className="text-[9px] sm:text-[11px] text-gray-500 mb-2 sm:mb-3 font-medium block truncate">
          Varian: <span className="font-bold text-gray-700">{grade || "-"}</span> 
          {weight && (
            <>
              <span className="mx-1 sm:mx-1.5 text-gray-300">|</span> 
              <span>{weight}</span>
            </>
          )}
          <span className="mx-1 sm:mx-1.5 text-gray-300">|</span> 
          <span className={status === "Habis" ? "text-poktan-red font-bold" : "text-poktan-emerald font-bold"}>
            {status}
          </span>
        </p>
        
        <div className="mt-auto pt-1 sm:pt-2">
          <p className="text-poktan-emerald font-extrabold text-base sm:text-lg mb-2 sm:mb-3 tracking-tight leading-tight">
            {price}
          </p>

          {status === "Habis" ? (
            <button
              disabled
              className={`flex w-full ${current.buttonColor} py-2 sm:py-2.5 rounded-xl font-bold items-center justify-center gap-1.5 
              transition-all text-xs`}
            >
              {current.icon}
              <span>{current.label}</span>
            </button>
          ) : (
            <div className="flex gap-1.5 sm:gap-2 w-full">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                title={current.label}
                className={`flex flex-1 min-w-0 ${current.buttonColor} px-2 py-2 sm:py-2.5 rounded-xl font-bold items-center justify-center gap-1 sm:gap-1.5 
                transition-all duration-300 text-center text-[10px] sm:text-xs whitespace-nowrap`}
              >
                <WhatsAppIcon size={14} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
                <span className="truncate">WhatsApp</span>
              </a>
              <Link
                href="/"
                title="Pesan via Website"
                className={`flex flex-1 min-w-0 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md px-2 py-2 sm:py-2.5 rounded-xl font-bold items-center justify-center gap-1 sm:gap-1.5 
                transition-all duration-300 text-center text-[10px] sm:text-xs whitespace-nowrap`}
              >
                <ShoppingCart size={14} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
                <span className="truncate">Website</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

