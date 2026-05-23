import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfilHero from "@/components/public/ProfilHero";
import {
  FileText,
  Download,
  Target,
  Rocket,
  MapPin,
  ExternalLink,
  Users,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export default function ProfilPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white w-full overflow-x-hidden">
        <ProfilHero />

      {/* 1. Sejarah & Latar Belakang - Tren Asymmetric Clean Layout */}
      <section className="py-28 px-6 md:px-12 lg:px-16 xl:px-24 bg-white relative overflow-hidden">
        {/* Aksen dekoratif latar belakang modern (subtle mesh glow) */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50/30 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="max-w-[1440px] mx-auto grid lg:grid-cols-12 gap-12 xl:gap-20 items-center">
          {/* Teks Sejarah */}
          <div className="space-y-8 lg:col-span-7">
            <div className="inline-flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="h-[2px] w-8 bg-[#10b981] rounded-full"></span>
                <span className="text-xs font-black uppercase tracking-[0.25em] text-[#10b981]">
                  Our Legacy
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-[0.95]">
                Sejarah & <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#064e3b] to-[#10b981]">
                  Latar Belakang
                </span>
              </h2>
            </div>

            <div className="space-y-6 text-gray-600 leading-relaxed text-sm md:text-base font-medium">
              <p className="first-letter:text-4xl first-letter:font-black first-letter:text-[#064e3b] first-letter:mr-2 first-letter:float-left">
                Kelompok Tani Banyu Urip terbentuk pada tahun 2018 atas
                inisiatif para petani di Desa Tanggumong, Kecamatan Sampang,
                Kabupaten Sampang, Madura.
              </p>
              <p>
                Awal pembentukan kelompok tani kami dilandasi semangat untuk
                meningkatkan kesejahteraan petani melalui pertanian modern,
                kelompok tani ini terus belajar dan berinovasi. Saat ini kami
                fokus membudidayakan{" "}
                <span className="font-bold text-[#10b981] bg-emerald-50/50 px-2 py-0.5 rounded-md border border-emerald-100/30">
                  Melon Honey Globe
                </span>{" "}
                dengan sistem irigasi tetes pintar dan pengelolaan yang ramah
                lingkungan.
              </p>
            </div>
          </div>

          {/* Sisi Kanan: Premium Image Card & Legalitas Bento Style */}
          <div className="lg:col-span-5 space-y-8 w-full">
            {/* Container Gambar Utama dengan Efek Inner Shadow & Scale */}
            <div className="w-full aspect-[16/10] bg-zinc-50 rounded-[32px] overflow-hidden border border-gray-100 shadow-xl shadow-gray-200/40 group relative">
              <img 
                src=""
                alt="Foto bersama seluruh anggota pengurus Kelompok Tani Banyu Urip di area perkebunan Tanggumong"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[32px] pointer-events-none"></div>
            </div>

            {/* Kartu Legalitas - Modern Minimalist Card */}
            <div className="bg-gradient-to-br from-emerald-50/40 to-emerald-50/10 border border-emerald-100/60 p-6 md:p-8 rounded-[32px] flex flex-col sm:flex-row items-center justify-between gap-6 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300">
              <div className="flex items-center gap-5 w-full sm:w-auto">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#10b981] shadow-md shadow-emerald-500/5 shrink-0 border border-emerald-50/80">
                  <FileText size={24} strokeWidth={2} />
                </div>
                <div>
                  <h4 className="font-black text-gray-900 uppercase text-[11px] tracking-widest leading-none mb-2">
                    Legalitas Kelompok
                  </h4>
                  <p className="text-xs text-gray-500 font-mono tracking-tight bg-white/60 px-2 py-1 rounded-md border border-gray-100 inline-block">
                    SK Bupati Sampang No: 188.45/330/434.013/2021
                  </p>
                </div>
              </div>
              <button className="w-full sm:w-auto bg-[#10b981] text-white px-5 py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#064e3b] transition-all duration-300 shadow-md shadow-emerald-500/10 active:scale-95 shrink-0">
                <Download size={14} />
                <span>Lihat Dokumen</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Visi & Misi - Bento Grid Split Mode */}
      <section className="py-28 bg-gradient-to-b from-gray-50/50 to-white px-6 md:px-10 lg:px-12 xl:px-16">
        <div className="max-w-[1440px] mx-auto grid lg:grid-cols-2 gap-8 xl:gap-12">
          {/* Box Visi - Premium Deep Glass Contrast */}
          <div className="bg-gradient-to-br from-[#064e3b] to-[#022c22] p-8 md:p-14 rounded-[40px] text-white flex flex-col items-center text-center justify-center space-y-6 shadow-xl shadow-emerald-950/20 relative overflow-hidden group">
            {/* Decorative gradient overlay inside card */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#10b981]/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

            <div className="w-16 h-16 bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center text-[#10b981] backdrop-blur-sm shadow-inner">
              <Rocket size={28} strokeWidth={2} />
            </div>
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-[0.15em] text-[#10b981]">
              Visi
            </h3>
            <div className="relative max-w-md">
              <span className="text-6xl font-serif text-emerald-500/20 absolute -top-8 -left-6 leading-none">
                “
              </span>
              <p className="text-lg md:text-xl xl:text-2xl font-medium leading-relaxed tracking-tight relative z-10 text-emerald-50/90">
                Menjadi kelompok tani yang maju, mandiri, dan inovatif dalam
                menghasilkan produk pertanian berkualitas tinggi yang berdaya
                saing.
              </p>
              <span className="text-6xl font-serif text-emerald-500/20 absolute -bottom-14 -right-4 leading-none">
                ”
              </span>
            </div>
          </div>

          {/* Box Misi - Clean Minimalist High-Contrast */}
          <div className="bg-white border border-gray-100 p-8 md:p-14 rounded-[40px] shadow-xl shadow-gray-200/30 flex flex-col justify-center space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#10b981] border border-emerald-100/30">
                <Target size={22} />
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight">
                Misi Kelompok
              </h3>
            </div>

            <ul className="space-y-4">
              {[
                "Meningkatkan kualitas dan produktivitas hasil pertanian.",
                "Menerapkan inovasi teknologi pertanian modern yang ramah lingkungan.",
                "Memberdayakan anggota untuk kesejahteraan bersama.",
                "Memperluas jaringan pemasaran produk secara berkelanjutan.",
              ].map((misi, i) => (
                <li
                  key={i}
                  className="flex gap-4 items-start group p-3 rounded-2xl border border-transparent hover:border-gray-50 hover:bg-gray-50/40 transition-all duration-300"
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-emerald-50 to-emerald-100/60 text-[#10b981] rounded-lg flex items-center justify-center shrink-0 mt-0.5 font-black text-xs border border-emerald-200/30">
                    {i + 1}
                  </div>
                  <p className="text-gray-600 text-sm md:text-base font-semibold leading-relaxed group-hover:text-gray-900 transition-colors">
                    {misi}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Struktur Organisasi - Hierarchy Tree Layout */}
      <section className="py-28 px-6 md:px-10 lg:px-12 xl:px-16 bg-white">
        <div className="max-w-[1440px] mx-auto">
          <div className="text-center mb-24 space-y-4">
            <span className="text-xs font-black uppercase tracking-[0.3em] text-[#10b981]">
              Management Team
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase">
              Struktur Organisasi
            </h2>
            <div className="w-12 h-1 bg-[#10b981] mx-auto rounded-full"></div>
          </div>

          <div className="max-w-5xl mx-auto space-y-16">
            {/* Tingkat 1: Ketua (Primary Spotlight Card) */}
            <div className="flex justify-center relative">
              {/* Subtle line connection helper if needed */}
              <div className="absolute bottom-0 left-1/2 w-[2px] h-16 bg-gray-100 -mb-16 hidden md:block"></div>
              <OrgCard
                name="Mah. Hasan"
                role="Ketua"
                desc="Memimpin dan bertanggung jawab penuh atas seluruh arah kebijakan, kemitraan, dan kegiatan kelompok tani."
                isPrimary
              />
            </div>

            {/* Tingkat 2: Mid Level Executives Grid */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8 justify-center pt-4 relative">
              <OrgCard
                name="Abdul Rifa'i"
                role="Wakil Ketua"
                desc="Membantu tugas ketua dalam pengawasan tata kelola program kerja, riset perkebunan, dan pelaksanaan teknis lapangan."
              />
              <OrgCard
                name="Siti Aisyah"
                role="Sekretaris"
                desc="Mengelola manajemen administrasi data, korespondensi mitra korporat, pencatatan proposal, dan komunikasi berkala kelompok."
              />
              <OrgCard
                name="Nurul Hidayah"
                role="Bendahara"
                desc="Mengatur ekosistem keuangan, audit kas masuk-keluar, pembukuan laba operasional, dan penataan laporan dana kelompok."
              />
            </div>

            {/* Tingkat 3: Anggota - Minimal Badge Capsule */}
            <div className="flex justify-center pt-10">
              <div className="bg-gradient-to-r from-emerald-50/50 via-white to-emerald-50/50 px-8 py-5 rounded-3xl border border-emerald-100/60 flex items-center gap-5 shadow-xl shadow-gray-100/50 max-w-2xl w-full justify-center">
                <div className="w-10 h-10 bg-[#10b981] text-white rounded-full flex items-center justify-center shadow-md shadow-emerald-500/10 shrink-0">
                  <Users size={18} strokeWidth={2.5} />
                </div>
                <p className="text-xs md:text-sm font-bold text-gray-800 leading-tight">
                  Anggota Aktif Banyu Urip:{" "}
                  <span className="text-[#10b981] font-black">
                    Ahmad Fauzi & 21+ Anggota Tani Lokal Terpilih
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Lokasi Kami */}
      <section className="py-24 bg-emerald-50/30 px-6 md:px-10 lg:px-12 xl:px-16 border-t border-emerald-50">
        <div className="max-w-[1440px] mx-auto grid lg:grid-cols-12 gap-12 xl:gap-20 items-center">
          <div className="space-y-8 lg:col-span-5 w-full">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight uppercase">
                Lokasi Kami
              </h2>
              <div className="w-12 h-1.5 bg-[#10b981] rounded-full"></div>
            </div>

            <div className="space-y-5">
              <div className="flex gap-5 items-start">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#10b981] shrink-0 shadow-sm border border-emerald-100">
                  <MapPin size={22} />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-sm text-gray-800">
                    Alamat Kelompok
                  </p>
                  <p className="text-gray-500 leading-relaxed text-xs md:text-sm">
                    Desa Tanggumong, Kecamatan Sampang, Kabupaten Sampang,
                    Madura, Jawa Timur 69217
                  </p>
                </div>
              </div>

              <div className="p-6 bg-white rounded-3xl border border-emerald-100/60 shadow-sm">
                <p className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-2">
                  Koordinat GPS Google Maps
                </p>
                <code className="text-[#10b981] font-mono text-xs md:text-sm block bg-zinc-50 p-2.5 rounded-lg border border-gray-100 mb-4 select-all">
                  -7.178481, 113.223858
                </code>
                <a
                  href="https://maps.app.goo.gl/tMTcHoMpKvbZ2eHN6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-[#10b981] text-white py-3 rounded-xl font-bold text-xs hover:bg-[#059669] transition-all active:scale-95 shadow-sm shadow-emerald-500/10"
                >
                  <ExternalLink size={14} /> Buka Peta Google Maps
                </a>
              </div>
            </div>
          </div>

          {/* Sisi Kanan: Kotak Peta Interaktif Menggunakan iFrame Google Maps */}
          <div className="lg:col-span-7 w-full h-[380px] md:h-[450px] bg-zinc-100 rounded-[40px] overflow-hidden relative border-4 border-white shadow-xl shadow-emerald-950/5 group">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d549.8670640409212!2d113.22375263108015!3d-7.178309595611347!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7879cf3e54dd3%3A0xa9d0de1afd4c9e1!2sTanggumong%2C%20Kec.%20Sampang%2C%20Kabupaten%20Sampang%2C%20Jawa%20Timur!5e1!3m2!1sid!2sid!4v1778907842907!5m2!1sid!2sid"
              className="w-full h-full grayscale-[20%] opacity-90 contrast-[110%] group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Peta Lokasi Lahan Pertanian Kelompok Tani Banyu Urip Tanggumong"
            ></iframe>
          </div>
        </div>
      </section>

      <Footer />
      </main>
    </>
  );
}

// Sub-Komponen Kartu Pengurus/Organisasi dengan Wadah Foto Ber-Alt
function OrgCard({ name, role, desc, isPrimary = false }: { name: string, role: string, desc: string, isPrimary?: boolean }) {
  return (
    <div className={`w-full md:max-w-[300px] p-6 rounded-[32px] text-center transition-all duration-500 ease-out flex flex-col items-center group relative border ${
      isPrimary 
        ? 'bg-gradient-to-b from-[#064e3b] to-[#032e23] text-white border-none shadow-xl shadow-emerald-950/20 hover:shadow-2xl hover:shadow-emerald-950/30' 
        : 'bg-white text-gray-900 border-gray-100/80 shadow-md shadow-gray-100 hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-100/30'
    } hover:-translate-y-1.5`}>
      
      {/* Frame Lingkaran Foto Profile dengan Garis Kontras */}
      <div className={`w-24 h-24 rounded-full p-1 mb-5 shrink-0 transition-transform duration-500 group-hover:scale-105 border-2 ${
        isPrimary ? 'border-[#10b981]' : 'border-emerald-500/10'
      }`}>
        <div className="w-full h-full rounded-full overflow-hidden bg-zinc-100 relative shadow-inner">
          <img 
            src="" 
            alt={`Foto profil formal pengurus Kelompok Tani atas nama ${name} selaku ${role}`} 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Nama & Role */}
      <div className="space-y-1 w-full mb-3">
        <h4 className="font-black text-lg tracking-tight leading-tight group-hover:text-[#10b981] transition-colors duration-300">
          {name}
        </h4>
        <p className={`text-[10px] uppercase font-black tracking-[0.25em] ${
          isPrimary ? 'text-[#10b981]' : 'text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block border border-emerald-100/30'
        }`}>
          {role}
        </p>
      </div>

      {/* Deskripsi Tugas Pengurus */}
      <p className={`text-xs leading-relaxed font-medium ${
        isPrimary ? 'text-emerald-50/70' : 'text-gray-500'
      }`}>
        {desc}
      </p>
    </div>
  );
}
