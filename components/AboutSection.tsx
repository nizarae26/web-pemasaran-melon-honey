import Link from "next/link";
import { Users, Map, CalendarDays, Leaf, ArrowRight } from "lucide-react";


export default function AboutSection() {
  return (
    <section className="py-17 px-4 bg-poktan-accent/20">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Konten Teks */}
        <div>
          <h2 className="text-sm font-bold text-poktan-leaf uppercase tracking-wider mb-2">
            Sekilas Tentang
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-poktan-green mb-6">
            Kelompok Tani Banyu Urip
          </h3>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              Kelompok Tani Banyu Urip adalah kelompok tani yang berada di Desa
              Tanggumong, Kecamatan Sampang, Kabupaten Sampang, Madura.
            </p>
            <p>
              Kami berkomitmen menghasilkan Melon Honey Globe & Golden Apollo berkualitas
              premium dengan dukungan teknologi pertanian modern dan kerja sama
              tim yang solid untuk menyejahterakan petani lokal.
            </p>
          </div>
          <Link 
            href="/profil" 
            className="mt-8 inline-flex items-center gap-2 border border-slate-200 hover:border-poktan-leaf text-gray-700 hover:text-poktan-green bg-white px-8 py-3.5 rounded-full font-bold transition-all duration-300 hover:bg-slate-50 active:scale-95 text-sm w-fit"
          >
            <span>Selengkapnya Tentang Kami</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Grid Statistik sesuai Mockup */}
        <div className="grid grid-cols-2 gap-4">
          {/* 1. Anggota Aktif */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col justify-center items-center group hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-poktan-emerald rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-poktan-emerald/20 group-hover:scale-110 transition-transform">
              <Users size={24} strokeWidth={2.5} />
            </div>
            <p className="text-2xl font-black text-poktan-emerald tracking-tighter leading-none">
              10+
            </p>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-2">
              Anggota Aktif
            </p>
          </div>

          {/* 2. Luas Lahan */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col justify-center items-center group hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-poktan-emerald rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-poktan-emerald/20 group-hover:scale-110 transition-transform">
              <Map size={24} strokeWidth={2.5} />
            </div>
            <p className="text-2xl font-black text-poktan-emerald tracking-tighter leading-none">
              ± 2 Ha
            </p>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-2">
              Luas Lahan
            </p>
          </div>

          {/* 3. Tahun Berdiri */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col justify-center items-center group hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-poktan-emerald rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-poktan-emerald/20 group-hover:scale-110 transition-transform">
              <CalendarDays size={24} strokeWidth={2.5} />
            </div>
            <p className="text-2xl font-black text-poktan-emerald tracking-tighter leading-none">
              2019
            </p>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-2">
              Tahun Berdiri
            </p>
          </div>

          {/* 4. Produk Unggulan */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col justify-center items-center group hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-poktan-emerald rounded-xl flex items-center justify-center text-white mb-4 shadow-lg shadow-poktan-emerald/20 group-hover:scale-110 transition-transform">
              <Leaf size={24} strokeWidth={2.5} />
            </div>
            <p className="text-2xl font-black text-poktan-emerald tracking-tighter leading-none">
              2
            </p>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-2">
              Produk Unggulan
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
