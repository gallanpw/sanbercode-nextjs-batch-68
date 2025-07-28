import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config'; // Import konfigurasi dari file terpisah

// Fungsi untuk mendapatkan sesi pengguna di Server Components
export async function auth() {
  return getServerSession(authOptions);
}
