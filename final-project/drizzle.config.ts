import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' }); // Memuat variabel lingkungan dari .env.local

export default {
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
 },
  verbose: true, // Menampilkan output detail saat menjalankan perintah Drizzle Kit
  strict: true, // Mengaktifkan mode ketat
} satisfies Config;