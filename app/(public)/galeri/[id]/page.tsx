/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Calendar, Tag, Link2, Sparkles } from "lucide-react";
import WhatsAppIcon from "@/components/WhatsAppIcon";
import { Toaster, toast } from "react-hot-toast";

export default function DetailBeritaPage() {
  const { id } = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<any>(null);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      if (!id) return;
      
      // Fetch main article and related articles concurrently for speed
      const [mainResponse, relatedResponse] = await Promise.all([
        supabase.from("articles").select("*").eq("id", id).single(),
        supabase.from("articles").select("*").neq("id", id).order("created_at", { ascending: false }).limit(5)
      ]);

      if (mainResponse.data) {
        const data = mainResponse.data;
        setArticle({
          id: data.id,
          title: data.title,
          date: new Date(data.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
          tag: data.tag,
          desc: data.description,
          image: data.image_url,
        });

        if (relatedResponse.data) {
          setRelatedArticles(relatedResponse.data.map((a) => ({
            id: a.id,
            title: a.title,
            date: new Date(a.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
            tag: a.tag,
            image: a.image_url,
          })));
        }
      } else {
        console.error("Error fetching article:", mainResponse.error);
      }
      setLoading(false);
    }
    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-slate-50/50 pt-[5px] pb-20 flex items-center justify-center">
          <div className="animate-pulse text-gray-400 font-semibold">Memuat Artikel...</div>
        </main>
        <Footer />
      </>
    );
  }

  if (!article) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-slate-50/50 pt-[5px] pb-20 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Artikel Tidak Ditemukan</h2>
            <button 
              onClick={() => router.push('/galeri')}
              className="text-poktan-green hover:underline flex items-center gap-2 justify-center mx-auto"
            >
              <ArrowLeft size={16} /> Kembali ke Galeri
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50/50 pt-[5px] pb-20">
        <div className="w-full px-6 md:px-10 lg:px-16 mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Main Content (Kiri) */}
            <div className="lg:col-span-8">
              {/* Tombol Kembali */}
              <button 
                onClick={() => router.push('/galeri')}
                className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-poktan-leaf transition-colors mb-6 group mt-6"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                <span>Kembali ke Galeri</span>
              </button>

              <article className="bg-transparent">
                {/* Meta & Title di atas gambar (seperti gambar referensi 1) */}
                <div className="mb-6">
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-4">
                    {article.title}
                  </h1>
                  
                  <div className="flex items-center text-xs md:text-sm text-gray-500 mb-3 gap-3 flex-wrap border-b-2 border-poktan-leaf/20 pb-4 inline-flex w-auto">
                    <span className="flex items-center gap-1.5 font-bold text-poktan-green">
                      <Tag size={12} />
                      {article.tag || "Berita"}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Calendar size={14} />
                      {article.date}
                    </span>
                    <span>•</span>
                    <span>Oleh Admin</span>
                  </div>
                </div>

                {/* Header Image (Rounded None) */}
                <div className="w-full aspect-video bg-zinc-100 relative mb-8 rounded-none border border-gray-200">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="prose prose-emerald max-w-none text-gray-700 leading-relaxed text-base md:text-lg whitespace-pre-wrap mb-8">
                  {article.desc}
                </div>

                {/* Share Buttons */}
                <div className="flex items-center gap-3 py-6 border-t border-b border-gray-200 flex-wrap">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-2">Bagikan Artikel Ini:</span>
                  
                  <button
                    onClick={() => {
                      const text = encodeURIComponent(`Baca berita terbaru dari Poktan Banyu Urip: "${article.title}"\n\nSelengkapnya di website kami.`);
                      const url = encodeURIComponent(window.location.href);
                      window.open(`https://api.whatsapp.com/send?text=${text}%20${url}`, '_blank');
                    }}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 text-xs font-semibold px-4 py-2 rounded-none flex items-center gap-2 active:scale-95 transition-all shadow-sm"
                  >
                    <WhatsAppIcon size={14} />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Tautan berhasil disalin!");
                    }}
                    className="bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 text-xs font-semibold px-4 py-2 rounded-none flex items-center gap-2 active:scale-95 transition-all shadow-sm"
                  >
                    <Link2 size={14} />
                    <span>Salin Link</span>
                  </button>
                </div>
              </article>
            </div>

            {/* Sidebar (Kanan) - Blog Terkait */}
            <aside className="lg:col-span-4 space-y-10">
              <div className="sticky top-24 pt-6">
                <h4 className="font-black text-lg text-gray-900 border-b-2 border-poktan-leaf pb-2 mb-6 inline-block">
                  Blog terkait
                </h4>
                
                <div className="flex flex-col gap-4">
                  {relatedArticles.map((item, i) => (
                    <div 
                      key={i} 
                      className="group cursor-pointer relative aspect-[16/9] w-full rounded-none overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 border border-gray-200"
                      onClick={() => router.push(`/galeri/${item.id}`)}
                    >
                      <img
                        src={item.image}
                        alt={`Thumbnail ${item.title}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col justify-end translate-y-1 group-hover:translate-y-0 transition-transform duration-500">
                        <h5 className="font-bold text-white text-sm leading-snug drop-shadow-md line-clamp-3">
                          {item.title}
                        </h5>
                      </div>
                    </div>
                  ))}
                  
                  {relatedArticles.length === 0 && (
                    <p className="text-sm text-gray-400">Belum ada artikel terkait.</p>
                  )}
                </div>
              </div>
            </aside>

          </div>
        </div>
      </main>
      <Footer />
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}
