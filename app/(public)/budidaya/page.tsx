"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BudidayaHero from "@/components/public/BudidayaHero";
import {
  Sprout,
  Layers,
  Droplets,
  Flower2,
  CheckCircle2,
  ShieldCheck,
  Home,
  Trees,
  Leaf,
  Activity,
  ChevronDown,
} from "lucide-react";

export default function BudidayaPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const alurProses = [
    {
      no: "01",
      title: "Pengolahan Lahan",
      desc: "Tanah dibajak sedalam 30 cm agar gembur. Pada tahap ini, pupuk kandang matang wajib dimasukkan ke tanah minimal 1 tahun sebelum masa tanam untuk menjamin fermentasi hara sempurna yang memengaruhi kekuatan bibit.",
      icon: <Home size={22} />,
      img: "/images/budidaya/pengolahan-lahan.png",
    },
    {
      no: "02",
      title: "Pembuatan Bedengan",
      desc: "Tanah dibentuk menjadi bedengan gundukan dengan lebar ± 100 cm dan tinggi 30-40 cm, serta dicampuri pupuk dasar kompos dan kapur dolomit.",
      icon: <Layers size={22} />,
      img: "/images/budidaya/badengan.jpeg",
    },
    {
      no: "03",
      title: "Pemasangan Mulsa",
      desc: "Bedengan ditutup rapat dengan Mulsa Plastik Hitam Perak (MPHP) guna menjaga kelembaban tanah, menahan erosi, dan mencegah tumbuhnya gulma liar.",
      icon: <Layers size={22} />,
      img: "/images/budidaya/mulsa.jpeg",
    },
    {
      no: "04",
      title: "Instalasi Irigasi Tetes",
      desc: "Pemasangan selang irigasi tetes (drip lines) pintar di atas bedengan di bawah mulsa untuk menyalurkan air secara presisi langsung ke akar.",
      icon: <Droplets size={22} />,
      img: "",
    },
    {
      no: "05",
      title: "Pemilihan Bibit",
      desc: "Memilih biji hibrida (persilangan buatan unggul) Honey Globe yang sehat untuk menjamin keseragaman tumbuh, ketahanan penyakit, serta kualitas buah premium.",
      icon: <Sprout size={22} />,
      img: "/images/budidaya/Bibit.jpeg", 
    },
    {
      no: "06",
      title: "Perkecambahan",
      desc: "Benih melon direndam dalam air hangat bersuhu ± 40°C selama 4 jam yang dicampur dengan zat pengatur tumbuh untuk memecah masa dormansi benih.",
      icon: <Droplets size={22} />,
      img: "/images/budidaya/perkecambahan.jpeg",
    },
    {
      no: "07",
      title: "Pemeraman",
      desc: "Benih dibungkus menggunakan kain hitam lembab selama 24-36 jam di ruang gelap hangat agar tunas akar (radikula) muncul seragam.",
      icon: <Layers size={22} />,
      img: "/images/budidaya/diperam.jpeg",
    },
    {
      no: "08",
      title: "Penyemaian",
      desc: "Kecambah dipindahkan satu per satu ke lubang seeding tray dengan media khusus steril (cocopeat & kompos) selama 2x24 jam hingga tumbuh daun sejati.",
      icon: <Flower2 size={22} />,
      img: "/images/budidaya/semai.jpeg",
    },
    {
      no: "09",
      title: "Pindah Tanam",
      desc: "Bibit berumur 7-10 hari yang sehat dipindahkan secara manual ke lubang mulsa bedengan pada pagi atau sore hari untuk mengurangi stres penguapan.",
      icon: <Leaf size={22} />,
      img: "/images/budidaya/pindah tanam.jpeg",
    },
    {
      no: "10",
      title: "Pemasangan Ajir",
      desc: "Tiang ajir bambu penyangga atau tali lanjaran vertikal dipasang segera setelah pindah tanam setinggi 2 meter sebagai media rambat tanaman melon.",
      icon: <Trees size={22} />,
      img: "",
    },
    {
      no: "11",
      title: "Seleksi & Gantung Buah",
      desc: "Memilih satu buah terbaik yang berbentuk oval simetris untuk dipelihara, menggantung buah dengan tali penyangga. Metode ini menghasilkan buah melon premium dengan berat rata-rata 3 kg dan maksimal mencapai 5 kg per buah.",
      icon: <ShieldCheck size={22} />,
      img: "",
    },
    {
      no: "12",
      title: "Pemantauan & Pengendalian",
      desc: "Penyaluran nutrisi fertigasi tetes, serta penanganan penyakit musiman: layu fusarium di musim kemarau dan embun bulu di musim hujan menggunakan pestisida secara intensif agar tidak merambat ke tanaman lain.",
      icon: <Activity size={22} />,
      img: "",
    },
    {
      no: "13",
      title: "Proses Panen",
      desc: "Pemetikan melon berumur 60-65 hari dengan tangkai bentuk T. Kadar kemanisan dipastikan optimal (minimal 13-15 Brix) menggunakan refraktometer.",
      icon: <CheckCircle2 size={22} />,
      img: "",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50/50">
      <Navbar />

      {/* 2. Panggil BudidayaHero di sini. 
          Ini otomatis menggantikan Hero Section lama dan Row Keunggulan */}
      <BudidayaHero />

      {/* Tahapan Budidaya */}
      <section className="py-16 px-6 md:px-12 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Judul & Subtitle Sesuai Gambar */}
          <div className="text-center mb-20">
            <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-2 tracking-tight inline-block relative">
              Tahapan <span className="text-[#10b981]">Budidaya Melon</span>
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

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6 relative z-10">
              {alurProses.map((step, index) => (
                <div key={index} className="flex flex-col items-center group">
                  {/* Nomor di Atas Garis */}
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#065f46] text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm mb-4 sm:mb-8 shadow-md sm:shadow-lg z-10">
                    {step.no}
                  </div>

                  {/* Kartu Proses */}
                  <div className="bg-white border border-gray-100 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-xs sm:shadow-sm hover:shadow-xl transition-all duration-300 w-full flex flex-col items-center text-center h-full">
                    {/* Gambar Proses */}
                    <div className="w-full aspect-[4/3] rounded-xl sm:rounded-2xl bg-gray-100 mb-3 sm:mb-4 overflow-hidden relative group flex items-center justify-center">
                      {step.img ? (
                        <>
                          <div className="absolute inset-0 bg-emerald-900/10 group-hover:bg-transparent transition-colors z-10"></div>
                          <img
                            src={step.img}
                            alt={step.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-emerald-600/40 p-3 sm:p-4">
                          <Leaf className="w-8 h-8 sm:w-10 sm:h-10 mb-1" />
                          <span className="text-[9px] sm:text-[10px] text-gray-400 font-medium">Dokumentasi Menyusul</span>
                        </div>
                      )}
                    </div>

                    {/* Ikon dan Judul */}
                    <div className="flex items-center gap-2 sm:gap-3 mb-2.5 sm:mb-3 w-full justify-start">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-emerald-100 flex items-center justify-center text-[#10b981] bg-emerald-50/30 shrink-0">
                        {step.icon}
                      </div>
                      <h3 className="font-bold text-xs sm:text-sm text-gray-800 text-left leading-tight">
                        {step.title}
                      </h3>
                    </div>

                    <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed text-left sm:text-justify px-0 sm:px-1">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. FAQ Akordeon Interaktif */}
      <section className="py-16 md:py-24 px-4 sm:px-6 md:px-12 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            
            {/* Left Column (Info) - Diposisikan ke tengah di tablet & mobile */}
            <div className="lg:col-span-5 space-y-4 text-center lg:text-left flex flex-col items-center lg:items-start">
              {/* Title */}
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Pertanyaan yang <br className="hidden sm:inline" />
                <span className="text-[#10b981]">Sering Diajukan</span>
              </h2>

              {/* Description */}
              <p className="text-gray-500 text-xs sm:text-sm md:text-base leading-relaxed max-w-md mx-auto lg:mx-0">
                Temukan jawaban atas berbagai pertanyaan umum mengenai teknologi pertanian dan budidaya melon di Poktan Banyu Urip.
              </p>
            </div>

            {/* Right Column (Accordion List) */}
            <div className="lg:col-span-7 space-y-4">
              {[
                {
                  q: "Apa keunggulan sistem Irigasi Tetes (Drip Irrigation)?",
                  a: "Sistem irigasi tetes menyalurkan air dan nutrisi secara berkala langsung ke perakaran tanaman dalam volume yang tepat. Hal ini sangat menghemat penggunaan air, mencegah kelembaban berlebih pada daun yang memicu pertumbuhan spora jamur, dan memastikan distribusi nutrisi seragam."
                },
                {
                  q: "Mengapa hanya dipelihara 1 buah melon per pohon dan berapa berat rata-rata buahnya?",
                  a: "Dengan menyortir dan menyisakan satu buah melon terbaik per pohon, seluruh cadangan nutrisi tanaman dialokasikan penuh untuk membesarkan satu buah tersebut. Hal ini menjamin ukuran buah premium dengan berat rata-rata mencapai 3 kg dan maksimal mencapai 5 kg per buah dengan tingkat kemanisan yang tinggi."
                },
                {
                  q: "Berapa lama masa tanam melon Honey Globe dari bibit hingga panen?",
                  a: "Masa tumbuh tanaman melon Honey Globe berkisar antara 60 hingga 65 hari setelah pindah tanam (HST). Durasi ini relatif cepat dibandingkan dengan melon varietas konvensional berkat dukungan nutrisi optimal dari sistem fertigasi."
                },
                {
                  q: "Bagaimana cara mengukur tingkat kemanisan melon sebelum dipetik?",
                  a: "Kami menggunakan alat khusus bernama Hand Refractometer Brix. Petani akan mengambil sampel cairan melon untuk diuji tingkat kemanisannya. Melon Honey Globe hanya dipanen jika telah mencapai tingkat kemanisan standar premium kami yaitu 13 hingga 15 Brix."
                },
                {
                  q: "Mengapa tanaman melon memerlukan tiang ajir (lanjaran)?",
                  a: "Tiang ajir membantu menopang pertumbuhan tanaman secara vertikal. Hal ini menghemat ruang lahan, memastikan seluruh bagian tanaman mendapat sinar matahari merata, dan mencegah buah melon bersentuhan dengan tanah yang basah agar terhindar dari pembusukan."
                },
                {
                  q: "Bagaimana cara mengendalikan hama dan penyakit musiman pada budidaya melon?",
                  a: "Tantangan utama di musim kemarau adalah penyakit layu fusarium, sedangkan di musim hujan adalah embun bulu (downy mildew). Keduanya dikendalikan menggunakan pestisida secara intensif. Khusus pengobatan embun bulu di musim hujan memiliki efek samping membuat daun menjadi agak kering, namun pengobatan harus tetap diselesaikan agar tidak merambat dan menular ke daun atau tanaman lainnya."
                },
                {
                  q: "Kapan pupuk kandang harus mulai diaplikasikan pada lahan budidaya?",
                  a: "Pupuk kandang matang wajib dimasukkan ke tanah minimal 1 tahun sebelum masa tanam dimulai pada tahap pengolahan lahan. Rentang waktu fermentasi alami ini sangat memengaruhi kelimpahan unsur hara mikro tanah yang nantinya berpengaruh besar terhadap kualitas kekuatan bibit."
                },
                {
                  q: "Apa jenis benih (biji) melon yang digunakan?",
                  a: "Kami menggunakan biji hibrida (persilangan buatan unggul) khusus varietas Honey Globe. Penggunaan biji hibrida menjamin tanaman tumbuh seragam, memiliki ketahanan penyakit yang lebih tangguh, serta menghasilkan rasa manis dan ketebalan buah yang seragam."
                }
              ].map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`bg-[#f8fafc]/70 hover:bg-[#f8fafc] border rounded-[20px] transition-all duration-300 ${
                      isOpen
                        ? "border-[#10b981]/30 shadow-md shadow-[#10b981]/5"
                        : "border-slate-100 shadow-sm"
                    }`}
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between text-left p-6 md:p-7 cursor-pointer focus:outline-none"
                    >
                      <span className="font-bold text-gray-900 text-sm md:text-base leading-tight pr-4">
                        {faq.q}
                      </span>
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${
                          isOpen
                            ? "bg-[#10b981] text-white shadow-md shadow-[#10b981]/20"
                            : "bg-[#10b981]/80 hover:bg-[#10b981] text-white"
                        }`}
                      >
                        <ChevronDown
                          className={`w-5 h-5 transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </button>
                    
                    {/* Animated answer height */}
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="pb-6 md:pb-7 px-6 md:px-7 text-xs md:text-sm text-gray-600 leading-relaxed pt-3 border-t border-slate-100/60">
                          {faq.a}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
