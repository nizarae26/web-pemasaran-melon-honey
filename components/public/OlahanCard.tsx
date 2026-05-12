import Image from 'next/image';

interface OlahanProps {
  title: string;
  description: string;
  price: string;
  image: string;
}

export default function OlahanCard({ title, description, price, image }: OlahanProps) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-gray-100 group">
      {/* Container Gambar */}
      <div className="relative h-56 w-full overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-poktan-orange text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Hasil Olahan
          </span>
        </div>
      </div>

      {/* Konten Teks */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm mb-4 leading-relaxed line-clamp-2">
          {description}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold">Mulai dari</p>
            <p className="text-lg font-bold text-poktan-green">{price}</p>
          </div>
          <button className="bg-poktan-leaf/10 text-poktan-green p-2.5 rounded-xl hover:bg-poktan-green hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}