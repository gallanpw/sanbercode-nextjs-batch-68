import { NextResponse } from 'next/server';
import { db } from '@/db'; // Mengimpor instance database Drizzle Anda
import { users } from '@/db/schema'; // Mengimpor skema tabel users
import bcrypt from 'bcrypt'; // Untuk hashing password
// import { generateNanoId } from '@/lib/utils/generateId'; // Tidak perlu diimpor jika menggunakan $defaultFn di skema

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Validasi input dasar
    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Nama, email, dan kata sandi harus diisi.' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ message: 'Kata sandi minimal 6 karakter.' }, { status: 400 });
    }

    // Periksa apakah email sudah terdaftar
    const existingUser = await db.query.users.findFirst({
      where: (user, { eq }) => eq(user.email, email),
    });

    if (existingUser) {
      return NextResponse.json({ message: 'Email sudah terdaftar.' }, { status: 409 });
    }

    // Hash kata sandi
    const hashedPassword = await bcrypt.hash(password, 10); // 10 adalah salt rounds

    // Masukkan user baru ke database dengan role 'admin'
    const newUser = await db.insert(users).values({
      name,
      email,
      passwordHash: hashedPassword,
      role: 'admin', // Secara eksplisit set role menjadi 'admin'
      // ID akan dihasilkan otomatis oleh $defaultFn di skema (Nano ID)
    }).returning(); // Mengembalikan data user yang baru dibuat

    return NextResponse.json({ message: 'User admin berhasil dibuat!', user: newUser[0] }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating admin user:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan server internal.', error: error.message }, { status: 500 });
  }
}