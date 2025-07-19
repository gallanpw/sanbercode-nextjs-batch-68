import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs'; // Import bcryptjs
import { db } from '@/db'; // Pastikan path ini benar ke file db/index.ts Anda
import { users } from '@/db/schema'; // Import skema users Anda

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // Periksa apakah email sudah terdaftar
    const existingUser = await db.query.users.findFirst({
      where: (user, { eq }) => eq(user.email, email),
    });

    if (existingUser) {
      return NextResponse.json({ message: 'Email already registered' }, { status: 409 });
    }

    // Hash password sebelum menyimpannya
    const hashedPassword = await bcrypt.hash(password, 10); // 10 adalah salt rounds

    // Masukkan pengguna baru ke database
    const newUser = await db.insert(users).values({
      email: email,
      password: hashedPassword,
      // role akan default ke 'user' seperti yang didefinisikan di skema
    }).returning(); // Gunakan .returning() untuk mendapatkan kembali data pengguna yang baru dibuat

    // Anda bisa mengembalikan data pengguna tanpa password yang di-hash
    const { password: _, ...userWithoutPassword } = newUser[0];

    return NextResponse.json({ message: 'User registered successfully', user: userWithoutPassword }, { status: 201 });

  } catch (error) {
    console.error('Error during signup:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ message: 'Something went wrong', error: errorMessage }, { status: 500 });
  }
}