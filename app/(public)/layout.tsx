import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://melon-honey.vercel.app"),
  title: "Banyu Urip | Melon Honey Globe Premium",
  description: "Website resmi Kelompok Tani Banyu Urip Tanggumong - Menyediakan varietas unggulan Melon Honey Globe premium dan edukasi smart farming.",
  keywords: ["melon honey globe", "melon premium", "pertanian", "kelompok tani", "banyu urip", "tanggumong", "sampang", "madura", "smart farming", "buah melon"],
  openGraph: {
    title: "Banyu Urip | Melon Honey Globe Premium",
    description: "Website resmi Kelompok Tani Banyu Urip Tanggumong - Menyediakan varietas unggulan Melon Honey Globe premium.",
    url: "https://melon-honey.vercel.app",
    siteName: "Poktan Banyu Urip",
    images: [
      {
        url: "/images/logoutama_removebg.png",
        width: 800,
        height: 600,
        alt: "Logo Banyu Urip",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
