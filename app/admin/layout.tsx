import Sidebar from "@/components/admin/Sidebar";
import { Toaster } from "react-hot-toast";
import AuthGuard from "@/components/admin/AuthGuard";
import "./../globals.css";

export const metadata = {
  title: "Admin Panel - Melon Honey",
  icons: [
    {
      rel: 'icon',
      media: '(prefers-color-scheme: light)',
      type: 'image/png',
      url: '/images/logoutama_removebg.png',
    },
    {
      rel: 'icon',
      media: '(prefers-color-scheme: dark)',
      type: 'image/png',
      url: '/images/logo-putih.png',
    },
  ],
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Toaster position="top-center" reverseOrder={false} />
        <AuthGuard>
          <div className="min-h-screen bg-[#f8fafc] flex flex-col md:flex-row pb-20 md:pb-0 font-sans">
            {/* Navigation Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-x-hidden min-h-screen">
              {/* Top Header Bar */}
              <header className="hidden md:flex h-16 bg-white border-b border-gray-100 items-center justify-between px-8 sticky top-0 z-30 shrink-0">
                {/* Search Bar */}
                <div className="relative w-80">
                  <input
                    type="text"
                    placeholder="Cari data atau halaman..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-full text-[11px] font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition-all text-gray-700 placeholder-gray-400"
                  />
                  <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Profile Actions */}
                <div className="flex items-center gap-4">
                  {/* Notifications */}
                  <button className="p-2 text-gray-400 hover:text-[#10b981] hover:bg-emerald-50 rounded-xl transition-all cursor-pointer relative">
                    <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </button>

                  {/* Info */}
                  <button className="p-2 text-gray-400 hover:text-[#10b981] hover:bg-emerald-50 rounded-xl transition-all cursor-pointer">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>

                  {/* Divider line */}
                  <div className="h-6 w-[1px] bg-gray-100"></div>

                  {/* User Profile Card */}
                  <div className="flex items-center gap-3 bg-gray-50/50 hover:bg-gray-50 p-1.5 pr-3 rounded-full transition-all border border-gray-100 cursor-pointer">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-extrabold text-xs">
                      A
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-black text-gray-800 leading-tight">Selamat Datang, Admin</p>
                      <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wider leading-none">Administrator</p>
                    </div>
                  </div>
                </div>
              </header>

              {/* Dynamic Pages Area with padding */}
              <div className="flex-1 p-4 md:p-8 overflow-y-auto">
                {children}
              </div>
            </main>
          </div>
        </AuthGuard>
      </body>
    </html>
  );
}
