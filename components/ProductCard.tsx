interface ProductProps {
  name: string;
  grade: string;
  price: string;
  weight: string;
  status: 'Tersedia' | 'Pre-Order' | 'Habis';
}

export default function ProductCard({ name, grade, price, weight, status }: ProductProps) {
  // Logika warna badge berdasarkan status produk [cite: 24]
  const statusColor = status === 'Tersedia' ? 'bg-green-500' : status === 'Pre-Order' ? 'bg-poktan-orange' : 'bg-poktan-red';

  return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 hover:shadow-xl transition">
      <div className="relative h-48 bg-gray-200">
        {/* Badge Status [cite: 24] */}
        <span className={`absolute top-3 left-3 text-white text-xs font-bold px-3 py-1 rounded-full ${statusColor}`}>
          {status.toUpperCase()}
        </span>
        <div className="flex items-center justify-center h-full text-gray-400">Gambar Melon</div>
      </div>
      
      <div className="p-5 text-center">
        <h3 className="font-bold text-lg text-gray-800">{name}</h3>
        <p className="text-sm text-gray-500 mb-2">{grade} • {weight}</p>
        <p className="text-poktan-leaf font-bold text-xl mb-4">{price}</p>
        
        {/* Tombol WhatsApp sesuai Mockup [cite: 25] */}
        <button className="w-full bg-poktan-leaf text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-opacity-90 transition">
          <span>💬</span> Pesan via WhatsApp
        </button>
      </div>
    </div>
  );
}