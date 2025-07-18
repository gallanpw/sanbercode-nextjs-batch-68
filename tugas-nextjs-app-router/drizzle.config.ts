import type { Config } from 'drizzle-kit';

export default {
  schema: './db/schema.ts', // Lokasi file skema Anda
  out: './drizzle',       // Folder tempat migrasi akan dihasilkan
  driver: 'pg',           // Tipe database driver
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!, // Menggunakan DATABASE_URL dari .env.local
  },
} satisfies Config;