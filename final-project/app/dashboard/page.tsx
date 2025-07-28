import { auth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function MainDashboardPage() {
  const session = await auth();

  // Redirect sudah ditangani di app/dashboard/layout.tsx,
  // jadi di sini kita asumsikan user sudah login.

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Card className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden text-center">
        <CardHeader className="p-6 bg-blue-600 dark:bg-indigo-700 text-white">
          <CardTitle className="text-3xl font-extrabold">Selamat Datang di Dashboard!</CardTitle>
        </CardHeader>
        <CardContent className="p-8 text-gray-700 dark:text-gray-200">
          <p className="mb-4 text-lg">
            Halo, <span className="font-semibold">{session?.user?.name || 'Pengguna'}</span>!
          </p>
          <p className="mb-6 text-md">
            Anda berhasil login sebagai <span className="font-semibold capitalize">{session?.user?.role || 'Tidak Diketahui'}</span>.
          </p>
          <p className="text-sm">
            Gunakan sidebar di sebelah kiri untuk navigasi.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}