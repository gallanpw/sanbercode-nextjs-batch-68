import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, teachers } from '@/db/schema';
import bcrypt from 'bcrypt';
import { auth } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  let newUserId: string | null = null; // Variabel untuk menyimpan ID user yang baru dibuat

  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Akses ditolak. Hanya admin yang bisa menambah guru.' }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      email,
      password,
      teacherIdNumber,
      subjectTaught,
      phoneNumber,
    } = body;

    // Validasi input dasar
    if (!name || !email || !password || !teacherIdNumber || !subjectTaught) {
      return NextResponse.json({ message: 'Nama, email, kata sandi, NIP, dan mata pelajaran harus diisi.' }, { status: 400 });
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

    // Periksa apakah NIP sudah terdaftar
    const existingTeacher = await db.query.teachers.findFirst({
      where: (teacher, { eq }) => eq(teacher.teacherIdNumber, teacherIdNumber),
    });
    if (existingTeacher) {
      return NextResponse.json({ message: 'NIP sudah terdaftar.' }, { status: 409 });
    }

    // Hash kata sandi
    const hashedPassword = await bcrypt.hash(password, 10);

    // 1. Buat user baru dengan role 'teacher'
    const newUserResult = await db.insert(users).values({
      name,
      email,
      passwordHash: hashedPassword,
      role: 'teacher', // Set role menjadi 'teacher'
    }).returning({ id: users.id });

    newUserId = newUserResult[0].id;

    // 2. Buat data guru baru, tautkan dengan userId yang baru dibuat
    const newTeacherResult = await db.insert(teachers).values({
      userId: newUserId,
      teacherIdNumber,
      subjectTaught,
      phoneNumber,
    }).returning();

    return NextResponse.json({ message: 'Guru berhasil ditambahkan!', data: { user: newUserResult[0], teacher: newTeacherResult[0] } }, { status: 201 });

  } catch (error: any) {
    console.error('Error adding teacher:', error);

    // Rollback manual jika user dibuat tapi teacher gagal
    if (newUserId) {
      console.log(`Attempting to rollback: deleting user with ID ${newUserId}`);
      try {
        await db.delete(users).where(eq(users.id, newUserId));
        console.log(`User ${newUserId} successfully deleted as part of rollback.`);
      } catch (rollbackError: any) {
        console.error('Error during rollback (deleting user):', rollbackError);
      }
    }

    if (error.message && error.message.includes('duplicate key value violates unique constraint')) {
        if (error.message.includes('email_idx')) {
            return NextResponse.json({ message: 'Email sudah terdaftar.' }, { status: 409 });
        }
        if (error.message.includes('teacher_id_number_idx')) {
            return NextResponse.json({ message: 'NIP sudah terdaftar.' }, { status: 409 });
        }
    }

    return NextResponse.json({ message: 'Terjadi kesalahan server internal.', error: error.message }, { status: 500 });
  }
}