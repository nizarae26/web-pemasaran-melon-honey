import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-poktan-green text-white pt-16 pb-8 px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Branding */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-poktan-green text-xs font-bold">BU</div>
            <h4 className="font-bold leading-tight">Kelompok Tani<br/>Banyu Urip</h4>
          </div>
          <p className="text-sm opacity-70 leading-relaxed">
            Menghasilkan Melon Honey Globe premium dengan teknologi pertanian modern dan kerja sama tim yang solid.
          </p>
          <div className="flex gap-4 pt-2">
            <span className="cursor-pointer hover:text-poktan-leaf">FB</span>
            <span className="cursor-pointer hover:text-poktan-leaf">IG</span>
            <span className="cursor-pointer hover:text-poktan-leaf">WA</span>
          </div>
        </div>

        {/* Navigasi */}
        <div>
          <h4 className="font-bold mb-6 relative inline-block">
            Navigasi
            <span className="absolute -bottom-2 left-0 w-8 h-1 bg-poktan-leaf"></span>
          </h4>
          <ul className="text-sm space-y-3 opacity-70">
            <li><Link href="/" className="hover:text-poktan-leaf">Beranda</Link></li>
            <li><Link href="/profil" className="hover:text-poktan-leaf">Profil</Link></li>
            <li><Link href="/budidaya" className="hover:text-poktan-leaf">Budidaya</Link></li>
            <li><Link href="/katalog" className="hover:text-poktan-leaf">Katalog</Link></li>
            <li><Link href="/monitoring" className="hover:text-poktan-leaf">Sistem Monitoring</Link></li>
          </ul>
        </div>

        {/* Kontak Kami */}
        <div>
          <h4 className="font-bold mb-6 relative inline-block">
            Kontak Kami
            <span className="absolute -bottom-2 left-0 w-8 h-1 bg-poktan-leaf"></span>
          </h4>
          <ul className="text-sm space-y-4 opacity-70">
            <li className="flex gap-3">
              <span>📍</span>
              <span>Desa Tanggumong, Kec. Sampang, Kabupaten Sampang, Madura, Jawa Timur 69217</span>
            </li>
            <li className="flex gap-3 italic">
              <span>📞</span>
              <span>0878-1234-5678</span>
            </li>
            <li className="flex gap-3">
              <span>✉️</span>
              <span>poktanbanyuurip@gmail.com</span>
            </li>
          </ul>
        </div>

        {/* Jam Operasional */}
        <div>
          <h4 className="font-bold mb-6 relative inline-block">
            Jam Operasional
            <span className="absolute -bottom-2 left-0 w-8 h-1 bg-poktan-leaf"></span>
          </h4>
          <div className="text-sm opacity-70">
            <p className="font-bold mb-1">Senin – Sabtu</p>
            <p>07.00 – 16.00 WIB</p>
            <p className="mt-4 text-xs italic">*Pemesanan via WhatsApp tersedia 24 jam</p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-6xl mx-auto pt-8 border-t border-white/10 text-center text-[10px] opacity-40 tracking-widest">
        © 2024 KELOMPOK TANI BANYU URIP. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
}