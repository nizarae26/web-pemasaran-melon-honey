"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import OlahanCard from "@/components/public/OlahanCard";
import KatalogHero from "@/components/public/KatalogHero";
import {
  Search,
  Filter,
  Calendar,
  Sparkles,
  MessageCircle,
  ArrowUpDown,
} from "lucide-react";

export default function KatalogPage() {
  // State untuk Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("Semua");
  const [sortBy, setSortBy] = useState("Terbaru");

  // Data Gabungan (Melon & Olahan)
  const products = [
    {
      type: "melon",
      name: "Melon Honey Globe Grade A",
      grade: "1,5 – 2,5 kg / buah",
      price: "Rp 35.000",
      weight: "Tersedia",
      status: "Tersedia" as const,
      date: 5,
    },
    {
      type: "melon",
      name: "Melon Honey Globe Grade B",
      grade: "1,2 – 1,5 kg / buah",
      price: "Rp 28.000",
      weight: "Tersedia",
      status: "Tersedia" as const,
      date: 4,
    },
    {
      type: "melon",
      name: "Melon Honey Globe Grade Jumbo",
      grade: "2,5 – 3,5 kg / buah",
      price: "Rp 55.000",
      weight: "Pre-Order",
      status: "Pre-Order" as const,
      date: 3,
    },
    {
      type: "olahan",
      name: "Keripik Melon Vacuum",
      description:
        "Keripik renyah dari melon asli tanpa tambahan pemanis buatan.",
      price: "Rp 25.000",
      image:
        "https://images.unsplash.com/photo-1623064034911-c94ed60c1d1e?q=80&w=1974",
      date: 2,
    },
    {
      type: "olahan",
      name: "Sirup Melon Premium",
      description:
        "Sari buah melon murni dengan aroma segar yang kuat untuk minuman.",
      price: "Rp 40.000",
      image:
        "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=1974",
      date: 1,
    },
  ];

  // Logika Filter & Search
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch = p.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesCategory =
          category === "Semua" ||
          (category === "Melon Segar" && p.type === "melon") ||
          (category === "Hasil Olahan" && p.type === "olahan");
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "Termurah")
          return (
            parseInt(a.price.replace(/\D/g, "")) -
            parseInt(b.price.replace(/\D/g, ""))
          );
        if (sortBy === "Termahal")
          return (
            parseInt(b.price.replace(/\D/g, "")) -
            parseInt(a.price.replace(/\D/g, ""))
          );
        return b.date - a.date; // Terbaru
      });
  }, [searchTerm, category, sortBy]);

  return (
    <main className="min-h-screen bg-gray-50/50">
      <Navbar />
      <KatalogHero />

      {/* Filter Bar Modern */}
      <section className="sticky top-20 z-40 bg-white border-b border-gray-100 py-6 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 items-center justify-between">
          {/* Search & Tabs */}
          <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
            <div className="relative group">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#10b981] transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="Cari melon atau olahan..."
                className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm w-full md:w-64 focus:ring-2 focus:ring-emerald-500/20 focus:border-[#10b981] outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
              {["Semua", "Melon Segar", "Hasil Olahan"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setCategory(tab)}
                  className={`px-6 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    category === tab
                      ? "bg-white text-[#10b981] shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
              <ArrowUpDown size={14} /> URUTKAN:
            </span>
            <select
              className="bg-transparent text-sm font-black text-gray-800 focus:outline-none cursor-pointer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="Terbaru">TERBARU</option>
              <option value="Termurah">HARGA TERENDAH</option>
              <option value="Termahal">HARGA TERTINGGI</option>
            </select>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-16 px-6 md:px-12 max-w-7xl mx-auto grid lg:grid-cols-4 gap-12">
        {/* Product Grid */}
        <div className="lg:col-span-3 space-y-14">
          {filteredProducts.length > 0 ? (
            <>
              {/* 1. Kategori Melon Segar */}
              {filteredProducts.some((item) => item.type === "melon") && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                    <div className="w-1.5 h-6 bg-[#10b981] rounded-full"></div>
                    <h3 className="text-base font-black text-gray-800 uppercase tracking-wider">
                      Melon Segar Premium
                    </h3>
                    <span className="text-xs bg-emerald-50 text-[#10b981] px-2.5 py-0.5 rounded-full font-bold">
                      {
                        filteredProducts.filter((item) => item.type === "melon")
                          .length
                      }{" "}
                      Produk
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts
                      .filter((item) => item.type === "melon")
                      .map((item, index) => (
                        <ProductCard
                          key={`melon-${index}`}
                          name={item.name}
                          grade={item.grade || ""}
                          price={item.price}
                          weight={item.weight || ""}
                          status={
                            (item.status as "Tersedia" | "Pre-Order") ||
                            "Tersedia"
                          }
                        />
                      ))}
                  </div>
                </div>
              )}

              {/* 2. Kategori Hasil Olahan */}
              {filteredProducts.some((item) => item.type === "olahan") && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
                    <div className="w-1.5 h-6 bg-orange-500 rounded-full"></div>
                    <h3 className="text-base font-black text-gray-800 uppercase tracking-wider">
                      Hasil Olahan Melon
                    </h3>
                    <span className="text-xs bg-orange-50 text-orange-600 px-2.5 py-0.5 rounded-full font-bold">
                      {
                        filteredProducts.filter(
                          (item) => item.type === "olahan",
                        ).length
                      }{" "}
                      Produk
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts
                      .filter((item) => item.type === "olahan")
                      .map((item, index) => (
                        <OlahanCard
                          key={`olahan-${index}`}
                          title={item.name}
                          description={item.description || ""}
                          price={item.price}
                          image={item.image || ""}
                        />
                      ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
              <p className="text-gray-400 font-medium">
                Ups! Produk yang Anda cari tidak ditemukan.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar Modern */}
        <aside className="space-y-8">
          <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm">
            <h4 className="font-black text-lg text-[#064e3b] mb-6 flex items-center gap-2">
              <Calendar className="text-[#10b981]" size={20} /> Musim Panen
            </h4>
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-2xl">
                <p className="font-black text-emerald-800 text-sm">
                  Mei – Agustus 2024
                </p>
                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest mt-1">
                  Status: Panen Berlangsung
                </p>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed italic">
                *Jadwal panen dapat berubah sesuai kondisi cuaca di Tanggumong.
              </p>
            </div>
          </div>

          <div className="bg-[#064e3b] rounded-[32px] p-8 text-white shadow-xl shadow-emerald-900/10">
            <h4 className="font-black text-lg mb-6 flex items-center gap-2">
              <Sparkles className="text-[#10b981]" size={20} /> Kenapa Spesial?
            </h4>
            <ul className="text-xs space-y-4 text-emerald-50/80">
              {[
                "Varietas Honey Globe Asli",
                "Irigasi Tetes Cerdas (IoT)",
                "Seleksi Buah Grade Ekspor",
                "Petani Lokal Tanggumong",
              ].map((text, i) => (
                <li key={i} className="flex gap-3 items-center">
                  <div className="w-5 h-5 bg-[#10b981] rounded-full flex items-center justify-center shrink-0">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#10b981] rounded-[32px] p-8 text-center group">
            <p className="font-black text-white text-lg mb-2">Butuh Bantuan?</p>
            <p className="text-xs text-white/80 mb-6">
              Hubungi admin untuk pesanan khusus atau kemitraan.
            </p>
            <a
              href="https://wa.me/6287812345678"
              className="w-full bg-white text-[#10b981] py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-lg active:scale-95"
            >
              <MessageCircle size={18} fill="currentColor" fillOpacity={0.2} />
              KONSULTASI WA
            </a>
          </div>
        </aside>
      </section>

      <Footer />
    </main>
  );
}
