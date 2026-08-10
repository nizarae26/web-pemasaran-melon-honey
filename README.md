# Web Pemasaran Melon Honey - Kelompok Tani Banyu Urip

Website ini dikembangkan untuk Kelompok Tani Banyu Urip guna memperkenalkan, mempromosikan, serta memasarkan produk unggulan berupa **Melon Honey** dan produk pertanian lainnya.

## 🚀 Fitur Utama

### 1. Halaman Publik (Pengunjung)
- **Beranda (Home):** Tampilan utama yang menarik dengan pengenalan singkat kelompok tani.
- **Profil (Tentang Kami):** Informasi detail mengenai Kelompok Tani Banyu Urip, visi misi, dan susunan pengurus.
- **Katalog Produk:** Menampilkan daftar produk unggulan yang tersedia untuk dijual.
- **Galeri & Berita:** Dokumentasi kegiatan (foto/video) dan pembaruan artikel/berita terbaru.
- **Edukasi Budidaya:** Panduan dan edukasi seputar proses penanaman hingga panen melon.

### 2. Halaman Admin (CMS)
Dashboard khusus admin untuk mengelola konten website dengan fitur:
- **Manajemen Produk:** Tambah, ubah, dan hapus produk katalog dengan sistem unggah foto yang rapi (fitur proporsi piksel tetap).
- **Manajemen Galeri:** Kelola foto dokumentasi kegiatan dengan tampilan responsif.
- **Manajemen Artikel:** Kelola berita dan artikel edukasi.
- **Manajemen Anggota:** Kelola daftar anggota dan struktur organisasi kepengurusan.
- **Monitoring:** (Dalam pengembangan) Memantau aktivitas atau data IoT pertanian.
- **Notifikasi Pintar:** Menggunakan `SweetAlert2` untuk konfirmasi aksi (*delete*, *success*, dll).

## 🛠️ Teknologi yang Digunakan
- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS (Modern, Clean, UI/UX Animations)
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Database & Storage:** Supabase (PostgreSQL, Storage, Auth)
- **Notifikasi:** SweetAlert2 & React Hot Toast

## 💻 Menjalankan Proyek Secara Lokal

1. Buka terminal lalu install dependencies:
   ```bash
   npm install
   ```
2. Buat file `.env.local` di root folder dan tambahkan environment variable berikut (dapatkan dari project Supabase Anda):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
3. Jalankan server pengembangan (development):
   ```bash
   npm run dev
   ```
4. Buka browser dan arahkan ke [http://localhost:3000](http://localhost:3000).

---
*Didedikasikan untuk memajukan sektor pertanian lokal di era digital.*
