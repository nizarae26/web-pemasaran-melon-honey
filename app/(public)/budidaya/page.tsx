import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function BudidayaPage() {
  const alurProses = [
    { no: "01", title: "Pembibitan", desc: "Benih melon Honey Globe berkualitas disemai pada media semai hingga bibit siap pindah tanam (usia 10-14 hari)." },
    { no: "02", title: "Persiapan Lahan", desc: "Lahan dibersihkan dan dibuat bedengan. Pemasangan mulsa plastik serta instalasi irigasi tetes." },
    { no: "03", title: "Penanaman", desc: "Bibit dipindahkan ke lahan tanam dengan jarak ideal untuk pertumbuhan optimal." },
    { no: "04", title: "Perawatan & Nutrisi", desc: "Penyiraman menggunakan irigasi tetes dan pemberian nutrisi secara terukur sesuai fase pertumbuhan." },
    { no: "05", title: "Pembungaan & Pembentukan Buah", desc: "Proses penyerbukan dibantu secara alami. Buah dipilih dan dirawat agar tumbuh seragam dan berkualitas." },
    { no: "06", title: "Panen", desc: "Melon dipanen pada tingkat kematangan optimal untuk rasa terbaik. Ditangani dengan hati-hati agar kualitas tetap terjaga." },
  ];

  const galeriPraktik = [
    { title: "Lahan Budidaya", desc: "Greenhouse modern & bersih" },
    { title: "Irigasi Tetes Pintar", desc: "Hemat air, efisien, dan terukur" },
    { title: "Sistem Fertigasi", desc: "Nutrisi tercampur otomatis" },
    { title: "Perawatan Buah", desc: "Seleksi buah & penyanggaan" },
    { title: "Monitoring IoT", desc: "Pantau suhu & kelembaban real-time" },
    { title: "Cek Nutrisi (EC)", desc: "Pengukuran nutrisi berkala" },
  ];

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section Budidaya */}
      <section className="relative h-[400px] flex items-center justify-center text-center text-white">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <div className="absolute inset-0 bg-[url('/greenhouse-bg.jpg')] bg-cover bg-center"></div>
        <div className="relative z-20 max-w-3xl px-4">
          <p className="text-sm font-bold uppercase tracking-widest mb-2">Budidaya</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Budidaya Melon Honey Globe dengan Teknologi Modern
          </h1>
          <p className="opacity-90">
            Kami menerapkan praktik budidaya yang baik, pemanfaatan teknologi irigasi tetes, dan pengelolaan nutrisi terukur untuk menghasilkan melon berkualitas premium.
          </p>
        </div>
      </section>

      {/* Keunggulan Budidaya Row */}
      <section className="py-8 bg-poktan-accent/20">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl">🤖</span>
            <p className="text-xs font-bold text-poktan-green">Smart Farming</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl">🧪</span>
            <p className="text-xs font-bold text-poktan-green">Nutrisi Terukur</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl">🏆</span>
            <p className="text-xs font-bold text-poktan-green">Kualitas Premium</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl">🌍</span>
            <p className="text-xs font-bold text-poktan-green">Ramah Lingkungan</p>
          </div>
        </div>
      </section>

      {/* Alur Proses Budidaya */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-poktan-green mb-2">Alur Proses Budidaya Melon Honey Globe</h2>
          <p className="text-center text-gray-500 mb-12">Setiap tahapan budidaya kami lakukan dengan teliti dan konsisten.</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {alurProses.map((step, index) => (
              <div key={index} className="relative p-6 border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition">
                <span className="text-4xl font-black text-poktan-accent absolute top-4 right-6 opacity-50">{step.no}</span>
                <div className="w-12 h-12 bg-poktan-leaf rounded-full mb-4 flex items-center justify-center text-white">
                  {/* Icon placeholder sesuai urutan */}
                  {index === 0 && "🌱"} {index === 1 && "🚜"} {index === 2 && "🪴"}
                  {index === 3 && "💧"} {index === 4 && "🌸"} {index === 5 && "🍈"}
                </div>
                <h3 className="font-bold text-lg mb-2 text-poktan-green">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galeri Praktik Baik */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-poktan-green mb-12">Galeri Praktik Baik</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {galeriPraktik.map((item, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="h-48 bg-gray-200 rounded-xl mb-3 overflow-hidden">
                  <div className="w-full h-full bg-poktan-green/10 flex items-center justify-center text-poktan-green group-hover:scale-110 transition">
                    Foto {item.title}
                  </div>
                </div>
                <h4 className="font-bold text-sm text-gray-800">{item.title}</h4>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Komitmen Bawah */}
      <section className="py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-poktan-green mb-8">Komitmen Kami</h2>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
             <div className="flex flex-col items-center">
               <div className="w-16 h-16 rounded-full bg-poktan-accent flex items-center justify-center mb-2">🛡️</div>
               <p className="text-xs font-bold">Keamanan Pangan</p>
             </div>
             <div className="flex flex-col items-center">
               <div className="w-16 h-16 rounded-full bg-poktan-accent flex items-center justify-center mb-2">💧</div>
               <p className="text-xs font-bold">Hemat Air</p>
             </div>
             <div className="flex flex-col items-center">
               <div className="w-16 h-16 rounded-full bg-poktan-accent flex items-center justify-center mb-2">🍃</div>
               <p className="text-xs font-bold">Ramah Lingkungan</p>
             </div>
             <div className="flex flex-col items-center">
               <div className="w-16 h-16 rounded-full bg-poktan-accent flex items-center justify-center mb-2">✅</div>
               <p className="text-xs font-bold">Kualitas Terjamin</p>
             </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}