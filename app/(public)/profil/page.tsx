/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfilHero from "@/components/public/ProfilHero";
import {
  FileText,
  Target,
  Rocket,
  MapPin,
  ExternalLink,
  Users,
  CheckCircle2,
} from "lucide-react";

const isFemale = (name: string) => {
  if (!name) return false;
  const femaleKeywords = ['AMINATUS', 'SALAWATI', 'JANNAH', 'HAYATI', 'MARIHA', 'SITI', 'ELIYUN', 'FATIMAH', 'NUR HAYATI', 'NUR JANNAH', 'PUTRI', 'AYU', 'DEWI', 'WATI'];
  const upper = name.toUpperCase();
  return femaleKeywords.some(kw => upper.includes(kw));
};

export default function ProfilPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [tentangKami, setTentangKami] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      // Fetch members
      const { data: membersData, error: membersError } = await supabase
        .from("members")
        .select("*")
        .order("sort_order", { ascending: true });

      if (!membersError && membersData && membersData.length > 0) {
        setMembers(membersData);
      }

      // Fetch settings
      const { data: settingsData, error: settingsError } = await supabase
        .from("settings")
        .select("*")
        .eq("key", "tentang_kami")
        .single();

      if (!settingsError && settingsData) {
        setTentangKami(settingsData.value);
      }
    }
    fetchData();
  }, []);

  // Filter members based on role/section
  const ketua = members.find(m => m.is_primary) || { name: "MAULIDI RIYANTO", role: "Ketua", desc: "Memimpin dan bertanggung jawab penuh atas seluruh arah kebijakan dan kegiatan kelompok tani.", isPrimary: true };

  // Ambil semua anggota yang bukan ketua
  const nonKetua = members.filter(m => m.id !== ketua.id);

  const sekretaris = nonKetua.find(m => m.role?.toLowerCase().includes("sekretaris")) || { name: "SYAIFUL QOHHAR", role: "Sekretaris", desc: "Mengelola administrasi, data anggota, dan urusan surat menyurat kelompok." };
  const bendahara = nonKetua.find(m => m.role?.toLowerCase().includes("bendahara")) || { name: "ELIYUN", role: "Bendahara", desc: "Mengatur pengelolaan keuangan, audit, dan pembukuan kelompok tani." };

  const seksiUsahaTani = nonKetua.filter(m => m.section?.toLowerCase().includes("usaha tani"));
  const seksiSarana = nonKetua.filter(m => m.section?.toLowerCase().includes("sarana"));
  const seksiHama = nonKetua.filter(m => m.section?.toLowerCase().includes("hama"));
  const seksiPengolahan = nonKetua.filter(m => m.section?.toLowerCase().includes("pengolahan"));
  const seksiPemasaran = nonKetua.filter(m => m.section?.toLowerCase().includes("pemasaran"));

  // Kumpulkan anggota yang belum masuk ke kategori mana pun (Lainnya)
  const anggotaTerdata = [
    sekretaris.name, 
    bendahara.name, 
    ...seksiUsahaTani.map(m=>m.name),
    ...seksiSarana.map(m=>m.name),
    ...seksiHama.map(m=>m.name),
    ...seksiPengolahan.map(m=>m.name),
    ...seksiPemasaran.map(m=>m.name)
  ];
  
  const anggotaLainnya = nonKetua.filter(m => !anggotaTerdata.includes(m.name));

  // Kelompokkan anggota lainnya berdasarkan section-nya (jika ada)
  const groupedLainnya = anggotaLainnya.reduce((acc, member) => {
    const sec = member.section || "Divisi Lainnya";
    if (!acc[sec]) acc[sec] = [];
    acc[sec].push(member);
    return acc;
  }, {} as Record<string, any[]>);

  const categories = [
    { title: "Pengurus Inti", members: [ketua, sekretaris, bendahara] },
    { title: "Seksi Usaha Tani", members: seksiUsahaTani.length > 0 ? seksiUsahaTani : [{name: "SYAMSUL", role: "Bidang Pertanian"}, {name: "MOH FADLI", role: "Bidang Peternakan"}, {name: "SALAWATI", role: "Bidang Kehutanan & Perkebunan"}, {name: "NUR JANNAH", role: "Bidang Perikanan"}] },
    { title: "Seksi Sarana & Prasarana", members: seksiSarana.length > 0 ? seksiSarana : [{name: "ST AMINATUS ZUHRIYAH", role: "Sarana Produksi"}, {name: "MADRAI", role: "Sarana Alsintan"}, {name: "PUIRI", role: "Sarana Permodalan"}, {name: "YASID", role: "Sarana Pengairan"}] },
    { title: "Pengendalian Hama & Penyakit", members: seksiHama.length > 0 ? seksiHama : [{name: "MARIHA", role: "Petugas"}] },
    { title: "Seksi Pengolahan Hasil", members: seksiPengolahan.length > 0 ? seksiPengolahan : [{name: "NUR HAYATI", role: "Petugas"}] },
    { title: "Seksi Pemasaran", members: seksiPemasaran.length > 0 ? seksiPemasaran : [{name: "SYAFIIH", role: "Petugas"}] },
  ];

  Object.entries(groupedLainnya).forEach(([title, membersList]) => {
    categories.push({ title, members: membersList as any[] });
  });

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50/50 w-full overflow-x-hidden">
        <ProfilHero />

      {/* 1. Visi & Misi - Asymmetric Card Design */}
      <section className="py-24 md:py-32 bg-white px-6 md:px-10 lg:px-12 xl:px-16 overflow-hidden">
        <div className="max-w-[1300px] mx-auto relative pt-16 lg:pr-8 pb-16">
          
          {/* Main Container Box */}
          <div className="bg-poktan-green rounded-[32px] w-full lg:w-[85%] ml-auto relative shadow-2xl z-10 flex flex-col lg:flex-row min-h-[500px]">
            
            {/* Decorative Top Right Square */}
            <motion.div 
              animate={{ x: [0, 25, 0], y: [0, -10, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-8 -right-4 md:-top-12 md:-right-8 w-24 h-24 md:w-48 md:h-48 bg-poktan-leaf rounded-3xl md:rounded-[40px] z-[-1] opacity-90 shadow-xl"
            ></motion.div>
            
            {/* Decorative Bottom Square */}
            <motion.div 
              animate={{ x: [0, -25, 0], y: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-12 left-[20%] w-24 h-24 md:w-36 md:h-36 bg-poktan-leaf rounded-2xl md:rounded-[32px] z-[-1] hidden lg:block opacity-90 shadow-xl"
            ></motion.div>

            {/* Left side Image (Absolute on Desktop, static on mobile) */}
            <div className="w-[90%] max-w-[400px] md:max-w-[500px] mx-auto lg:w-[480px] xl:w-[550px] lg:absolute lg:-left-[5%] xl:-left-[8%] lg:top-[50%] lg:-translate-y-[50%] aspect-[4/3] lg:aspect-[4/3] -mt-12 lg:mt-0 z-20 rounded-2xl md:rounded-[32px] overflow-hidden shadow-2xl border-4 lg:border-8 border-white/10">
              <img 
                src="/images/profil.jpeg" 
                alt="Agrowisata Melon Honey Globe Tanggumong" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right side Text */}
            <div className="w-full lg:w-[60%] xl:w-[65%] ml-auto py-12 px-8 sm:px-12 lg:pr-12 xl:pr-16 lg:pl-24 xl:pl-24 lg:py-20 z-20 text-white space-y-12 md:space-y-16">
              
              <div className="space-y-4 md:space-y-6 relative">
                <h3 className="text-3xl md:text-5xl font-serif font-black text-white/95 tracking-widest drop-shadow-sm">
                  VISI
                </h3>
                <p className="text-white/80 leading-relaxed font-medium md:text-lg">
                  Menjadi kelompok tani yang maju, mandiri, dan inovatif dalam menghasilkan produk pertanian berkualitas tinggi yang berdaya saing.
                </p>
              </div>

              <div className="space-y-4 md:space-y-6 relative">
                <h3 className="text-3xl md:text-5xl font-serif font-black text-white/95 tracking-widest drop-shadow-sm">
                  MISI
                </h3>
                <ul className="space-y-4 md:space-y-5 text-white/80 font-medium md:text-lg leading-relaxed">
                  <li className="flex items-start gap-4">
                    <span className="mt-1.5 text-poktan-leaf font-black text-sm md:text-base">•</span>
                    <p>Meningkatkan kualitas dan produktivitas hasil pertanian.</p>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="mt-1.5 text-poktan-leaf font-black text-sm md:text-base">•</span>
                    <p>Menerapkan inovasi teknologi pertanian modern yang ramah lingkungan.</p>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="mt-1.5 text-poktan-leaf font-black text-sm md:text-base">•</span>
                    <p>Memberdayakan anggota untuk kesejahteraan bersama.</p>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="mt-1.5 text-poktan-leaf font-black text-sm md:text-base">•</span>
                    <p>Memperluas jaringan pemasaran produk secara berkelanjutan.</p>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 2. Sejarah & Latar Belakang - Tren Asymmetric Clean Layout */}
      <section className="py-20 md:py-28 px-6 md:px-12 lg:px-16 xl:px-24 bg-poktan-leaf relative overflow-hidden text-white">
        {/* Aksen dekoratif latar belakang modern (subtle mesh glow) */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          {/* Teks Sejarah */}
          <div className="space-y-8 w-full px-4 relative z-10">
            <div className="flex flex-col items-center gap-4 border-b border-white/20 pb-6">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-tight">
                Sejarah & Latar Belakang
              </h2>
            </div>

            <div className="space-y-5 text-white/90 leading-relaxed text-sm md:text-base font-medium max-w-2xl mx-auto">
              {tentangKami ? (
                <p className="whitespace-pre-wrap">
                  {tentangKami}
                </p>
              ) : (
                <>
                  <p>
                    Kelompok Tani Banyu Urip terbentuk pada tahun 2019 atas
                    inisiatif para petani di Desa Tanggumong, Kecamatan Sampang,
                    Kabupaten Sampang, Madura.
                  </p>
                  <p>
                    Awal pembentukan kelompok tani kami dilandasi semangat untuk
                    meningkatkan kesejahteraan petani melalui pertanian modern,
                    kelompok tani ini terus belajar dan berinovasi. Saat ini kami
                    fokus membudidayakan Melon Honey Globe & Golden Apollo 
                    dengan sistem irigasi tetes pintar dan pengelolaan yang ramah
                    lingkungan.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Struktur Organisasi - Horizontal Scroll Grid */}
      <section className="py-20 md:py-32 px-6 md:px-10 lg:px-12 xl:px-16 bg-white relative overflow-hidden">
        <div className="max-w-[1300px] mx-auto relative z-10">
          <div className="flex flex-col items-center text-center mb-12 md:mb-16 gap-1 md:gap-2 border-b border-gray-100 pb-6">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-poktan-leaf tracking-tight">
              Struktur Organisasi
            </h2>
            <p className="text-gray-500 font-medium text-xs md:text-sm">
              Masa Bakti 2019-2024 (Permentan No. 82 Tahun 2013)
            </p>
          </div>

          <div className="space-y-16">
            {/* Top Categories (Scroll Horizontal) */}
            {categories.slice(0, 3).map((category, idx) => (
              <div key={idx} className="w-full">
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-gray-800 mb-8 border-b-2 border-poktan-leaf/20 pb-4 inline-block">
                  {category.title}
                </h3>
                
                {/* Horizontal Scroll Container */}
                <div 
                  className="flex gap-6 md:gap-8 overflow-x-auto pb-8 pt-6 px-4 -mx-4 -mt-6 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden" 
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {category.members.map((member, mIdx) => (
                    <motion.div 
                      key={mIdx} 
                      className="snap-start shrink-0"
                      initial={{ opacity: 0, scale: 0.9, y: 30 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, delay: mIdx * 0.1, ease: "easeOut" }}
                    >
                      <ProfileCard name={member.name} role={member.role} />
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}

            {/* Bottom Categories (Grid 3 Kolom) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-8 pt-4">
              {categories.slice(3).map((category, idx) => (
                <div key={idx} className="w-full flex flex-col">
                  <h3 className="text-xl md:text-2xl font-serif font-bold text-gray-800 mb-6 border-b-2 border-poktan-leaf/20 pb-3 self-start">
                    {category.title}
                  </h3>
                  <div className="flex flex-wrap gap-6">
                    {category.members.map((member, mIdx) => (
                      <motion.div
                        key={mIdx}
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: mIdx * 0.1, ease: "easeOut" }}
                      >
                        <ProfileCard name={member.name} role={member.role} />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Lokasi Kami */}
      <section className="py-12 md:py-24 bg-poktan-accent/30 px-6 md:px-10 lg:px-12 xl:px-16 border-t border-poktan-accent/50">
        <div className="max-w-[1440px] mx-auto grid lg:grid-cols-12 gap-12 xl:gap-20 items-center">
          <div className="space-y-8 lg:col-span-5 w-full">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight uppercase">
                Lokasi Kami
              </h2>
              <div className="w-12 h-1.5 bg-poktan-emerald rounded-full"></div>
            </div>

            <div className="space-y-5">
              <div className="flex gap-5 items-start">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-poktan-emerald shrink-0 shadow-sm border border-poktan-accent/60">
                  <MapPin size={22} />
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-sm text-gray-800">
                    Alamat Kelompok Tani
                  </p>
                  <p className="text-gray-500 leading-relaxed text-xs md:text-sm">
                    Desa Tanggumong, Kecamatan Sampang, Kabupaten Sampang,
                    Madura, Jawa Timur 69217
                  </p>
                </div>
              </div>

              <div className="p-6 bg-white rounded-3xl border border-poktan-accent/60 shadow-sm">
                <p className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-2">
                  Koordinat GPS Google Maps
                </p>
                <code className="text-poktan-emerald font-mono text-xs md:text-sm block bg-zinc-50 p-2.5 rounded-lg border border-gray-100 mb-4 select-all">
                  -7.172934, 113.2257627
                </code>
                <a
                  href="https://www.google.com/maps/place/King+Agrowisata/@-7.172934,113.2257627,17z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full bg-poktan-leaf hover:bg-poktan-green text-white py-3.5 rounded-xl font-bold text-xs shadow-md shadow-poktan-leaf/10 hover:shadow-lg hover:shadow-poktan-leaf/20 active:scale-[0.98] transition-all duration-300"
                >
                  <ExternalLink size={14} /> Buka Peta Google Maps
                </a>
              </div>
            </div>
          </div>

          {/* Sisi Kanan: Kotak Peta Interaktif Menggunakan iFrame Google Maps */}
          <div className="lg:col-span-7 w-full h-[380px] md:h-[450px] bg-slate-50/50 rounded-2xl overflow-hidden relative border border-[#f0f4f1] shadow-sm group">
            <div className="absolute inset-0 bg-poktan-leaf/5 mix-blend-multiply pointer-events-none z-10 transition-opacity duration-500 group-hover:opacity-0"></div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d989.6482979429958!2d113.2257627!3d-7.172934!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd78700623cc9c3%3A0x943205d1b81970ab!2sKing%20Agrowisata!5e0!3m2!1sid!2sid!4v1781857423631!5m2!1sid!2sid"
              className="w-full h-full opacity-80 saturate-50 sepia-[15%] group-hover:opacity-100 group-hover:saturate-100 group-hover:sepia-0 transition-all duration-700 ease-in-out"
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

// Sub-Komponen Profile Card Baru (Menggantikan OrgCard dan SeksiCard)
function ProfileCard({ name, role }: { name: string, role: string }) {
  return (
    <div className="flex flex-col gap-3 shrink-0">
      <div className="w-[180px] h-[220px] md:w-[200px] md:h-[240px] bg-gradient-to-br from-poktan-leaf to-poktan-green rounded-[24px] relative overflow-hidden group shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Placeholder Icon */}
        <div className="absolute inset-0 flex items-center justify-center text-7xl text-white/20 group-hover:scale-110 transition-transform duration-500">
          {isFemale(name) ? "🧕" : "🧑‍🌾"}
        </div>
        
        {/* Gradient Overlay at Bottom */}
        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-5">
          <h4 className="text-white font-bold text-sm md:text-base leading-tight mb-1">{name}</h4>
          <p className="text-white/80 text-[10px] md:text-xs font-medium">{role}</p>
        </div>
      </div>
    </div>
  );
}
