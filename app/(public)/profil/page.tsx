"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
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
  const [members, setMembers] = useState<any[]>([]);
  const [tentangKami, setTentangKami] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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

      setLoading(false);
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

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white w-full overflow-x-hidden">
        <ProfilHero />

      {/* 1. Sejarah & Latar Belakang - Tren Asymmetric Clean Layout */}
      <section className="py-28 px-6 md:px-12 lg:px-16 xl:px-24 bg-white relative overflow-hidden">
        {/* Aksen dekoratif latar belakang modern (subtle mesh glow) */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-poktan-accent/30 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="max-w-[1440px] mx-auto grid lg:grid-cols-12 gap-12 xl:gap-20 items-center">
          {/* Teks Sejarah */}
          <div className="space-y-8 lg:col-span-7">
            <div className="inline-flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="h-[2px] w-8 bg-poktan-emerald rounded-full"></span>
                <span className="text-xs font-black uppercase tracking-[0.25em] text-poktan-emerald">
                  Our Legacy
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 tracking-tighter uppercase leading-[0.95]">
                Sejarah & <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-poktan-green to-poktan-emerald">
                  Latar Belakang
                </span>
              </h2>
            </div>

            <div className="space-y-6 text-gray-600 leading-relaxed text-sm md:text-base font-medium">
              {tentangKami ? (
                <p className="whitespace-pre-wrap first-letter:text-4xl first-letter:font-black first-letter:text-poktan-green first-letter:mr-2 first-letter:float-left">
                  {tentangKami}
                </p>
              ) : (
                <>
                  <p className="first-letter:text-4xl first-letter:font-black first-letter:text-poktan-green first-letter:mr-2 first-letter:float-left">
                    Kelompok Tani Banyu Urip terbentuk pada tahun 2018 atas
                    inisiatif para petani di Desa Tanggumong, Kecamatan Sampang,
                    Kabupaten Sampang, Madura.
                  </p>
                  <p>
                    Awal pembentukan kelompok tani kami dilandasi semangat untuk
                    meningkatkan kesejahteraan petani melalui pertanian modern,
                    kelompok tani ini terus belajar dan berinovasi. Saat ini kami
                    fokus membudidayakan{" "}
                    <span className="font-bold text-poktan-emerald bg-poktan-accent/50 px-2 py-0.5 rounded-md border border-poktan-accent">
                      Melon Honey Globe
                    </span>{" "}
                    dengan sistem irigasi tetes pintar dan pengelolaan yang ramah
                    lingkungan.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Sisi Kanan: Premium Image Card & Legalitas Bento Style */}
          <div className="lg:col-span-5 space-y-8 w-full">
            {/* Container Gambar Utama dengan Efek Inner Shadow & Scale */}
            <div className="w-full aspect-[16/10] bg-zinc-50 rounded-[32px] overflow-hidden border border-gray-100 shadow-xl shadow-gray-200/40 group relative">
              <img 
                src="/images/logo-utama.png"
                alt="Foto bersama seluruh anggota pengurus Kelompok Tani Banyu Urip di area perkebunan Tanggumong"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[32px] pointer-events-none"></div>
            </div>


          </div>
        </div>
      </section>

      {/* 2. Visi & Misi - Bento Grid Split Mode */}
      <section className="py-28 bg-gradient-to-b from-gray-50/50 to-white px-6 md:px-10 lg:px-12 xl:px-16">
        <div className="max-w-[1440px] mx-auto grid lg:grid-cols-2 gap-8 xl:gap-12">
          {/* Box Visi - Premium Deep Glass Contrast */}
          <div className="bg-gradient-to-br from-poktan-leaf to-poktan-green p-8 md:p-14 rounded-[40px] text-white flex flex-col items-center text-center justify-center space-y-6 shadow-xl shadow-poktan-green/20 relative overflow-hidden group">
            {/* Decorative gradient overlay inside card */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-poktan-accent/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

            <div className="w-16 h-16 bg-white/10 border border-white/10 rounded-2xl flex items-center justify-center text-poktan-accent backdrop-blur-sm shadow-inner">
              <Rocket size={28} strokeWidth={2} />
            </div>
            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-[0.15em] text-poktan-accent">
              Visi
            </h3>
            <div className="relative max-w-md">
              <span className="text-6xl font-serif text-white/20 absolute -top-8 -left-6 leading-none">
                “
              </span>
              <p className="text-lg md:text-xl xl:text-2xl font-medium leading-relaxed tracking-tight relative z-10 text-white/90">
                Menjadi kelompok tani yang maju, mandiri, dan inovatif dalam
                menghasilkan produk pertanian berkualitas tinggi yang berdaya
                saing.
              </p>
              <span className="text-6xl font-serif text-white/20 absolute -bottom-14 -right-4 leading-none">
                ”
              </span>
            </div>
          </div>

          {/* Box Misi - Clean Minimalist High-Contrast */}
          <div className="bg-white border border-gray-100 p-8 md:p-14 rounded-[40px] shadow-xl shadow-gray-200/30 flex flex-col justify-center space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-poktan-accent/50 rounded-2xl flex items-center justify-center text-poktan-emerald border border-poktan-accent/30">
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
                  <div className="w-6 h-6 bg-gradient-to-br from-poktan-accent/50 to-poktan-accent/80 text-poktan-emerald rounded-lg flex items-center justify-center shrink-0 mt-0.5 font-black text-xs border border-poktan-accent/50">
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

      {/* 3. Struktur Organisasi - Dribbble/Modern Premium Dark UI */}
      <section className="py-16 md:py-32 px-6 md:px-10 lg:px-12 xl:px-16 bg-poktan-green relative overflow-hidden">
        {/* Architectural Grid Background (Light pattern) */}
        <div 
          className="absolute inset-0 opacity-[0.04] pointer-events-none" 
          style={{ 
            backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`, 
            backgroundSize: '40px 40px' 
          }}
        ></div>

        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-poktan-leaf/30 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-[1440px] mx-auto relative z-10">
          <div className="text-center mb-12 md:mb-24 space-y-3 md:space-y-5">
            <span className="inline-block px-4 py-1.5 rounded-full bg-black/20 text-poktan-accent text-[10px] font-black uppercase tracking-[0.3em] border border-white/10 shadow-inner">
              Management Team
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase leading-[0.9]">
              Struktur <span className="text-transparent bg-clip-text bg-gradient-to-r from-poktan-accent to-poktan-emerald">Organisasi</span>
            </h2>
            <p className="text-white/60 font-medium max-w-2xl mx-auto mt-4 text-sm md:text-base leading-relaxed">
              Masa Bakti Tahun 2019-2024 <br/> (Berdasarkan Permentan No. 82 Tahun 2013)
            </p>
          </div>

          <div className="max-w-6xl mx-auto space-y-0">
            {/* Tingkat 1: Ketua */}
            <div className="flex justify-center relative z-20">
              {/* Vertical line down from Ketua */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-[2px] h-20 bg-gradient-to-b from-emerald-700/50 to-emerald-800/50 hidden md:block"></div>
              
              <OrgCard
                name={ketua.name}
                role={ketua.role}
                desc={ketua.desc || ketua.description || ""}
                isPrimary={ketua.isPrimary || ketua.is_primary}
              />
            </div>

            {/* Tingkat 2: Sekretaris & Bendahara */}
            <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-[280px] lg:gap-[360px] pt-6 md:pt-20 relative z-10">
               {/* Garis Horizontal Penghubung dengan border-radius */}
              <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-[280px] lg:w-[360px] h-10 border-t-2 border-l-2 border-r-2 border-emerald-800/50 rounded-t-3xl"></div>

              <OrgCard
                name={sekretaris.name}
                role={sekretaris.role}
                desc={sekretaris.desc || sekretaris.description || ""}
              />
              <OrgCard
                name={bendahara.name}
                role={bendahara.role}
                desc={bendahara.desc || bendahara.description || ""}
              />
            </div>

            {/* Garis vertikal panjang ke Seksi-seksi */}
            <div className="hidden md:flex justify-center relative -mt-32 -z-10">
                <div className="w-[2px] h-48 bg-gradient-to-b from-emerald-800/50 to-transparent"></div>
            </div>

            {/* Tingkat 3: Seksi-Seksi (Modern Masonry/Grid) */}
            <div className="pt-2 md:pt-0 relative z-20">
               
               {/* Baris Pertama: 2 Kotak Besar */}
               <div className="grid md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 mt-4 md:mt-8 items-start">
                  {/* Seksi Usaha Tani */}
                  <SeksiCard title="Seksi Usaha Tani" icon={<Target size={24} className="text-poktan-accent" />}>
                    {seksiUsahaTani.length > 0 ? (
                      seksiUsahaTani.map((m, i) => <SeksiItem key={i} role={m.role} name={m.name} />)
                    ) : (
                      <>
                        <SeksiItem role="Bidang Pertanian" name="SYAMSUL" />
                        <SeksiItem role="Bidang Peternakan" name="MOH FADLI" />
                        <SeksiItem role="Bidang Kehutanan & Perkebunan" name="SALAWATI" />
                        <SeksiItem role="Bidang Perikanan" name="NUR JANNAH" />
                      </>
                    )}
                  </SeksiCard>

                  {/* Seksi Sarana dan Prasarana */}
                  <SeksiCard title="Seksi Sarana & Prasarana" icon={<Rocket size={24} className="text-emerald-400" />}>
                    {seksiSarana.length > 0 ? (
                      seksiSarana.map((m, i) => <SeksiItem key={i} role={m.role} name={m.name} />)
                    ) : (
                      <>
                        <SeksiItem role="Sarana Produksi" name="ST AMINATUS ZUHRIYAH" />
                        <SeksiItem role="Sarana Alsintan" name="MADRAI" />
                        <SeksiItem role="Sarana Permodalan" name="PUIRI" />
                        <SeksiItem role="Sarana Pengairan" name="YASID" />
                      </>
                    )}
                  </SeksiCard>
               </div>

               {/* Baris Kedua: 3 Kotak Kecil */}
               <div className="grid md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mt-4 md:mt-6 lg:mt-8 items-start">
                  <SeksiCard title="Pengendalian Hama & Penyakit" icon={<CheckCircle2 size={24} className="text-poktan-accent" />}>
                    {seksiHama.length > 0 ? (
                      seksiHama.map((m, i) => <SeksiItem key={i} role={m.role} name={m.name} />)
                    ) : (
                      <SeksiItem role="Petugas" name="MARIHA" />
                    )}
                  </SeksiCard>

                  <SeksiCard title="Seksi Pengolahan Hasil" icon={<FileText size={24} className="text-poktan-accent" />}>
                    {seksiPengolahan.length > 0 ? (
                      seksiPengolahan.map((m, i) => <SeksiItem key={i} role={m.role} name={m.name} />)
                    ) : (
                      <SeksiItem role="Petugas" name="NUR HAYATI" />
                    )}
                  </SeksiCard>

                  <SeksiCard title="Seksi Pemasaran" icon={<Users size={24} className="text-poktan-accent" />}>
                    {seksiPemasaran.length > 0 ? (
                      seksiPemasaran.map((m, i) => <SeksiItem key={i} role={m.role} name={m.name} />)
                    ) : (
                      <SeksiItem role="Petugas" name="SYAFIIH" />
                    )}
                  </SeksiCard>
               </div>

               {/* Baris Ketiga: Divisi Dinamis (Otomatis muncul jika ada seksi baru) */}
               {Object.keys(groupedLainnya).length > 0 && (
                 <div className={`grid gap-4 md:gap-6 lg:gap-8 mt-4 md:mt-6 lg:mt-8 items-start border-t border-white/10 pt-8 w-full ${
                    Object.keys(groupedLainnya).length === 1 
                      ? "grid-cols-1" 
                      : Object.keys(groupedLainnya).length === 2 
                        ? "grid-cols-1 md:grid-cols-2"
                        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                 }`}>
                   {Object.entries(groupedLainnya).map(([sectionName, membersList]) => (
                     <SeksiCard key={sectionName} title={sectionName} icon={<Users size={24} className="text-emerald-400" />}>
                       {(membersList as any[]).map((m: any, i: number) => (
                         <SeksiItem key={i} role={m.role} name={m.name} />
                       ))}
                     </SeksiCard>
                   ))}
                 </div>
               )}

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
                    Alamat Kelompok
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
                  className="flex items-center justify-center gap-2 w-full bg-poktan-emerald text-white py-3 rounded-xl font-bold text-xs hover:bg-poktan-green transition-all active:scale-95 shadow-sm shadow-poktan-emerald/10"
                >
                  <ExternalLink size={14} /> Buka Peta Google Maps
                </a>
              </div>
            </div>
          </div>

          {/* Sisi Kanan: Kotak Peta Interaktif Menggunakan iFrame Google Maps */}
          <div className="lg:col-span-7 w-full h-[380px] md:h-[450px] bg-zinc-100 rounded-[40px] overflow-hidden relative border-4 border-white shadow-xl shadow-poktan-green/5 group">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d989.6482979429958!2d113.2257627!3d-7.172934!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd78700623cc9c3%3A0x943205d1b81970ab!2sKing%20Agrowisata!5e0!3m2!1sid!2sid!4v1781857423631!5m2!1sid!2sid"
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
    <div className={`w-full md:max-w-[320px] p-8 rounded-[40px] text-center transition-all duration-500 flex flex-col items-center group relative overflow-hidden ${
      isPrimary 
        ? 'bg-gradient-to-b from-poktan-leaf to-poktan-green text-white shadow-[0_0_40px_rgba(80,141,78,0.3)] border border-poktan-accent/30' 
        : 'bg-white/5 backdrop-blur-xl border border-white/10 text-white shadow-xl hover:bg-white/10'
    } hover:-translate-y-2`}>
      
      {/* Decorative Glow for Primary */}
      {isPrimary && (
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 blur-2xl rounded-full pointer-events-none transition-transform group-hover:scale-150"></div>
      )}

      {/* Avatar Container (Squircle) */}
      <div className={`w-24 h-24 rounded-[28px] rotate-3 group-hover:rotate-0 mb-6 shrink-0 transition-all duration-500 border-4 p-1 ${
        isPrimary ? 'border-white/30' : 'border-white/5'
      }`}>
        <div className={`w-full h-full rounded-[22px] flex items-center justify-center font-black text-4xl shadow-inner ${
          isPrimary ? 'bg-white text-poktan-leaf' : 'bg-gradient-to-br from-white/10 to-white/5 text-poktan-accent border border-white/5'
        }`}>
          {name.charAt(0)}
        </div>
      </div>

      {/* Role Badge */}
      <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${
        isPrimary ? 'bg-black/10 text-white border border-white/20' : 'bg-black/20 text-poktan-accent border border-white/10'
      }`}>
        {role}
      </div>

      {/* Name & Desc */}
      <div className="space-y-3 w-full">
        <h4 className="font-black text-xl tracking-tight leading-none text-white">
          {name}
        </h4>
        <p className={`text-[13px] leading-relaxed font-medium ${
          isPrimary ? 'text-white/90' : 'text-white/60'
        }`}>
          {desc}
        </p>
      </div>
    </div>
  );
}

function SeksiCard({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] md:rounded-[40px] p-6 md:p-8 shadow-xl hover:bg-white/10 hover:border-poktan-accent/30 transition-all duration-500 group">
      <div className="flex items-center gap-4 md:gap-5 mb-6 md:mb-8">
        <div className="w-12 h-12 md:w-14 md:h-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 border border-white/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
          {icon}
        </div>
        <h4 className="font-bold text-white text-base md:text-lg leading-tight tracking-tight">{title}</h4>
      </div>
      <div className="space-y-4 md:space-y-5">
        {children}
      </div>
    </div>
  );
}

function SeksiItem({ role, name }: { role: string, name: string }) {
  return (
    <div className="flex flex-col gap-1 md:gap-1.5 group/item">
      <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{role}</span>
      <div className="flex items-center gap-2 md:gap-3">
        <div className="w-7 h-7 md:w-8 md:h-8 rounded-[10px] md:rounded-xl bg-white/5 flex items-center justify-center text-poktan-accent font-black text-xs border border-white/5 group-hover/item:bg-poktan-leaf group-hover/item:text-white transition-colors duration-300">
          {name.charAt(0)}
        </div>
        <span className="text-sm font-bold text-white/80 group-hover/item:text-white">{name}</span>
      </div>
    </div>
  );
}
