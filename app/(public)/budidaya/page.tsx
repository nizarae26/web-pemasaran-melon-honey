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
      title: "Pembibitan",
      desc: "Benih melon Honey Globe berkualitas disemai pada media semai hingga bibit siap pindah tanam (usia 10-14 hari).",
      icon: <Sprout size={22} />,
      img: "https://images.unsplash.com/photo-12345", // Ganti dengan path gambar asli Anda
    },
    {
      no: "02",
      title: "Persiapan Lahan",
      desc: "Lahan dibersihkan dan dibuat bedengan. Pemasangan mulsa plastik serta instalasi irigasi tetes.",
      icon: <Home size={22} />,
      img: "https://images.unsplash.com/photo-23456",
    },
    {
      no: "03",
      title: "Penanaman",
      desc: "Bibit dipindahkan ke lahan tanam dengan jarak ideal untuk pertumbuhan optimal.",
      icon: <Trees size={22} />,
      img: "https://images.unsplash.com/photo-34567",
    },
    {
      no: "04",
      title: "Perawatan & Nutrisi",
      desc: "Penyiraman menggunakan irigasi tetes dan pemberian nutrisi secara terukur sesuai fase pertumbuhan.",
      icon: <Droplets size={22} />,
      img: "https://images.unsplash.com/photo-45678",
    },
    {
      no: "05",
      title: "Pembungaan & Pembentukan Buah",
      desc: "Proses penyerbukan dibantu secara alami. Buah dipilih dan dirawat agar tumbuh seragam dan berkualitas.",
      icon: <Flower2 size={22} />,
      img: "https://images.unsplash.com/photo-56789",
    },
    {
      no: "06",
      title: "Panen",
      desc: "Melon dipanen pada tingkat kematangan optimal untuk rasa terbaik. Ditangani dengan hati-hati agar kualitas tetap terjaga.",
      icon: <CheckCircle2 size={22} />,
      img: "https://images.unsplash.com/photo-67890",
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
              Alur Proses Budidaya Melon{" "}
              <span className="text-[#10b981]">Honey Globe</span>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 relative z-10">
              {alurProses.map((step, index) => (
                <div key={index} className="flex flex-col items-center group">
                  {/* Nomor di Atas Garis */}
                  <div className="w-10 h-10 bg-[#065f46] text-white rounded-full flex items-center justify-center font-bold text-sm mb-8 shadow-lg z-10">
                    {step.no}
                  </div>

                  {/* Kartu Proses */}
                  <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 w-full flex flex-col items-center text-center h-full">
                    {/* Ikon dalam Lingkaran */}
                    <div className="w-12 h-12 rounded-full border border-emerald-100 flex items-center justify-center text-[#10b981] mb-4 bg-emerald-50/30">
                      {step.icon}
                    </div>

                    <h3 className="font-bold text-sm mb-4 text-gray-800 min-h-[40px] flex items-center justify-center leading-tight">
                      {step.title}
                    </h3>

                    {/* Placeholder Gambar Proses */}
                    <div className="w-full aspect-[4/3] rounded-2xl bg-gray-100 mb-4 overflow-hidden relative group">
                      <div className="absolute inset-0 bg-emerald-900/10 group-hover:bg-transparent transition-colors z-10"></div>
                      <img
                        src={step.img}
                        alt={step.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
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

      {/* Galeri Praktik Baik */}
      <section className="py-24 bg-gray-50 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-center text-gray-800 mb-16 tracking-tight">
            Galeri Praktik
          </h2>
          {/* ... (Konten galeri tetap sesuai kode Anda sebelumnya) */}
        </div>
      </section>

      {/* Komitmen Bawah */}
      <section className="py-10 px-4 md:px-6 bg-white w-full">
        {/* Menggunakan max-w-full agar benar-benar fleksibel memanfaatkan seluruh ruang layar */}
        <div className="max-w-full mx-auto">
          {/* Padding internal disesuaikan (px-6 md:px-10 lg:px-14) agar konten mendorong mepet ke tepi kanan-kiri */}
          <div className="w-full bg-emerald-50/40 border border-emerald-100/50 rounded-[32px] p-6 md:p-10 lg:p-12 xl:p-14 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 xl:gap-24">
            {/* 1. Bagian Kiri: Deskripsi Utama (Mengambil porsi ruang yang seimbang) */}
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 flex-1 lg:max-w-2xl w-full">
              <div className="w-24 h-24 md:w-28 md:h-28 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0 border border-emerald-100">
                <Sprout
                  size={44}
                  className="text-[#10b981]"
                  strokeWidth={1.5}
                />
              </div>
              <div className="text-center md:text-left w-full">
                <h2 className="text-2xl md:text-3xl font-black text-[#064e3b] mb-3 tracking-tight">
                  Komitmen Kami
                </h2>
                <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                  Kami berkomitmen menerapkan budidaya yang bertanggung jawab,
                  berkelanjutan, dan terus berinovasi untuk menghasilkan{" "}
                  <span className="font-bold text-[#10b981]">
                    Melon Honey Globe
                  </span>{" "}
                  premium yang aman, sehat, dan berkualitas tinggi.
                </p>
              </div>
            </div>

            {/* 2. Bagian Kanan: Up-scale Komponen agar Proporsional dengan Bagian Kiri */}
            <div className="w-full lg:flex-1 flex flex-col sm:flex-row items-center justify-between gap-8 sm:gap-6 lg:gap-8 xl:gap-12">
              {/* Grup 1 (Keamanan Pangan & Hemat Air) */}
              <div className="flex justify-around sm:justify-start gap-8 md:gap-12 w-full sm:w-auto">
                {/* Item 1 */}
                <div className="flex flex-col items-center text-center group flex-1 sm:flex-none min-w-[100px] md:min-w-[110px]">
                  {/* Ukuran box dinaikkan ke w-16 h-16 dan icon size={24} agar seimbang */}
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100/40 flex items-center justify-center text-[#10b981] mb-4 group-hover:bg-[#10b981] group-hover:text-white transition-all shadow-sm group-hover:scale-105 duration-300">
                    <ShieldCheck size={24} strokeWidth={2} />
                  </div>
                  <p className="text-xs md:text-sm font-bold text-[#064e3b] uppercase tracking-wide mb-1">
                    Keamanan Pangan
                  </p>
                  <p className="text-[11px] md:text-xs text-gray-500 leading-none">
                    Aman dikonsumsi
                  </p>
                </div>

                {/* Item 2 */}
                <div className="flex flex-col items-center text-center group flex-1 sm:flex-none min-w-[100px] md:min-w-[110px]">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100/40 flex items-center justify-center text-[#10b981] mb-4 group-hover:bg-[#10b981] group-hover:text-white transition-all shadow-sm group-hover:scale-105 duration-300">
                    <Droplets size={24} strokeWidth={2} />
                  </div>
                  <p className="text-xs md:text-sm font-bold text-[#064e3b] uppercase tracking-wide mb-1">
                    Hemat Air
                  </p>
                  <p className="text-[11px] md:text-xs text-gray-500 leading-none">
                    Irigasi efisien
                  </p>
                </div>
              </div>

              {/* Garis Pemisah Vertikal (Lebih tinggi untuk mengimbangi komponen baru) */}
              <div className="hidden sm:block w-[1px] h-20 bg-emerald-200/60 self-center"></div>

              {/* Grup 2 (Ramah Lingkungan & Kualitas Terjamin) */}
              <div className="flex justify-around sm:justify-start gap-8 md:gap-12 w-full sm:w-auto">
                {/* Item 3 */}
                <div className="flex flex-col items-center text-center group flex-1 sm:flex-none min-w-[100px] md:min-w-[110px]">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100/40 flex items-center justify-center text-[#10b981] mb-4 group-hover:bg-[#10b981] group-hover:text-white transition-all shadow-sm group-hover:scale-105 duration-300">
                    <Leaf size={24} strokeWidth={2} />
                  </div>
                  <p className="text-xs md:text-sm font-bold text-[#064e3b] uppercase tracking-wide mb-1">
                    Ramah Lingkungan
                  </p>
                  <p className="text-[11px] md:text-xs text-gray-500 leading-none">
                    Eco Farming
                  </p>
                </div>

                {/* Item 4 */}
                <div className="flex flex-col items-center text-center group flex-1 sm:flex-none min-w-[100px] md:min-w-[110px]">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100/40 flex items-center justify-center text-[#10b981] mb-4 group-hover:bg-[#10b981] group-hover:text-white transition-all shadow-sm group-hover:scale-105 duration-300">
                    <CheckCircle2 size={24} strokeWidth={2} />
                  </div>
                  <p className="text-xs md:text-sm font-bold text-[#064e3b] uppercase tracking-wide mb-1">
                    Kualitas Terjamin
                  </p>
                  <p className="text-[11px] md:text-xs text-gray-500 leading-none">
                    Standar terjaga
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
