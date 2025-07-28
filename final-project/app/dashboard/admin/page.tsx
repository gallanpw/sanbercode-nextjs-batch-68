import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
// LogoutButton sudah dihandle di layout atau sidebar, tidak perlu diimpor di sini.

export default async function AdminDashboardPage() {
  const session = await auth();

  // Proteksi rute: Hanya admin yang bisa mengakses
  // Proteksi utama sudah dihandle di app/dashboard/layout.tsx
  if (!session?.user || session.user.role !== 'admin') {
    redirect('/login'); // Fallback redirect jika entah bagaimana lolos layout
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Card className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden text-center">
        <CardHeader className="p-6 bg-blue-600 dark:bg-indigo-700 text-white">
          <CardTitle className="text-3xl font-extrabold">Dashboard Admin</CardTitle>
          <p className="text-blue-100 dark:text-indigo-200">Selamat datang, {session.user.name}!</p>
        </CardHeader>
        <CardContent className="p-8 text-gray-700 dark:text-gray-200">
          <p className="mb-6 text-lg">Anda memiliki akses penuh ke fitur administrasi.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tautan yang relevan untuk admin */}
            <Link href="/dashboard/student/add-student" passHref>
              <Button className="w-full py-3 text-lg bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition duration-300">
                Tambah Siswa
              </Button>
            </Link>
            <Link href="/dashboard/teacher/add-teacher" passHref> {/* Asumsi akan ada halaman ini nanti */}
              <Button className="w-full py-3 text-lg bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg shadow-md transition duration-300">
                Tambah Guru
              </Button>
            </Link>
            <Link href="/dashboard/classes" passHref>
              <Button className="w-full py-3 text-lg bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg shadow-md transition duration-300">
                Kelola Kelas
              </Button>
            </Link>
            <Link href="/dashboard/users" passHref> {/* Asumsi akan ada halaman ini nanti */}
              <Button className="w-full py-3 text-lg bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg shadow-md transition duration-300">
                Kelola Pengguna
              </Button>
            </Link>
            {/* ... tombol admin lainnya */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}