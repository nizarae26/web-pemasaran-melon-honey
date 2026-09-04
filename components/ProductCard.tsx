"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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
      icon: <i className="fa-regular fa-clock text-[14px]"></i>,
      label: "Pre-Order Sekarang",
    },
    Habis: {
      buttonColor: "bg-slate-100 text-slate-400 cursor-not-allowed",
      badgeColor: "bg-slate-50 text-slate-400 border border-slate-100",
      icon: <i className="fa-regular fa-circle-xmark text-[14px]"></i>,
      label: "Habis",
    },
  };

  // 1. Konfigurasi Promo Label (Pojok Kanan)
  const promoConfig = {
    Hot: {
      color: "bg-rose-50 text-rose-600 border border-rose-100",
      icon: <i className="fa-solid fa-fire text-[10px] text-rose-500"></i>,
      text: "HOT ITEM",
    },
    Terlaris: {
      color: "bg-amber-50 text-amber-600 border border-amber-100",
      icon: <i className="fa-solid fa-star text-[10px] text-amber-500"></i>,
      text: "BEST SELLER",
    },
    Diskon: {
      color: "bg-indigo-50 text-indigo-600 border border-indigo-100",
      icon: <i className="fa-solid fa-tag text-[10px] text-indigo-500"></i>,
      text: "PROMO",
    },
  };

  const current = statusConfig[status];
  const currentPromo = promo ? promoConfig[promo] : null;

  // Format pesan WhatsApp khusus Poktan Banyu Urip
  const waMessage = `Halo Admin Poktan Banyu Urip, saya tertarik untuk memesan/menanyakan produk melon:\n\n*Produk:* ${name}\n*Varietas/Grade:* ${grade || "-"}\n*Harga:* ${price}\n\nMohon info ketersediaan stok dan cara pemesanannya. Terima kasih!`;
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

  return (
    <motion.div 
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="bg-white border-2 border-gray-300 rounded-md shadow-lg shadow-gray-300/50 hover:shadow-xl hover:shadow-[#486e5c]/20 transition-all duration-300 group flex flex-col h-full overflow-hidden w-full"
    >
      <div className="relative aspect-[4/3] bg-slate-50/50 overflow-hidden border-b border-[#f0f4f1]/50">
        {/* Badge Status (Kiri Atas) */}
        {status !== "Tersedia" && (
          <span
            className={`absolute top-2 left-2 sm:top-3.5 sm:left-3.5 text-[8px] sm:text-[9px] font-bold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md z-10 ${current.badgeColor}`}
          >
            {status.toUpperCase()}
          </span>
        )}

        {/* PROMO LABEL (Kanan Atas) */}
        {currentPromo && (
          <div
            className={`absolute top-3.5 right-3.5 flex items-center gap-1.5 text-[9px] font-bold px-2.5 py-1 rounded-md z-10 ${currentPromo.color}`}
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

      <div className="p-2.5 sm:p-4 md:p-5 text-left flex flex-col flex-grow">
        <div className="flex items-start justify-start mb-1 sm:mb-1.5 min-h-[32px] sm:min-h-[38px]">
          <h3 
            title={name}
            className="font-bold text-gray-800 tracking-tight leading-snug line-clamp-2 text-xs sm:text-sm md:text-base"
          >
            {name}
          </h3>
        </div>
        <div className="text-[9px] sm:text-[11px] text-gray-500 mb-2 sm:mb-3 font-medium leading-tight flex flex-wrap items-center gap-x-1 gap-y-0.5">
          <span>Varian: <strong className="text-gray-700 font-bold">{grade || "-"}</strong></span>
          {status !== "Tersedia" && (
            <>
              <span className="text-gray-300">|</span> 
              <span className={status === "Habis" ? "text-poktan-red font-bold" : "text-poktan-emerald font-bold"}>
                {status}
              </span>
            </>
          )}
        </div>
        
        <div className="mt-auto pt-1 sm:pt-2">
          <p className="text-poktan-emerald font-extrabold text-sm sm:text-base md:text-lg mb-2 sm:mb-3 tracking-tight leading-tight">
            {price}
          </p>

          {status === "Habis" ? (
            <button
              disabled
              className={`flex w-full ${current.buttonColor} py-1.5 sm:py-2.5 rounded-md font-bold items-center justify-center gap-1 sm:gap-1.5 
              transition-all text-[10px] sm:text-xs`}
            >
              {current.icon}
              <span>{current.label}</span>
            </button>
          ) : (
            <div className="flex flex-col min-[1506px]:flex-row gap-2 min-[1506px]:gap-3 w-full mt-1">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                title={current.label}
                className={`flex-1 flex ${current.buttonColor} px-2 py-2 sm:py-2.5 rounded-md font-bold items-center justify-center gap-1.5 min-[1506px]:gap-2 
                transition-all duration-300 text-center text-[11px] min-[1506px]:text-xs whitespace-nowrap`}
              >
                <WhatsAppIcon size={14} className="shrink-0 group-hover:scale-110 transition-transform" />
                <span>WhatsApp</span>
              </a>
              <Link
                href="/"
                title="Pesan via Website"
                className={`flex-1 flex items-center justify-center bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm px-2 py-2 sm:py-2.5 rounded-md font-bold gap-1.5 min-[1506px]:gap-2 
                transition-all duration-300 text-center text-[11px] min-[1506px]:text-xs whitespace-nowrap`}
              >
                <i className="fa-solid fa-cart-shopping shrink-0 group-hover:scale-110 transition-transform text-[12px] min-[1506px]:text-[14px]"></i>
                <span>Website</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col h-full animate-pulse">
      <div className="relative aspect-[4/3] bg-gray-100"></div>
      <div className="p-3 sm:p-4 md:p-5 flex flex-col flex-1 relative gap-3">
        <div>
          <div className="h-5 sm:h-6 bg-gray-100 rounded-md w-3/4 mb-2"></div>
          <div className="h-3 sm:h-4 bg-gray-50 rounded-md w-1/2"></div>
        </div>
        <div className="mt-auto pt-2">
          <div className="h-5 sm:h-7 bg-gray-100 rounded-md w-1/3 mb-3"></div>
          <div className="flex gap-2">
            <div className="h-8 sm:h-10 bg-gray-100 rounded-md flex-1"></div>
            <div className="h-8 sm:h-10 bg-gray-100 rounded-md flex-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
