import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { generateShortNanoId } from '@/lib/utils/generateId'; // Impor fungsi generate ID
import bcrypt from 'bcrypt'; // Untuk hashing password

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Hashing password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Menghasilkan Nano ID secara otomatis oleh Drizzle karena kita menggunakan $defaultFn
    const newUser = await db.insert(users).values({
      name,
      email,
      passwordHash: hashedPassword,
      role,
      // ID akan dihasilkan oleh $defaultFn di skema
    }).returning(); // Mengembalikan data user yang baru dibuat

    return NextResponse.json({ message: 'User created successfully', user: newUser[0] }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating user:', error);
    // Tangani error duplikasi email atau error lainnya
    if (error.message.includes('duplicate key value violates unique constraint "email_idx"')) {
      return NextResponse.json({ message: 'Email already exists' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}