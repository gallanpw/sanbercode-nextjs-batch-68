import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { auth } from '@/lib/auth'; // Import fungsi auth dari helper
import { AuthProvider } from '@/components/auth-provider'; // Import AuthProvider yang baru

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Aplikasi Absensi',
  description: 'Sistem Absensi Siswa dan Guru',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Ambil sesi di server untuk diteruskan ke AuthProvider
  const session = await auth();

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Gunakan AuthProvider yang baru */}
        <AuthProvider session={session}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}