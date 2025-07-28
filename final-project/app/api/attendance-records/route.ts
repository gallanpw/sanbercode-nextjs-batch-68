import { NextResponse } from 'next/server';
import { db } from '@/db';
import { attendances, students, users, classes, teachers, teacherAbsences, teacherAttendances } from '@/db/schema';
import { eq, and, sql, or, isNotNull, isNull, between, inArray } from 'drizzle-orm';
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: 'Tidak terautentikasi.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');
    const studentIdParam = searchParams.get('studentId');
    const classIdParam = searchParams.get('classId');
    const teacherIdParam = searchParams.get('teacherId');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayString = today.toISOString().split('T')[0];

    // --- Ambil Absensi Siswa ---
    const studentAttendanceConditions = [];
    // FIXED: Pastikan string tanggal dikelilingi kutip tunggal di SQL
    studentAttendanceConditions.push(eq(sql`CAST(${attendances.date} AS DATE)`, sql`${dateParam || todayString}`));

    if (studentIdParam) {
      studentAttendanceConditions.push(eq(attendances.studentId, studentIdParam));
    }
    if (classIdParam) {
      studentAttendanceConditions.push(eq(attendances.classId, classIdParam));
    }

    const rawStudentAttendances = await db.query.attendances.findMany({
      where: and(...studentAttendanceConditions),
    });

    const studentIds = rawStudentAttendances.map(att => att.studentId);
    const classIds = rawStudentAttendances.map(att => att.classId).filter((id): id is string => id !== null);
    const recordedByUserIds = rawStudentAttendances.map(att => att.recordedByUserId).filter((id): id is string => id !== null);

    const [
      allStudents,
      allUsersForStudentAttendance,
      allClasses,
    ] = await Promise.all([
      studentIds.length > 0 ? db.query.students.findMany({ where: inArray(students.id, studentIds), with: { user: true } }) : [],
      recordedByUserIds.length > 0 ? db.query.users.findMany({ where: inArray(users.id, recordedByUserIds) }) : [],
      classIds.length > 0 ? db.query.classes.findMany({ where: inArray(classes.id, classIds) }) : [],
    ]);

    const studentMap = new Map(allStudents.map(s => [s.id, s]));
    const userMapForStudentAttendance = new Map(allUsersForStudentAttendance.map(u => [u.id, u]));
    const classMap = new Map(allClasses.map(c => [c.id, c]));

    const studentAttendances = rawStudentAttendances.map(att => ({
      ...att,
      student: studentMap.get(att.studentId),
      class: classMap.get(att.classId),
      recordedByUser: att.recordedByUserId ? userMapForStudentAttendance.get(att.recordedByUserId) : null,
    }));


    // --- Ambil Absensi Guru (TeacherAttendances) ---
    const teacherAttendanceConditions = [];
    // FIXED: Pastikan string tanggal dikelilingi kutip tunggal di SQL
    teacherAttendanceConditions.push(eq(sql`CAST(${teacherAttendances.date} AS DATE)`, sql`${dateParam || todayString}`));

    if (teacherIdParam) {
        teacherAttendanceConditions.push(eq(teacherAttendances.teacherId, teacherIdParam));
    }

    const rawTeacherAttendances = await db.query.teacherAttendances.findMany({
        where: and(...teacherAttendanceConditions),
    });

    const teacherIdsForAttendance = rawTeacherAttendances.map(att => att.teacherId);
    const recordedByUserIdsForTeacherAttendance = rawTeacherAttendances.map(att => att.recordedByUserId).filter((id): id is string => id !== null);

    const [
        allTeachersForAttendance,
        allUsersForTeacherAttendanceRecords
    ] = await Promise.all([
        teacherIdsForAttendance.length > 0 ? db.query.teachers.findMany({ where: inArray(teachers.id, teacherIdsForAttendance), with: { user: true } }) : [],
        recordedByUserIdsForTeacherAttendance.length > 0 ? db.query.users.findMany({ where: inArray(users.id, recordedByUserIdsForTeacherAttendance) }) : [],
    ]);

    const teacherMapForAttendance = new Map(allTeachersForAttendance.map(t => [t.id, t]));
    const userMapForTeacherAttendanceRecords = new Map(allUsersForTeacherAttendanceRecords.map(u => [u.id, u]));

    const teacherAttendancesData = rawTeacherAttendances.map(att => ({
        ...att,
        teacher: teacherMapForAttendance.get(att.teacherId),
        recordedByUser: att.recordedByUserId ? userMapForTeacherAttendanceRecords.get(att.recordedByUserId) : null,
    }));


    // --- Ambil Ketidakhadiran Guru (TeacherAbsences) ---
    const teacherAbsenceConditions = [];
    // FIXED: Pastikan string tanggal dikelilingi kutip tunggal di SQL untuk BETWEEN
    const targetDateSql = sql`CAST(${sql.raw(`'${dateParam || todayString}'`)} AS DATE)`; // Tambahkan kutip tunggal di sini
    teacherAbsenceConditions.push(
        and(
            sql`${targetDateSql} BETWEEN CAST(${teacherAbsences.startDate} AS DATE) AND CAST(${teacherAbsences.endDate} AS DATE)`
        )
    );

    if (teacherIdParam) {
        teacherAbsenceConditions.push(eq(teacherAbsences.teacherId, teacherIdParam));
    }

    const rawTeacherAbsenceRecords = await db.query.teacherAbsences.findMany({
        where: and(...teacherAbsenceConditions),
    });

    const absentTeacherIds = rawTeacherAbsenceRecords.map(abs => abs.teacherId);
    const replacementTeacherIds = rawTeacherAbsenceRecords.map(abs => abs.replacementTeacherId).filter((id): id is string => id !== null);
    const allTeacherIds = [...new Set([...absentTeacherIds, ...replacementTeacherIds])];

    const recordedTeacherAbsenceByUserIds = rawTeacherAbsenceRecords.map(abs => abs.recordedByUserId).filter((id): id is string => id !== null);

    const [
      allTeachersForAbsence,
      allUsersForTeacherAbsence
    ] = await Promise.all([
      allTeacherIds.length > 0 ? db.query.teachers.findMany({ where: inArray(teachers.id, allTeacherIds), with: { user: true } }) : [],
      recordedTeacherAbsenceByUserIds.length > 0 ? db.query.users.findMany({ where: inArray(users.id, recordedTeacherAbsenceByUserIds) }) : [],
    ]);

    const teacherMapForAbsence = new Map(allTeachersForAbsence.map(t => [t.id, t]));
    const userMapForTeacherAbsence = new Map(allUsersForTeacherAbsence.map(u => [u.id, u]));


    const teacherAbsenceRecords = rawTeacherAbsenceRecords.map(abs => ({
        ...abs,
        absentTeacher: teacherMapForAbsence.get(abs.teacherId),
        replacementTeacher: abs.replacementTeacherId ? teacherMapForAbsence.get(abs.replacementTeacherId) : null,
        recordedByUser: abs.recordedByUserId ? userMapForTeacherAbsence.get(abs.recordedByUserId) : null,
    }));


    return NextResponse.json({ studentAttendances, teacherAttendances: teacherAttendancesData, teacherAbsenceRecords }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching attendance records:', error);
    if (error.cause && error.cause.message) {
        console.error('Drizzle error cause:', error.cause.message);
    }
    return NextResponse.json({ message: 'Terjadi kesalahan server internal.', error: error.message }, { status: 500 });
  }
}