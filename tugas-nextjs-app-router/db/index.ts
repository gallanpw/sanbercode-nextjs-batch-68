import { drizzle } from 'drizzle-orm/neon-http'; // Adjusted import based on the correct export
import { neon } from '@neondatabase/serverless';
import * as schema from './schema'; // Import skema yang telah kita buat

// Pastikan DATABASE_URL tersedia di environment variables
const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema });