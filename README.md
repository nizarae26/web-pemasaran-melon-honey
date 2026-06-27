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

## 🔄 Catatan Pembaruan (Update Log) Terakhir
Beberapa pembaruan sistem dan desain yang baru saja diselesaikan:
1. **Perbaikan UX Upload Gambar CMS:** Memperbaiki lapisan *overlay* (z-index) agar admin dapat dengan mudah mengklik/mengubah foto di *modal* form.
2. **Standardisasi Tata Letak (Layout) Thumbnail:** Menyesuaikan *thumbnail* artikel dan galeri dengan patokan *pixel* pasti (`fixed height`). Semua foto yang diunggah akan otomatis terpotong proporsional mengikuti rasio kotak, mencegah tampilan halaman rusak akibat unggahan foto potret yang memanjang.
3. **Penyempurnaan Alert:** Standarisasi semua *alert* (sukses/gagal/hapus) di seluruh halaman Admin (Produk, Galeri, Artikel, Anggota) menjadi *pop-up* elegan menggunakan SweetAlert2.
4. **Penyempurnaan Ikon:** Menggunakan ikon `MonitorSmartphone` untuk menu Monitoring, dan ikon `Edit` sebagai indikasi bahwa gambar dapat diubah.

## 💻 Menjalankan Proyek Secara Lokal

1. Buka terminal lalu install dependencies:
   ```bash
   npm install
   ```
2. Jalankan server pengembangan (development):
   ```bash
   npm run dev
   ```
3. Buka browser dan arahkan ke [http://localhost:3000](http://localhost:3000).

---
*Didedikasikan untuk memajukan sektor pertanian lokal di era digital.*
