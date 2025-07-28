import { NextResponse } from 'next/server';
import { db } from '@/db'; // Import instance database Drizzle Anda
import { users, students } from '@/db/schema'; // Import skema tabel users dan students
import bcrypt from 'bcrypt'; // Untuk hashing password
import { auth } from '@/lib/auth'; // Import helper auth untuk mendapatkan sesi
import { eq } from 'drizzle-orm'; // Import eq untuk operasi delete

export async function POST(request: Request) {
  let newUserId: string | null = null; // Variabel untuk menyimpan ID user yang baru dibuat

  try {
    // Pastikan user adalah admin
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ message: 'Akses ditolak. Hanya admin yang bisa menambah siswa.' }, { status: 403 });
    }

    const body = await request.json();
    const {
      name,
      email,
      password,
      studentIdNumber,
      grade,
      dateOfBirth, // String ISO date (misal: "YYYY-MM-DD")
      address,
      phoneNumber,
    } = body;

    // Validasi input dasar
    if (!name || !email || !password || !studentIdNumber || !grade) {
      return NextResponse.json({ message: 'Nama, email, kata sandi, NISN, dan kelas harus diisi.' }, { status: 400 });
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

    // Periksa apakah NISN sudah terdaftar
    const existingStudent = await db.query.students.findFirst({
      where: (student, { eq }) => eq(student.studentIdNumber, studentIdNumber),
    });
    if (existingStudent) {
      return NextResponse.json({ message: 'NISN sudah terdaftar.' }, { status: 409 });
    }

    // Hash kata sandi
    const hashedPassword = await bcrypt.hash(password, 10);

    // 1. Buat user baru dengan role 'student'
    const newUserResult = await db.insert(users).values({
      name,
      email,
      passwordHash: hashedPassword,
      role: 'student', // Set role menjadi 'student'
    }).returning({ id: users.id }); // Hanya kembalikan ID user yang baru dibuat

    newUserId = newUserResult[0].id; // Simpan ID user yang baru dibuat

    // 2. Buat data siswa baru, tautkan dengan userId yang baru dibuat
    const newStudentResult = await db.insert(students).values({
      userId: newUserId,
      studentIdNumber,
      grade,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null, // Konversi string ke Date object jika ada
      address,
      phoneNumber,
    }).returning();

    return NextResponse.json({ message: 'Siswa berhasil ditambahkan!', data: { user: newUserResult[0], student: newStudentResult[0] } }, { status: 201 });

  } catch (error: any) {
    console.error('Error adding student:', error);

    // Jika terjadi error setelah user dibuat, hapus user yang baru dibuat
    if (newUserId) {
      console.log(`Attempting to rollback: deleting user with ID ${newUserId}`);
      try {
        await db.delete(users).where(eq(users.id, newUserId));
        console.log(`User ${newUserId} successfully deleted as part of rollback.`);
      } catch (rollbackError: any) {
        console.error('Error during rollback (deleting user):', rollbackError);
        // Log the rollback error but still return the original error message
      }
    }

    // Tangani error duplikasi email atau NISN secara spesifik jika belum tertangkap di atas
    if (error.message && error.message.includes('duplicate key value violates unique constraint')) {
        if (error.message.includes('email_idx')) {
            return NextResponse.json({ message: 'Email sudah terdaftar.' }, { status: 409 });
        }
        if (error.message.includes('student_id_number_idx')) {
            return NextResponse.json({ message: 'NISN sudah terdaftar.' }, { status: 409 });
        }
    }

    return NextResponse.json({ message: 'Terjadi kesalahan server internal.', error: error.message }, { status: 500 });
  }
}