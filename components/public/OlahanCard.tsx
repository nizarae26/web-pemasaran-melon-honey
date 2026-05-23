import Image from "next/image";
import WhatsAppIcon from "@/components/WhatsAppIcon";

interface OlahanProps {
  title: string;
  description: string;
  price: string;
  image: string;
}

export default function OlahanCard({
  title,
  description,
  price,
  image,
}: OlahanProps) {
  // Format pesan otomatis sesuai nama produk olahan
  const waMessage = `halo, saya ingin bertanya/memesan olahan ${title}`;
  const waLink = `https://wa.me/6287812345678?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col h-full">
      {/* Container Gambar */}
      <div className="relative h-52 w-full overflow-hidden shrink-0">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
            Hasil Olahan
          </span>
        </div>
      </div>

      {/* Konten Teks */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-bold text-gray-800 mb-2 tracking-tight group-hover:text-[#10b981] transition-colors">
          {title}
        </h3>
        <p className="text-gray-500 text-xs mb-6 leading-relaxed line-clamp-2 flex-1">
          {description}
        </p>

        {/* Konten Aksi & Harga (Mengikuti Standar Premium ProductCard) */}
        <div className="pt-4 border-t border-gray-50 mt-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider">
                Mulai dari
              </p>
              <p className="text-xl font-black text-[#10b981] tracking-tight">
                {price}
              </p>
            </div>
          </div>

          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-[#10b981] text-white py-3 rounded-xl font-bold text-xs hover:bg-[#059669] transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm shadow-emerald-500/10 text-center"
          >
            <WhatsAppIcon size={16} />
            <span>Pesan via WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
