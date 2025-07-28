"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react'; // Untuk mendapatkan sesi dan role
import { LogoutButton } from './logout-button'; // Import LogoutButton

// Definisikan item menu untuk setiap role
const navItems = {
  admin: [
    { name: 'Dashboard Admin', href: '/dashboard/admin' },
    { name: 'Management Siswa', href: '/dashboard/student' },
    // { name: 'Tambah Siswa', href: '/dashboard/student/add-student' },
    { name: 'Management Guru', href: '/dashboard/teacher' },
    { name: 'Management Kelas', href: '/dashboard/classes' },
    { name: 'Status Absensi', href: '/dashboard/attendance-status' },
    // Tambahkan lebih banyak link admin di sini
  ],
  student: [
    { name: 'Dashboard Siswa', href: '/dashboard/student' }, // Atau ganti ke /dashboard/student/overview
    { name: 'Absensi Saya', href: '/dashboard/student/my-attendance' },
    { name: 'Jadwal Saya', href: '/dashboard/student/my-schedule' },
    { name: 'Status Absensi', href: '/dashboard/attendance-status' },
  ],
  teacher: [
    { name: 'Dashboard Guru', href: '/dashboard/teacher' },
    { name: 'Catat Absensi Kelas', href: '/dashboard/teacher/record-attendance' },
    { name: 'Kelas Saya', href: '/dashboard/teacher/my-classes' },
    { name: 'Catat Ketidakhadiran', href: '/dashboard/teacher/absences' },
    { name: 'Status Absensi', href: '/dashboard/attendance-status' },
  ],
};

export function Sidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <aside className="w-64 bg-gray-800 dark:bg-gray-900 text-white p-4 flex flex-col justify-between h-full shadow-lg">
        <div className="text-center text-lg font-semibold">Memuat Navigasi...</div>
      </aside>
    );
  }

  // Jika tidak ada sesi atau role tidak dikenali, tampilkan sidebar minimal atau kosong
  if (!session || !session.user || !session.user.role || !navItems[session.user.role as keyof typeof navItems]) {
    return (
      <aside className="w-64 bg-gray-800 dark:bg-gray-900 text-white p-4 flex flex-col justify-between h-screen shadow-lg">
        <div className="text-center text-lg font-semibold mb-4">Aplikasi Absensi</div>
        <nav className="flex-grow">
          <p className="text-gray-400 text-sm">Silakan login untuk melihat menu.</p>
        </nav>
        <div className="mt-auto">
          <LogoutButton />
        </div>
      </aside>
    );
  }

  const userRole = session.user.role as keyof typeof navItems;
  const currentNavItems = navItems[userRole];

  return (
    <aside className="w-64 bg-gray-800 dark:bg-gray-900 text-white p-4 flex flex-col justify-between h-screen shadow-lg">
      <div className="flex flex-col flex-grow">
        <div className="text-center mb-6">
            <Link href="/">
              <span className="text-2xl font-bold mb-6 text-blue-300">Absensi App</span>
            </Link>
        </div>
        <p className="text-sm text-gray-400 mb-4 text-center">
          Selamat datang, <span className="font-semibold text-blue-200">{session.user.name}</span>!
          <br />
          Role: <span className="font-semibold text-blue-200 capitalize">{session.user.role}</span>
        </p>
        <nav className="space-y-2 flex-grow">
          {currentNavItems.map((item) => (
            <Link key={item.href} href={item.href} passHref>
              <div
                className={`flex items-center p-3 rounded-lg transition-colors duration-200
                  ${pathname === item.href
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
              >
                {item.name}
              </div>
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto pt-4 border-t border-gray-700">
        <LogoutButton />
      </div>
    </aside>
  );
}