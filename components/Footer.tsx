import Link from "next/link";
import {
  Leaf,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

// Komponen Ikon Manual (Anti-Error)
const FacebookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-poktan-green text-white pt-20 pb-10 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-16">
        {/* 1. Branding Section */}
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-black/10 group-hover:scale-110 transition-transform">
              <Leaf size={22} strokeWidth={2.5} className="text-poktan-green" />
            </div>
            {/* Mengurangi ketebalan font agar lebih ringan dibaca */}
            <span className="font-medium text-lg tracking-tight leading-none">
              Kelompok Tani
              <br />
              <span className="font-bold text-xl">Banyu Urip</span>
            </span>
          </Link>
          <p className="text-sm text-white/80 leading-relaxed max-w-xs">
            Pelopor pertanian melon modern di Madura. Menghasilkan kualitas
            premium melalui teknologi irigasi tetes pintar dan dedikasi petani
            lokal Tanggumong.
          </p>
          <div className="flex gap-4">
            {[
              { icon: <FacebookIcon />, href: "#" },
              { icon: <InstagramIcon />, href: "#" },
              { icon: <MessageCircle size={18} />, href: "#" },
            ].map((social, i) => (
              <a
                key={i}
                href={social.href}
                className="w-10 h-10 bg-white/10 border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-poktan-green transition-all"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* 2. Navigasi Cepat */}
        <div>
          <h4 className="font-bold text-lg mb-8 relative inline-block">
            Navigasi
            <span className="absolute -bottom-2 left-0 w-8 h-1 bg-poktan-leaf"></span>
          </h4>
          <ul className="space-y-4">
            {[
              { name: "Beranda", href: "/" },
              { name: "Profil Kami", href: "/profil" },
              { name: "Teknologi Budidaya", href: "/budidaya" },
              { name: "Katalog Produk", href: "/katalog" },
              { name: "Sistem Monitoring", href: "/monitoring" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  /* Memastikan teks sejajar dengan judul (menghapus gap icon statis) */
                  className="text-sm text-white/70 hover:text-white flex items-center group transition-all"
                >
                  <span className="group-hover:translate-x-1 transition-transform flex items-center gap-2">
                    {link.name}
                    <ArrowRight
                      size={14}
                      className="opacity-0 group-hover:opacity-100 transition-all"
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. Kontak Info */}
        <div>
          <h4 className="font-bold text-lg mb-8 relative inline-block">
            Kontak Kami
            <span className="absolute -bottom-2 left-0 w-8 h-1 bg-poktan-leaf"></span>
          </h4>
          <ul className="space-y-6">
            {/* Alamat: menggunakan items-start karena teksnya panjang */}
            <li className="flex items-start gap-4 group">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white shrink-0 group-hover:bg-white group-hover:text-poktan-green transition-colors">
                <MapPin size={20} />
              </div>
              <span className="text-sm text-white/80 leading-relaxed">
                Desa Tanggumong, Kec. Sampang, Kabupaten Sampang, Madura, Jawa
                Timur 69217
              </span>
            </li>

            {/* Telepon: items-center agar sejajar tengah */}
            <li className="flex items-center gap-4 group">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white shrink-0 group-hover:bg-white group-hover:text-poktan-green transition-colors">
                <Phone size={20} />
              </div>
              <span className="text-sm text-white/80">0878-1234-5678</span>
            </li>

            {/* Email: items-center agar sejajar tengah */}
            <li className="flex items-center gap-4 group">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white shrink-0 group-hover:bg-white group-hover:text-poktan-green transition-colors">
                <Mail size={20} />
              </div>
              <span className="text-sm text-white/80">
                poktanbanyuurip@gmail.com
              </span>
            </li>
          </ul>
        </div>

        {/* 4. Jam Kerja */}
        <div>
          <h4 className="font-bold text-lg mb-8 relative inline-block">
            Jam Kerja
            <span className="absolute -bottom-2 left-0 w-8 h-1 bg-poktan-leaf"></span>
          </h4>
          <div className="bg-white/10 border border-white/20 p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
              <span className="text-sm text-white/70 font-medium">
                Senin – Sabtu
              </span>
              <span className="text-sm font-bold text-white">
                07:00 – 16:00
              </span>
            </div>
            <p className="text-[11px] text-white/60 italic leading-relaxed">
              *Layanan bantuan via WhatsApp tersedia 24 jam untuk mitra dan
              pembeli.
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-white/40 font-medium tracking-wider">
        <p>© 2024 KELOMPOK TANI BANYU URIP. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-8 uppercase">
          <Link href="#" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
          <Link href="#" className="hover:text-white transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
