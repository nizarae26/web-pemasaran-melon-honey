"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // Clear cookie just in case it was set manually
        document.cookie = "admin_session=; path=/; max-age=0; SameSite=Strict";
        router.push("/login");
      } else {
        // Ensure cookie is set in case it expired but session is still valid
        document.cookie = "admin_session=true; path=/; max-age=86400; SameSite=Strict";
        setLoading(false);
      }
    }

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        document.cookie = "admin_session=; path=/; max-age=0; SameSite=Strict";
        router.push("/login");
      } else if (session) {
        document.cookie = "admin_session=true; path=/; max-age=86400; SameSite=Strict";
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center gap-4 max-w-xs w-full text-center">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="text-sm font-bold text-gray-800">Memverifikasi Sesi...</p>
          <p className="text-xs text-gray-400 font-medium">Tunggu sebentar, kami sedang memeriksa keamanan.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
