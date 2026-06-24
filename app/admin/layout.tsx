import Sidebar from "@/components/admin/Sidebar";
import "./../globals.css";

export const metadata = {
  title: "Admin Panel - Melon Honey",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row pb-20 md:pb-0">
          {/* Navigation */}
          <Sidebar />

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
