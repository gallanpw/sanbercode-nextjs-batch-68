import { auth } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { AttendanceFilters } from '@/components/attendance-filters';
import { format } from 'date-fns';
import { headers } from 'next/headers';

async function getAttendanceData(
  date?: string,
  studentId?: string,
  classId?: string,
  teacherId?: string,
  requestHeaders?: Headers
) {
  const params = new URLSearchParams();
  if (date) params.append('date', date);
  if (studentId) params.append('studentId', studentId);
  if (classId) params.append('classId', classId);
  if (teacherId) params.append('teacherId', teacherId);

  const fetchHeaders = new Headers(requestHeaders);

  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/attendance-records?${params.toString()}`, {
    cache: 'no-store',
    headers: fetchHeaders,
  });

  if (!response.ok) {
    if (response.status === 401) {
        throw new Error('Unauthorized: Anda tidak memiliki izin untuk melihat data ini.');
    }
    const errorBody = await response.json();
    throw new Error(`Failed to fetch attendance data: ${response.statusText}. Detail: ${errorBody.error || errorBody.message}`);
  }
  return response.json();
}

export default async function AttendanceStatusPage({
  searchParams,
}: {
  searchParams?: {
    date?: string;
    studentId?: string;
    classId?: string;
    teacherId?: string;
  };
}) {
  const session = await auth();

  const { date, studentId, classId, teacherId } = searchParams || {};

  const requestHeaders = await headers();

  let attendanceData;
  try {
    attendanceData = await getAttendanceData(date, studentId, classId, teacherId, requestHeaders);
  } catch (error: any) {
    console.error(error);
    return (
      <div className="container mx-auto p-4">
        <Card className="w-full bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
          <CardHeader className="p-6 border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="text-2xl font-bold text-red-600">Error Memuat Data Absensi</CardTitle>
          </CardHeader>
          <CardContent className="p-8 text-gray-700 dark:text-gray-200">
            <p>Terjadi kesalahan saat memuat data absensi. Silakan coba lagi nanti.</p>
            <p className="text-sm text-gray-500 mt-2">Detail: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { studentAttendances, teacherAttendances, teacherAbsenceRecords } = attendanceData; // Destructure teacherAttendances

  const displayDate = date ? format(new Date(date), 'dd MMMM yyyy') : format(new Date(), 'dd MMMM yyyy');

  return (
    <div className="container mx-auto p-4">
      {/* <Card className="w-full bg-white dark:bg-gray-800 shadow-xl rounded-2xl mb-8">
        <CardHeader className="p-6 border-b border-gray-200 dark:border-gray-700">
          <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">Status Absensi</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Lihat rekap absensi siswa dan informasi ketidakhadiran guru.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <AttendanceFilters />
        </CardContent>
      </Card> */}

      {/* Tabel Absensi Siswa */}
      <Card className="w-full bg-white dark:bg-gray-800 shadow-xl rounded-2xl mb-8">
        <CardHeader className="p-6 border-b border-gray-200 dark:border-gray-700">
          <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">Absensi Siswa</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Data absensi siswa untuk tanggal {displayDate}.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {studentAttendances.length === 0 ? (
            <p className="p-8 text-center text-gray-600 dark:text-gray-300">Tidak ada catatan absensi siswa untuk filter ini.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-700">
                    <TableHead className="text-gray-700 dark:text-gray-200">Tanggal</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-200">Nama Siswa</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-200">NISN</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-200">Kelas</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-200">Status</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-200">Dicatat Oleh</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-200">Catatan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentAttendances.map((att: any) => (
                    <TableRow key={att.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/50">
                      <TableCell>{format(new Date(att.date), 'dd MMMM yyyy')}</TableCell>
                      <TableCell className="font-medium">{att.student?.user?.name || 'N/A'}</TableCell>
                      <TableCell>{att.student?.studentIdNumber || 'N/A'}</TableCell>
                      <TableCell>{att.class?.name || 'N/A'}</TableCell>
                      <TableCell className={`font-semibold ${att.status === 'present' ? 'text-green-600' : 'text-red-600'}`}>
                        {att.status.charAt(0).toUpperCase() + att.status.slice(1)}
                      </TableCell>
                      <TableCell>{att.recordedByUser?.name || 'Sistem/Tidak Diketahui'}</TableCell>
                      <TableCell>{att.notes || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabel Absensi Guru (TeacherAttendances) */}
      <Card className="w-full bg-white dark:bg-gray-800 shadow-xl rounded-2xl mb-8">
        <CardHeader className="p-6 border-b border-gray-200 dark:border-gray-700">
          <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">Absensi Guru</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Data absensi guru untuk tanggal {displayDate}.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {teacherAttendances.length === 0 ? (
            <p className="p-8 text-center text-gray-600 dark:text-gray-300">Tidak ada catatan absensi guru untuk filter ini.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-700">
                    <TableHead className="text-gray-700 dark:text-gray-200">Tanggal</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-200">Nama Guru</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-200">NUPTK</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-200">Status</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-200">Dicatat Oleh</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-200">Catatan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teacherAttendances.map((att: any) => (
                    <TableRow key={att.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/50">
                      <TableCell>{format(new Date(att.date), 'dd MMMM yyyy')}</TableCell>
                      <TableCell className="font-medium">{att.teacher?.user?.name || 'N/A'}</TableCell>
                      <TableCell>{att.teacher?.teacherIdNumber || 'N/A'}</TableCell>
                      <TableCell className={`font-semibold ${att.status === 'present' ? 'text-green-600' : 'text-red-600'}`}>
                        {att.status.charAt(0).toUpperCase() + att.status.slice(1)}
                      </TableCell>
                      <TableCell>{att.recordedByUser?.name || 'Sistem/Tidak Diketahui'}</TableCell>
                      <TableCell>{att.notes || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabel Ketidakhadiran Guru (TeacherAbsences) */}
      {/* <Card className="w-full bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
        <CardHeader className="p-6 border-b border-gray-200 dark:border-gray-700">
          <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">Ketidakhadiran Guru</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Informasi guru yang tidak hadir untuk tanggal {displayDate}.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {teacherAbsenceRecords.length === 0 ? (
            <p className="p-8 text-center text-gray-600 dark:text-gray-300">Tidak ada catatan ketidakhadiran guru untuk filter ini.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-700">
                    <TableHead className="text-gray-700 dark:text-gray-200">Guru Absen</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-200">Mulai</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-200">Selesai</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-200">Alasan</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-200">Guru Pengganti</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teacherAbsenceRecords.map((abs: any) => (
                    <TableRow key={abs.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/50">
                      <TableCell className="font-medium">{abs.absentTeacher?.user?.name || 'N/A'}</TableCell>
                      <TableCell>{format(new Date(abs.startDate), 'dd MMMM yyyy')}</TableCell>
                      <TableCell>{format(new Date(abs.endDate), 'dd MMMM yyyy')}</TableCell>
                      <TableCell>{abs.reason}</TableCell>
                      <TableCell>{abs.replacementTeacher?.user?.name || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card> */}
    </div>
  );
}