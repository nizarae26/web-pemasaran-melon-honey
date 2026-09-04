import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or Key is missing.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const initialMembers = [
  { name: 'MAULIDI RIYANTO', role: 'Ketua', section: null, description: 'Memimpin dan bertanggung jawab penuh atas seluruh arah kebijakan dan kegiatan kelompok tani.', is_primary: true, sort_order: 1 },
  { name: 'SYAIFUL QOHHAR', role: 'Sekretaris', section: null, description: 'Mengelola administrasi, data anggota, dan urusan surat menyurat kelompok.', is_primary: false, sort_order: 2 },
  { name: 'ELIYUN', role: 'Bendahara', section: null, description: 'Mengatur pengelolaan keuangan, audit, dan pembukuan kelompok tani.', is_primary: false, sort_order: 3 },
  { name: 'SYAMSUL', role: 'Bidang Pertanian', section: 'Seksi Usaha Tani', description: null, is_primary: false, sort_order: 4 },
  { name: 'MOH FADLI', role: 'Bidang Peternakan', section: 'Seksi Usaha Tani', description: null, is_primary: false, sort_order: 5 },
  { name: 'SALAWATI', role: 'Bidang Kehutanan & Perkebunan', section: 'Seksi Usaha Tani', description: null, is_primary: false, sort_order: 6 },
  { name: 'NUR JANNAH', role: 'Bidang Perikanan', section: 'Seksi Usaha Tani', description: null, is_primary: false, sort_order: 7 },
  { name: 'ST AMINATUS ZUHRIYAH', role: 'Sarana Produksi', section: 'Seksi Sarana & Prasarana', description: null, is_primary: false, sort_order: 8 },
  { name: 'MADRAI', role: 'Sarana Alsintan', section: 'Seksi Sarana & Prasarana', description: null, is_primary: false, sort_order: 9 },
  { name: 'PUIRI', role: 'Sarana Permodalan', section: 'Seksi Sarana & Prasarana', description: null, is_primary: false, sort_order: 10 },
  { name: 'YASID', role: 'Sarana Pengairan', section: 'Seksi Sarana & Prasarana', description: null, is_primary: false, sort_order: 11 },
  { name: 'MARIHA', role: 'Petugas', section: 'Pengendalian Hama & Penyakit', description: null, is_primary: false, sort_order: 12 },
  { name: 'NUR HAYATI', role: 'Petugas', section: 'Seksi Pengolahan Hasil', description: null, is_primary: false, sort_order: 13 },
  { name: 'SYAFIIH', role: 'Petugas', section: 'Seksi Pemasaran', description: null, is_primary: false, sort_order: 14 }
];

async function seed() {
  console.log('Inserting members...');
  
  // Empty existing just in case (will fail if RLS prevents delete, but that's ok we just insert)
  await supabase.from('members').delete().neq('id', 0);
  
  const { error } = await supabase.from('members').insert(initialMembers);
  
  if (error) {
    console.error('Error inserting members:', error.message);
  } else {
    console.log('Successfully inserted members!');
  }
}

seed();
