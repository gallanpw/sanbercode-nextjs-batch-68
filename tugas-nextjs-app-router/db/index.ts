import { drizzle } from 'drizzle-orm/pg-core';
import { Pool } from 'pg'; // Menggunakan driver 'pg'
import * as schema from './schema'; // Import skema yang telah kita buat

// Pastikan DATABASE_URL tersedia di environment variables
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

// Buat pool koneksi baru untuk PostgreSQL
const pool = new Pool({
  connectionString: dbUrl,
});

// Inisialisasi Drizzle ORM dengan pool dan skema
export const db = drizzle(pool, { schema });