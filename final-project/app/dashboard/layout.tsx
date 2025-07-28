import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth'; // Import helper auth
import { Sidebar } from '@/components/sidebar'; // Import komponen Sidebar

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Proteksi rute: Jika tidak ada sesi, arahkan ke halaman login
  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar akan selalu ada di sini */}
      <Sidebar />
      {/* Konten utama dashboard */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}