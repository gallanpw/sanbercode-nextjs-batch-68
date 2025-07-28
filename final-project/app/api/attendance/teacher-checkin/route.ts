import { NextResponse } from 'next/server';
import { db } from '@/db';
import { teachers, teacherAttendances, attendanceStatusEnum } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { teacherIdNumber } = body; // <<< PERBAIKAN DI SINI (hapus satu '}')

    if (!teacherIdNumber) {
      return NextResponse.json({ message: 'NUPTK tidak boleh kosong.' }, { status: 400 });
    }

    // 1. Cari guru berdasarkan NUPTK
    const teacher = await db.query.teachers.findFirst({
      where: eq(teachers.teacherIdNumber, teacherIdNumber),
    });

    if (!teacher) {
      return NextResponse.json({ message: 'NUPTK tidak ditemukan. Mohon periksa kembali.' }, { status: 404 });
    }

    // Normalisasi tanggal ke awal hari (tanpa waktu)
    const checkinDate = new Date();
    checkinDate.setHours(0, 0, 0, 0);
    const checkinDateString = checkinDate.toISOString().split('T')[0];

    // 2. Periksa apakah guru sudah check-in hari ini
    const existingAttendance = await db.query.teacherAttendances.findFirst({
      where: and(
        eq(teacherAttendances.teacherId, teacher.id),
        eq(sql`CAST(${teacherAttendances.date} AS DATE)`, checkinDateString)
      ),
    });

    if (existingAttendance) {
      return NextResponse.json({ message: 'Anda sudah check-in hari ini.' }, { status: 409 });
    }

    // 3. Catat absensi guru
    const newAttendance = await db.insert(teacherAttendances).values({
      teacherId: teacher.id,
      date: checkinDate,
      status: 'present',
      recordedByUserId: null,
      notes: 'Self check-in via kiosk',
    }).returning();

    return NextResponse.json({ message: `Check-in berhasil untuk ${teacher.teacherIdNumber}. Selamat datang!`, attendance: newAttendance[0] }, { status: 200 });

  } catch (error: any) {
    console.error('Error in teacher check-in API:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan server internal.', error: error.message }, { status: 500 });
  }
}