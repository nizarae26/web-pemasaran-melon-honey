import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BudidayaHero from "@/components/public/BudidayaHero";
import {
  Sprout,
  Settings2,
  Layers,
  Droplets,
  Flower2,
  CheckCircle2,
  ShieldCheck,
  Home,
  Trees,
  Leaf,
} from "lucide-react";

export default function BudidayaPage() {
  const alurProses = [
    {
      no: "01",
      title: "Bibit",
      desc: "Pemilihan bibit unggul bersertifikat untuk memastikan kualitas genetika tanaman.",
      icon: <Sprout size={22} />,
      img: "/images/budidaya/bibit.jpeg", 
    },
    {
      no: "02",
      title: "Perkecambahan",
      desc: "Benih direndam di dalam air hangat selama ± 4 jam untuk mengaktifkan hormon pertumbuhan.",
      icon: <Droplets size={22} />,
      img: "/images/budidaya/perkecambahan.jpeg",
    },
    {
      no: "03",
      title: "Diperam (Kain Hitam)",
      desc: "Benih dibungkus menggunakan kain hitam lembab selama 24 jam untuk memicu kecambah.",
      icon: <Layers size={22} />,
      img: "/images/budidaya/diperam.jpeg",
    },
    {
      no: "04",
      title: "Penyemaian",
      desc: "Taruh kecambah di pot semai kecil (tray) dengan media tanam, maksimal selama 1 minggu.",
      icon: <Flower2 size={22} />,
      img: "/images/budidaya/semai.jpeg",
    },
    {
      no: "05",
      title: "Pindah Tanam & Panen",
      desc: "Bibit ditanam di lahan gundukan. Masa perawatan memakan waktu 60-65 hari sampai buah siap panen.",
      icon: <Trees size={22} />,
      img: "/images/budidaya/pindah tanam.jpeg",
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* 2. Panggil BudidayaHero di sini. 
          Ini otomatis menggantikan Hero Section lama dan Row Keunggulan */}
      <BudidayaHero />

      {/* Alur Proses Budidaya */}
      <section className="py-16 px-6 md:px-12 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Judul & Subtitle Sesuai Gambar */}
          <div className="text-center mb-20">
            <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-2 tracking-tight inline-block relative">
              Alur Proses <span className="text-[#10b981]">Budidaya Melon</span>
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-[#10b981]"></span>
            </h2>
            <p className="text-sm text-gray-500 max-w-2xl mx-auto mt-8 leading-relaxed">
              Setiap tahapan budidaya kami lakukan dengan teliti dan konsisten
              untuk memastikan setiap buah melon yang dihasilkan berkualitas
              terbaik.
            </p>
          </div>

          <div className="relative">
            {/* Garis Putus-putus Horizontal (Hanya Desktop) */}
            <div className="hidden lg:block absolute top-5 left-0 w-full h-[2px] border-t-2 border-dashed border-gray-200 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
              {alurProses.map((step, index) => (
                <div key={index} className="flex flex-col items-center group">
                  {/* Nomor di Atas Garis */}
                  <div className="w-10 h-10 bg-[#065f46] text-white rounded-full flex items-center justify-center font-bold text-sm mb-8 shadow-lg z-10">
                    {step.no}
                  </div>

                  {/* Kartu Proses */}
                  <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 w-full flex flex-col items-center text-center h-full">
                    {/* Gambar Proses */}
                    <div className="w-full aspect-[4/3] rounded-2xl bg-gray-100 mb-4 overflow-hidden relative group">
                      <div className="absolute inset-0 bg-emerald-900/10 group-hover:bg-transparent transition-colors z-10"></div>
                      <img
                        src={step.img}
                        alt={step.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    {/* Ikon dan Judul */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full border border-emerald-100 flex items-center justify-center text-[#10b981] bg-emerald-50/30 shrink-0">
                        {step.icon}
                      </div>
                      <h3 className="font-bold text-sm text-gray-800 text-left leading-tight">
                        {step.title}
                      </h3>
                    </div>

                    <p className="text-[12px] md:text-xs text-gray-600 leading-relaxed text-center px-2">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>



      <Footer />
    </main>
  );
}
