"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import KatalogHero from "@/components/public/KatalogHero";
import {
  Search,
  Filter,
  Calendar,
  Sparkles,
  ArrowUpDown,
  CheckCircle2,
  X,
  SlidersHorizontal,
} from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";

export default function KatalogPage() {
  // State untuk Filter
  const [category, setCategory] = useState("Semua");
  const [selectedWeights, setSelectedWeights] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [appliedMinPrice, setAppliedMinPrice] = useState<number | null>(null);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState<number | null>(null);
  // Data Melon
  const [products, setProducts] = useState<any[] /* eslint-disable-line @typescript-eslint/no-explicit-any */>([]);
  const [waNumber, setWaNumber] = useState("6287812345678");
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      // Fetch WhatsApp number from settings
      const { data: settingsData } = await supabase.from("settings").select("*");
      if (settingsData) {
        const wa = settingsData.find((s) => s.key === "wa_number");
        if (wa?.value) {
          const rawWa = wa.value;
          const cleanWa = rawWa.replace(/\D/g, "");
          setWaNumber(cleanWa.startsWith("620") ? "62" + cleanWa.substring(3) : cleanWa);
        }
      }

      // Fetch Melon dari tabel products
      const { data: melonData } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      let combinedData: any[] /* eslint-disable-line @typescript-eslint/no-explicit-any */ = [];

      if (melonData) {
        const mappedMelon = melonData.map((item) => ({
          ...item,
          type: "melon",
          type_melon: item.type_melon || "Honey Globe",
          price_raw: item.price,
          name: `${item.name} (${item.weight ? (String(item.weight).toLowerCase().includes('kg') ? item.weight : item.weight + ' kg') : "1 kg"})`,
          grade: item.type_melon || "Honey Globe",
          price: `Rp.${Number(item.price).toLocaleString('id-ID')}`,
          status: item.stock > 0 ? "Tersedia" : "Habis",
          weight: item.weight || "1.0 kg",
          imageUrl: item.image_url,
          date: new Date(item.created_at).getTime(),
        }));
        combinedData = [...combinedData, ...mappedMelon];
      }

      // Urutkan agar produk yang "Tersedia" tampil di atas
      combinedData.sort((a, b) => {
        if (a.status === "Tersedia" && b.status === "Habis") return -1;
        if (a.status === "Habis" && b.status === "Tersedia") return 1;
        return 0; // Jika sama-sama Tersedia/Habis, biarkan sesuai urutan aslinya (berdasarkan created_at)
      });

      setProducts(combinedData);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="bg-poktan-leaf hover:bg-poktan-green text-white px-5 h-12 rounded-full shadow-lg shadow-poktan-leaf/30 flex items-center justify-center gap-2 transition-all duration-300 active:scale-90 cursor-pointer"
        >
          <Filter size={18} />
          <span className="text-sm font-bold">Filter</span>
        </button>
      </div>

      {/* Mobile Filter Overlay */}
      {mobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-[200] flex items-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          {/* Panel */}
          <div className="relative w-full bg-white rounded-t-3xl p-6 pb-8 max-h-[80vh] overflow-y-auto animate-slide-up shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h4 className="font-black text-base text-gray-800 flex items-center gap-2">
                <Filter className="text-[#10b981]" size={18} /> FILTER
              </h4>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={18} className="text-gray-600" />
              </button>
            </div>

            {/* Filter Jenis Melon */}
            <div className="mb-6">
              <h5 className="font-bold text-sm text-gray-700 mb-3">Jenis Melon</h5>
              <div className="flex flex-wrap gap-2">
                {["Semua", "Honey Globe", "Golden Apollo"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 cursor-pointer ${
                      category === cat
                        ? "bg-poktan-leaf text-white shadow-md shadow-poktan-leaf/10"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Berat / Ukuran */}
            <div className="mb-6 border-t pt-4">
              <h5 className="font-bold text-sm text-gray-700 mb-3">Berat / Ukuran</h5>
              <div className="flex flex-wrap gap-2">
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
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 cursor-pointer ${
                      selectedWeights.includes(ukuran)
                        ? "bg-poktan-leaf text-white shadow-md shadow-poktan-leaf/10"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {ukuran}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Harga */}
            <div className="border-t pt-4 mb-6">
              <h5 className="font-bold text-sm text-gray-700 mb-3">Batas Harga</h5>
              <div className="flex gap-3">
                <div className="flex-1 flex items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <span className="text-xs text-gray-500 font-bold">Rp</span>
                  <input 
                    type="number" 
                    placeholder="MIN" 
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none font-medium" 
                  />
                </div>
                <div className="flex-1 flex items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <span className="text-xs text-gray-500 font-bold">Rp</span>
                  <input 
                    type="number" 
                    placeholder="MAX" 
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none font-medium" 
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  setCategory("Semua");
                  setSelectedWeights([]);
                  setMinPrice("");
                  setMaxPrice("");
                  setAppliedMinPrice(null);
                  setAppliedMaxPrice(null);
                }}
                className="w-1/3 bg-slate-100 hover:bg-slate-200 text-gray-600 py-3 rounded-full font-bold text-sm transition-all duration-300 active:scale-95 cursor-pointer"
              >
                Hapus
              </button>
              <button 
                onClick={() => {
                  setAppliedMinPrice(minPrice ? Number(minPrice) : null);
                  setAppliedMaxPrice(maxPrice ? Number(maxPrice) : null);
                  setMobileFilterOpen(false);
                }}
                className="w-2/3 bg-poktan-leaf hover:bg-poktan-green text-white py-3 rounded-full font-bold text-sm transition-all duration-300 shadow-md shadow-poktan-leaf/10 hover:shadow-lg hover:shadow-poktan-leaf/20 active:scale-95 cursor-pointer"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <section className="py-16 px-4 md:px-6 max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8 items-start relative">
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

        {/* Product Grid (Tengah) */}
        <div className="w-full lg:w-3/5 space-y-10 min-w-0">
          {loading ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
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

                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
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
                <p className="text-[#10b981] font-bold text-xs mb-1">Rp 20.000 <span className="text-gray-400 text-[9px] font-medium">/ kg</span></p>
              </div>

              {/* Card 2 */}
              <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3">
                <h5 className="font-black text-gray-800 text-[11px] mb-1 uppercase tracking-wide">Kuning Golden Appolo</h5>
                <p className="text-yellow-600 font-bold text-xs mb-1">Rp 22.000 <span className="text-yellow-600/60 text-[9px] font-medium">/ kg</span></p>
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


