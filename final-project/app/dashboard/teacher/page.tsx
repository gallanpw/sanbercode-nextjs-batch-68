import { auth } from '@/lib/auth';
import { db } from '@/db';
import { teachers, users } from '@/db/schema'; // Import skema tabel teachers dan users
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

// Fungsi untuk mengambil data guru
async function getTeachersWithUsers() {
  const teacherList = await db.query.teachers.findMany({
    with: {
      user: true, // Mengambil data user yang terkait dengan teacher
    },
  });

  // Urutkan data di JavaScript setelah diambil dari database
  return teacherList.sort((a, b) => {
    const nameA = a.user?.name || '';
    const nameB = b.user?.name || '';
    return nameA.localeCompare(nameB);
  });
}

export default async function TeacherDashboardPage() {
  const session = await auth();

  // Proteksi rute: Hanya admin dan guru yang bisa melihat daftar guru
  // if (!session?.user || (session.user.role !== 'admin' && session.user.role !== 'teacher')) {
  //   redirect('/login'); // Arahkan ke login jika tidak terautentikasi atau bukan admin/guru
  // }

  const teacherList = await getTeachersWithUsers(); // Ambil data guru

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">Daftar Guru</CardTitle>
            {session?.user?.role === 'admin' && ( // Hanya tampilkan tombol ini jika user adalah admin
              <Link href="/dashboard/teacher/add-teacher" passHref>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out">
                  Tambah Guru Baru
                </Button>
              </Link>
            )}
          </div>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Berikut adalah daftar semua guru yang terdaftar.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {teacherList.length === 0 ? (
            <p className="p-8 text-center text-gray-600 dark:text-gray-300">Belum ada data guru. Silakan tambahkan guru baru.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-700">
                    <TableHead className="w-[100px] text-gray-700 dark:text-gray-200">Nama</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-200">Email</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-200">NIP</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-200">Mata Pelajaran</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-200">Telepon</TableHead>
                    <TableHead className="text-right text-gray-700 dark:text-gray-200">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teacherList.map((teacher) => (
                    <TableRow key={teacher.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/50">
                      <TableCell className="font-medium text-gray-900 dark:text-gray-50">{teacher.user?.name || 'N/A'}</TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-200">{teacher.user?.email || 'N/A'}</TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-200">{teacher.teacherIdNumber}</TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-200">{teacher.subjectTaught}</TableCell>
                      <TableCell className="text-gray-700 dark:text-gray-200">{teacher.phoneNumber || 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/teachers/${teacher.id}`} passHref>
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