/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard, { ProductCardSkeleton } from "@/components/ProductCard";
import KatalogHero from "@/components/public/KatalogHero";
import {
  Filter,
  Sparkles,
  CheckCircle2,
  X,
} from "lucide-react";

export default function KatalogPage() {
  // State untuk Filter
  const [category, setCategory] = useState("Semua");
  const [selectedWeights, setSelectedWeights] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [appliedMinPrice, setAppliedMinPrice] = useState<number | null>(null);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number | null>(null);
  // Data Melon
  const [products, setProducts] = useState<any[]>([]);
  const [waNumber, setWaNumber] = useState("6287812345678");
  const [priceHoneyGlobe, setPriceHoneyGlobe] = useState("20.000");
  const [priceGoldenApollo, setPriceGoldenApollo] = useState("22.000");
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      // Fetch WhatsApp number & variant prices from settings
      const { data: settingsData } = await supabase.from("settings").select("*");
      if (settingsData) {
        const wa = settingsData.find((s) => s.key === "wa_number");
        if (wa?.value) {
          const rawWa = wa.value;
          const cleanWa = rawWa.replace(/\D/g, "");
          setWaNumber(cleanWa.startsWith("620") ? "62" + cleanWa.substring(3) : cleanWa);
        }
        const hg = settingsData.find((s) => s.key === "price_honey_globe");
        if (hg?.value) setPriceHoneyGlobe(hg.value);
        const ga = settingsData.find((s) => s.key === "price_golden_apollo");
        if (ga?.value) setPriceGoldenApollo(ga.value);
      }

      // Fetch Melon dari tabel products
      const { data: melonData } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      let combinedData: any[] = [];

      if (melonData) {
        const mappedMelon = melonData.map((item) => ({
          ...item,
          type: "melon",
          type_melon: item.type_melon || "Honey Globe",
          price_raw: item.price,
          name: `${item.name} (${item.weight ? (String(item.weight).toLowerCase().includes('kg') ? item.weight : item.weight + ' kg') : "1 kg"})`,
          grade: item.type_melon || "Honey Globe",
          price: `Rp.${Number(item.price).toLocaleString('id-ID')}`,
          status: "Tersedia",
          weight: item.weight || "1.0 kg",
          imageUrl: item.image_url,
          date: new Date(item.created_at).getTime(),
        }));
        combinedData = [...combinedData, ...mappedMelon];
      }

      setProducts(combinedData);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  // Logika Filter
  const filteredProducts = products.filter((p) => {
    // 1. Jenis Melon
    const matchCategory = category === "Semua" || (p.type === "melon" && p.type_melon === category);
    
    // 2. Harga
    const matchMinPrice = appliedMinPrice !== null ? p.price_raw >= appliedMinPrice : true;
    const matchMaxPrice = appliedMaxPrice !== null ? p.price_raw <= appliedMaxPrice : true;

    // 3. Berat
    let matchWeight = true;
    if (selectedWeights.length > 0) {
      const w = parseFloat(String(p.weight).replace(/[^\d.]/g, '')) || 0;
      matchWeight = selectedWeights.some(range => {
        if (range === "< 2 kg") return w < 2.0;
        if (range === "2-3 kg") return w >= 2.0 && w <= 3.0;
        if (range === "3-4 kg") return w > 3.0 && w <= 4.0;
        if (range === "> 4 kg") return w > 4.0;
        return false;
      });
    }

    return matchCategory && matchMinPrice && matchMaxPrice && matchWeight;
  });

  return (
    <main className="min-h-screen bg-slate-50/50">
      <Navbar />
      <KatalogHero />

      {/* Main Content Grid */}
      <section className="py-12 md:py-16 px-4 md:px-6 max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8 items-start relative">
        {/* Sidebar Kiri - Filter (Desktop Only) */}
        <aside className="hidden lg:block w-full lg:w-1/5 space-y-8 shrink-0 sticky top-28 max-h-[calc(100vh-7rem)] overflow-y-auto hide-scrollbar pb-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h4 className="font-black text-base text-gray-800 mb-4 flex items-center gap-2 border-b pb-3">
              <Filter className="text-[#10b981]" size={18} /> FILTER
            </h4>
            
            {/* Filter Jenis Melon */}
            <div className="mb-6">
              <h5 className="font-bold text-sm text-gray-700 mb-3">Jenis Melon</h5>
              <div className="space-y-2">
                {["Semua", "Honey Globe", "Golden Apollo"].map((cat) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="kategori"
                      checked={category === cat}
                      onChange={() => setCategory(cat)}
                      className="w-4 h-4 text-emerald-500 border-gray-300 focus:ring-emerald-500" 
                    />
                    <span className={`text-sm ${category === cat ? "text-emerald-600 font-bold" : "text-gray-600 group-hover:text-emerald-500"}`}>
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter Berat / Ukuran */}
            <div className="mb-6 border-t pt-4">
              <h5 className="font-bold text-sm text-gray-700 mb-3">Berat / Ukuran</h5>
              <div className="space-y-2">
                {["< 2 kg", "2-3 kg", "3-4 kg", "> 4 kg"].map((ukuran, i) => (
                  <label key={i} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={selectedWeights.includes(ukuran)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedWeights([...selectedWeights, ukuran]);
                        } else {
                          setSelectedWeights(selectedWeights.filter(w => w !== ukuran));
                        }
                      }}
                      className="w-4 h-4 text-emerald-500 rounded border-gray-300 focus:ring-emerald-500" 
                    />
                    <span className="text-sm text-gray-600 group-hover:text-emerald-500">
                      {ukuran}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter Harga */}
            <div className="border-t pt-4">
              <h5 className="font-bold text-sm text-gray-700 mb-3">Batas Harga</h5>
              <div className="space-y-3">
                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
                  <span className="text-xs text-gray-500 font-bold pl-2">Rp</span>
                  <input 
                    type="number" 
                    placeholder="MIN" 
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none font-medium" 
                  />
                </div>
                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
                  <span className="text-xs text-gray-500 font-bold pl-2">Rp</span>
                  <input 
                    type="number" 
                    placeholder="MAX" 
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none font-medium" 
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => {
                      setCategory("Semua");
                      setSelectedWeights([]);
                      setMinPrice("");
                      setMaxPrice("");
                      setAppliedMinPrice(null);
                      setAppliedMaxPrice(null);
                    }}
                    className="w-1/3 bg-slate-100 hover:bg-slate-200 text-gray-600 py-2.5 rounded-full font-bold text-xs transition-all duration-300 active:scale-95 cursor-pointer"
                  >
                    Hapus
                  </button>
                  <button 
                    onClick={() => {
                      setAppliedMinPrice(minPrice ? Number(minPrice) : null);
                      setAppliedMaxPrice(maxPrice ? Number(maxPrice) : null);
                    }}
                    className="w-2/3 bg-poktan-leaf hover:bg-poktan-green text-white py-2.5 rounded-full font-bold text-xs transition-all duration-300 shadow-md shadow-poktan-leaf/10 hover:shadow-lg hover:shadow-poktan-leaf/20 active:scale-95 cursor-pointer"
                  >
                    Terapkan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid (Tengah) */}
        <div className="w-full lg:w-3/5 space-y-8 min-w-0">
          {/* Menu Filter (Tablet & Mobile Only) - Sejajar, Ringkas & Mengambang */}
          <div className="lg:hidden relative bg-white p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between gap-2">
            {/* Kategori Cepat Sejajar */}
            <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar py-0.5 min-w-0">
              {["Semua", "Honey Globe", "Golden Apollo"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-2.5 sm:px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                    category === cat
                      ? "bg-poktan-leaf text-white shadow-xs"
                      : "bg-gray-100/90 text-gray-600 hover:bg-gray-200/90"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Container Tombol & Popover Filter Mengambang */}
            <div className="relative shrink-0">
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold transition-all cursor-pointer border ${
                  mobileFilterOpen
                    ? "bg-poktan-green text-white border-poktan-green shadow-xs"
                    : "bg-emerald-50 hover:bg-emerald-100 text-poktan-green border-emerald-200/70"
                }`}
              >
                <Filter size={12} className="sm:w-3.5 sm:h-3.5" />
                <span>Filter</span>
                {(selectedWeights.length > 0 || appliedMinPrice || appliedMaxPrice) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-poktan-red"></span>
                )}
              </button>

              {/* Panel Filter Mengambang di Bawah Tombol (Floating Popover) */}
              {mobileFilterOpen && (
                <>
                  {/* Backdrop transparan luar */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMobileFilterOpen(false)}
                  />

                  {/* Panel Popover */}
                  <div className="absolute top-full right-0 mt-2 z-50 w-[290px] sm:w-[350px] bg-white border border-gray-200 rounded-2xl shadow-2xl p-4 sm:p-5 animate-slide-up">
                    <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-gray-100">
                      <h4 className="font-extrabold text-xs sm:text-sm text-gray-800 flex items-center gap-1.5">
                        <Filter className="text-[#10b981]" size={14} /> Filter Produk
                      </h4>
                      <button
                        onClick={() => setMobileFilterOpen(false)}
                        className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer text-gray-500 hover:text-gray-800"
                      >
                        <X size={13} />
                      </button>
                    </div>

                    {/* Filter Jenis Melon */}
                    <div className="mb-3.5">
                      <h5 className="font-bold text-[11px] sm:text-xs text-gray-700 mb-1.5">Jenis Melon</h5>
                      <div className="flex flex-wrap gap-1.5">
                        {["Semua", "Honey Globe", "Golden Apollo"].map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
                              category === cat
                                ? "bg-poktan-leaf text-white shadow-xs"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Filter Berat / Ukuran */}
                    <div className="mb-3.5 border-t border-gray-100 pt-2.5">
                      <h5 className="font-bold text-[11px] sm:text-xs text-gray-700 mb-1.5">Berat / Ukuran</h5>
                      <div className="flex flex-wrap gap-1.5">
                        {["< 2 kg", "2-3 kg", "3-4 kg", "> 4 kg"].map((ukuran, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              if (selectedWeights.includes(ukuran)) {
                                setSelectedWeights(selectedWeights.filter(w => w !== ukuran));
                              } else {
                                setSelectedWeights([...selectedWeights, ukuran]);
                              }
                            }}
                            className={`px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
                              selectedWeights.includes(ukuran)
                                ? "bg-poktan-leaf text-white shadow-xs"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {ukuran}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Filter Harga */}
                    <div className="border-t border-gray-100 pt-2.5 mb-3.5">
                      <h5 className="font-bold text-[11px] sm:text-xs text-gray-700 mb-1.5">Batas Harga</h5>
                      <div className="flex gap-2">
                        <div className="flex-1 flex items-center gap-1 bg-gray-50 px-2 py-1.5 rounded-lg border border-gray-200">
                          <span className="text-[10px] text-gray-400 font-bold">Rp</span>
                          <input 
                            type="number" 
                            placeholder="MIN" 
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-full bg-transparent text-[11px] sm:text-xs outline-none font-medium" 
                          />
                        </div>
                        <div className="flex-1 flex items-center gap-1 bg-gray-50 px-2 py-1.5 rounded-lg border border-gray-200">
                          <span className="text-[10px] text-gray-400 font-bold">Rp</span>
                          <input 
                            type="number" 
                            placeholder="MAX" 
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-full bg-transparent text-[11px] sm:text-xs outline-none font-medium" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-1">
                      <button 
                        onClick={() => {
                          setCategory("Semua");
                          setSelectedWeights([]);
                          setMinPrice("");
                          setMaxPrice("");
                          setAppliedMinPrice(null);
                          setAppliedMaxPrice(null);
                        }}
                        className="w-1/3 bg-slate-100 hover:bg-slate-200 text-gray-600 py-1.5 rounded-xl font-bold text-[10px] sm:text-xs transition-all cursor-pointer"
                      >
                        Reset
                      </button>
                      <button 
                        onClick={() => {
                          setAppliedMinPrice(minPrice ? Number(minPrice) : null);
                          setAppliedMaxPrice(maxPrice ? Number(maxPrice) : null);
                          setMobileFilterOpen(false);
                        }}
                        className="w-2/3 bg-poktan-leaf hover:bg-poktan-green text-white py-1.5 rounded-xl font-bold text-[10px] sm:text-xs transition-all shadow-md shadow-poktan-leaf/10 active:scale-95 cursor-pointer"
                      >
                        Terapkan
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <div className="animate-spin rounded-full h-12 w-12 border-[4px] border-emerald-100 border-t-poktan-leaf mb-4"></div>
              <p className="text-gray-500 font-bold animate-pulse">Memuat Produk...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
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

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-6">
                    {filteredProducts
                      .filter((item) => item.type === "melon")
                      .map((item, index) => (
                        <ProductCard
                          key={`melon-${index}`}
                          name={item.name}
                          grade={item.grade}
                          price={item.price}
                          weight={item.weight}
                          status={item.status}
                          imageUrl={item.imageUrl}
                          waNumber={waNumber}
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

        {/* Sidebar Kanan (Paten) - Varian & Info */}
        <aside className="hidden lg:block w-full lg:w-1/5 space-y-6 shrink-0 sticky top-28 max-h-[calc(100vh-7rem)] overflow-y-auto hide-scrollbar pb-4">
          {/* Widget 1: Varian Melon */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h4 className="font-black text-sm text-[#064e3b] mb-4 flex items-center gap-2 border-b pb-3">
              <CheckCircle2 className="text-[#10b981]" size={16} /> Varian Melon
            </h4>
            
            <div className="space-y-3">
              {/* Card 1 */}
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3">
                <h5 className="font-black text-gray-800 text-[11px] mb-1 uppercase tracking-wide">Putih Honeyglobe</h5>
                <p className="text-[#10b981] font-bold text-xs mb-1">Rp {priceHoneyGlobe} <span className="text-gray-400 text-[9px] font-medium">/ kg</span></p>
              </div>

              {/* Card 2 */}
              <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3">
                <h5 className="font-black text-gray-800 text-[11px] mb-1 uppercase tracking-wide">Kuning Golden Appolo</h5>
                <p className="text-yellow-600 font-bold text-xs mb-1">Rp {priceGoldenApollo} <span className="text-yellow-600/60 text-[9px] font-medium">/ kg</span></p>
              </div>
            </div>
          </div>

          <div className="bg-[#064e3b] rounded-2xl p-6 text-white shadow-lg shadow-emerald-900/10">
            <h4 className="font-black text-sm mb-4 flex items-center gap-2 border-b border-white/10 pb-3">
              <Sparkles className="text-[#10b981]" size={16} /> Kenapa Spesial?
            </h4>
            <ul className="text-[11px] space-y-3 text-emerald-50/80">
              {[
                "Varietas Honey Globe & Golden Apollo Asli",
                "Irigasi Tetes Cerdas",
                "Grade Ekspor",
              ].map((text, i) => (
                <li key={i} className="flex gap-2 items-start">
                  <div className="w-4 h-4 bg-[#10b981] rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                  </div>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      <Footer waNumber={waNumber} />
    </main>
  );
}


