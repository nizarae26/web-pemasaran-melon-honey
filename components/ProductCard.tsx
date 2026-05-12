import { MessageCircle, Clock, XCircle, Flame, Star, Tag } from "lucide-react";

interface ProductProps {
  name: string;
  grade: string;
  price: string;
  weight: string;
  status: "Tersedia" | "Pre-Order" | "Habis";
  promo?: "Hot" | "Terlaris" | "Diskon";
  discountValue?: string; // <-- Tambahkan ini untuk menampung "30%", "50%", dll.
}

export default function ProductCard({
  name,
  grade,
  price,
  weight,
  status,
  promo,
  discountValue,
}: ProductProps) {
  const statusConfig = {
    Tersedia: {
      buttonColor: "bg-[#10b981]",
      badgeColor: "bg-emerald-500",
      icon: (
        <MessageCircle
          size={18}
          strokeWidth={2.5}
          fill="currentColor"
          fillOpacity={0.2}
        />
      ),
      label: "Pesan via WhatsApp",
    },
    "Pre-Order": {
      buttonColor: "bg-orange-500",
      badgeColor: "bg-orange-500",
      icon: <Clock size={18} strokeWidth={2.5} />,
      label: "Pre-Order Sekarang",
    },
    Habis: {
      buttonColor: "bg-gray-400",
      badgeColor: "bg-gray-500",
      icon: <XCircle size={18} strokeWidth={2.5} />,
      label: "Stok Habis",
    },
  };

  // 1. Konfigurasi Promo Label (Pojok Kanan)
  const promoConfig = {
    Hot: {
      color: "bg-rose-500",
      icon: <Flame size={12} fill="currentColor" />,
      text: "HOT ITEM",
    },
    Terlaris: {
      color: "bg-amber-500",
      icon: <Star size={12} fill="currentColor" />,
      text: "BEST SELLER",
    },
    Diskon: {
      color: "bg-violet-600",
      icon: <Tag size={12} fill="currentColor" />,
      text: "PROMO",
    },
  };

  const current = statusConfig[status];
  const currentPromo = promo ? promoConfig[promo] : null;

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition group">
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {/* Badge Status (Kiri Atas) */}
        <span
          className={`absolute top-3 left-3 text-white text-[9px] font-black px-2.5 py-1 rounded-lg z-10 shadow-sm ${current.badgeColor}`}
        >
          {status.toUpperCase()}
        </span>

        {/* PROMO LABEL (Kanan Atas) - Muncul jika ada prop promo */}
        {currentPromo && (
          <div
            className={`absolute top-3 right-3 flex items-center gap-1.5 text-white text-[9px] font-black px-2.5 py-1 rounded-lg z-10 shadow-md ${currentPromo.color} animate-pulse`}
          >
            {currentPromo.icon}
            {/* Jika promonya Diskon dan ada discountValue, tampilkan angkanya */}
            <span>
              {promo === "Diskon" && discountValue
                ? `DISKON ${discountValue}`
                : currentPromo.text}
            </span>
          </div>
        )}

        {/* Placeholder Gambar */}
        <div className="flex items-center justify-center h-full text-gray-400 group-hover:scale-110 transition-transform duration-700 ease-in-out">
          <span className="text-5xl">🍈</span>
        </div>
      </div>

      <div className="p-5 text-center">
        <h3 className="font-bold text-lg text-gray-800 tracking-tight">
          {name}
        </h3>
        <p className="text-[12px] text-gray-500 mb-2">
          Grade {grade} • {weight}
        </p>
        <p className="text-[#10b981] font-bold text-lg md:text-xl mb-3 tracking-tight leading-tight">
          {price}
        </p>

        <button
          disabled={status === "Habis"}
          className={`w-full ${current.buttonColor} text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 
          transition-all shadow-lg active:scale-95 disabled:opacity-80 disabled:cursor-not-allowed`}
        >
          {current.icon}
          <span className="text-sm">{current.label}</span>
        </button>
      </div>
    </div>
  );
}
