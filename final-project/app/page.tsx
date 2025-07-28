import Image from "next/image";
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Menggunakan komponen Button dari Shadcn UI
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'; // Menggunakan komponen Card dari Shadcn UI

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden animate-fade-in-custom">
        <CardHeader className="text-center p-6 bg-blue-600 dark:bg-indigo-700 text-white">
          <CardTitle className="text-4xl font-extrabold mb-2">
            Selamat Datang di Aplikasi Absensi
          </CardTitle>
          <CardDescription className="text-blue-100 dark:text-indigo-200 text-lg">
            Sistem Absensi Siswa dan Guru Terpadu
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-8 leading-relaxed">
            Aplikasi ini dirancang untuk memudahkan pencatatan dan pengelolaan absensi siswa dan guru secara efisien.
            Silakan login untuk mengakses dashboard Anda.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Link href="/login" passHref>
              <Button className="w-full py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                <span className="mr-2">🔑</span> Login
              </Button>
            </Link>
            <Link href="/attendance/student-checkin" passHref>
              <Button className="w-full py-3 text-lg bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                <span className="mr-2">📝</span> Absensi Siswa (NISN)
              </Button>
            </Link>
            <Link href="/attendance/teacher-checkin" passHref> {/* Tautan baru untuk check-in guru */}
              <Button className="w-full py-3 text-lg bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                <span className="mr-2">👨‍🏫</span> Absensi Guru (NUPTK)
              </Button>
            </Link>
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Jika Anda memiliki akun, silakan login. Untuk absensi mandiri siswa/guru, gunakan tombol di atas.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

{/* <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden animate-fade-in-custom">
        <CardHeader className="text-center p-6 bg-blue-600 dark:bg-indigo-700 text-white">
          <CardTitle className="text-4xl font-extrabold mb-2">
            Selamat Datang di Aplikasi Absensi
          </CardTitle>
          <CardDescription className="text-blue-100 dark:text-indigo-200 text-lg">
            Sistem Absensi Siswa dan Guru Terpadu
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 text-center">
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-8 leading-relaxed">
            Aplikasi ini dirancang untuk memudahkan pencatatan dan pengelolaan absensi siswa dan guru secara efisien.
            Silakan login untuk mengakses dashboard Anda.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Link href="/attendance/student-checkin" passHref>
              <Button className="w-full py-3 text-lg bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                <span className="mr-2">📝</span> Absensi Siswa (NISN)
              </Button>
            </Link>
            <Link href="/attendance/teacher-checkin" passHref>
              <Button className="w-full py-3 text-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                <span className="mr-2">📝</span> Absensi Guru (NUPTK)
              </Button>
            </Link>
          </div>

          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Untuk absensi mandiri siswa dan guru, gunakan tombol di atas. Jika Anda memiliki akun, silakan login dengan menambahkan /login pada URL.
          </p>
        </CardContent>
      </Card>
    </div> */}