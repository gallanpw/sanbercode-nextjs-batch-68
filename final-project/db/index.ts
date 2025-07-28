import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema'; // Mengimpor semua skema yang telah Anda definisikan
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' }); // Memuat variabel lingkungan

// Pastikan DATABASE_URL telah diatur di file .env.local Anda
const sql = neon(process.env.DATABASE_URL!);

// Inisialisasi Drizzle ORM dengan skema dan koneksi Neon
export const db = drizzle(sql, { schema });

// Contoh penggunaan (opsional, untuk pengujian cepat)
// async function testConnection() {
//   try {
//     const users = await db.query.users.findMany();
//     console.log('Koneksi database berhasil! Pengguna:', users);
//   } catch (error) {
//     console.error('Gagal terhubung ke database:', error);
//   }
// }
// testConnection();