import { NextResponse } from 'next/server';
import { db } from '@/db';
import { students, attendances, attendanceStatusEnum, classes } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentIdNumber } = body;

    if (!studentIdNumber) {
      return NextResponse.json({ message: 'NISN tidak boleh kosong.' }, { status: 400 });
    }

    // 1. Cari siswa berdasarkan NISN
    const student = await db.query.students.findFirst({
      where: eq(students.studentIdNumber, studentIdNumber),
    });

    if (!student) {
      return NextResponse.json({ message: 'NISN tidak ditemukan. Mohon periksa kembali.' }, { status: 404 });
    }

    // Normalisasi tanggal ke awal hari (tanpa waktu)
    const checkinDate = new Date();
    checkinDate.setHours(0, 0, 0, 0);
    const checkinDateString = checkinDate.toISOString().split('T')[0]; // Format YYYY-MM-DD

    // 2. Periksa apakah siswa sudah check-in hari ini
    const existingAttendance = await db.query.attendances.findFirst({
      where: and(
        eq(attendances.studentId, student.id),
        // Bandingkan hanya bagian tanggal di database
        eq(sql`CAST(${attendances.date} AS DATE)`, checkinDateString)
      ),
    });

    if (existingAttendance) {
      return NextResponse.json({ message: 'Anda sudah check-in hari ini.' }, { status: 409 });
    }

    // 3. Tentukan classId yang relevan
    let classIdToRecord: string | null = null;

    // Coba cari kelas yang sesuai dengan grade siswa
    const relevantClass = await db.query.classes.findFirst({
      where: eq(classes.name, student.grade),
    });

    if (relevantClass) {
      classIdToRecord = relevantClass.id;
    } else {
      // Jika tidak ditemukan, coba cari atau buat kelas 'Umum / Gerbang'
      let defaultClass = await db.query.classes.findFirst({
        where: eq(classes.classCode, 'GENERAL_ATTENDANCE'), // Lebih baik pakai classCode
      });

      if (!defaultClass) {
        // Jika kelas umum belum ada, buat
        const newDefaultClass = await db.insert(classes).values({
          name: 'Umum / Gerbang',
          description: 'Kelas default untuk absensi gerbang atau umum.',
          classCode: 'GENERAL_ATTENDANCE',
          teacherId: null,
        }).returning({ id: classes.id });
        classIdToRecord = newDefaultClass[0].id;
      } else {
        classIdToRecord = defaultClass.id;
      }
    }

    // Pastikan classIdToRecord tidak null sebelum menyimpan
    if (!classIdToRecord) {
        return NextResponse.json({ message: 'Gagal menentukan kelas untuk absensi.' }, { status: 500 });
    }

    // 4. Catat absensi
    const newAttendance = await db.insert(attendances).values({
      studentId: student.id,
      classId: classIdToRecord, // Gunakan classId yang ditentukan
      date: checkinDate, // Simpan objek Date yang sudah dinormalisasi
      status: 'present',
      recordedByUserId: null, // Atau ID pengguna 'system' jika Anda membuatnya
      notes: 'Self check-in via kiosk',
    }).returning();

    return NextResponse.json({ message: `Check-in berhasil untuk ${student.studentIdNumber}. Selamat datang!`, attendance: newAttendance[0] }, { status: 200 });

  } catch (error: any) {
    console.error('Error in student check-in API:', error);
    return NextResponse.json({ message: 'Terjadi kesalahan server internal.', error: error.message }, { status: 500 });
  }
}