import { auth } from '@/lib/auth'; // Import helper auth
import { db } from '@/db'; // Import instance database Drizzle
import { students, users } from '@/db/schema'; // Import skema tabel students dan users
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Fungsi untuk mengambil data siswa
async function getStudentsWithUsers() {
  const studentList = await db.query.students.findMany({
    with: {
      user: true, // Mengambil data user yang terkait dengan student
    },
  });

  // Urutkan data di JavaScript setelah diambil dari database
  return studentList.sort((a, b) => {
    const gradeCompare = a.grade.localeCompare(b.grade);
    if (gradeCompare !== 0) {
      return gradeCompare;
    }
    const nameA = a.user?.name || '';
    const nameB = b.user?.name || '';
    return nameA.localeCompare(nameB);
  });
}

export default async function StudentDashboardPage() {
  const session = await auth();

  // Proteksi rute: Hanya admin dan guru yang bisa melihat daftar siswa (sesuaikan jika siswa boleh lihat diri sendiri)
  // Untuk saat ini, kita asumsikan semua user yang sudah login bisa akses ini.
  // Proteksi utama ada di layout, jadi di sini tidak perlu redirect lagi.

  const studentList = await getStudentsWithUsers();

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">Daftar Siswa</CardTitle>
            {session?.user?.role === 'admin' && ( // Hanya tampilkan tombol ini jika user adalah admin
              <Link href="/dashboard/student/add-student" passHref>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out">
                  Tambah Siswa Baru
                </Button>
              </Link>
            )}
          </div>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Berikut adalah daftar semua siswa yang terdaftar.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {studentList.length === 0 ? (
            <p className="p-8 text-center text-gray-600 dark:text-gray-300">Belum ada data siswa. Silakan tambahkan siswa baru.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-700">
                    <TableHead className="w-[100px] text-gray-700 dark:text-gray-200">Nama</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-200">Email</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-200">NISN</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-200">Kelas</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-200">Telepon</TableHead>
                    <TableHead className="text-right text-gray-700 dark:text-gray-200">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentList.map((student) => (
                    <TableRow key={student.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/50">
                      <TableCell className="font-medium text-gray-900 dark:text-gray-50">{student.user?.name || 'N/A'}</TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-200">{student.user?.email || 'N/A'}</TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-200">{student.studentIdNumber}</TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-200">{student.grade}</TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-200">{student.phoneNumber || 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/students/${student.id}`} passHref>
                          <Button variant="outline" size="sm" className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-gray-700">
                            Detail
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}