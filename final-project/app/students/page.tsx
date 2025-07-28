import { db } from '@/db'; // Mengimpor instance database Drizzle Anda
import { students, users } from '@/db/schema'; // Mengimpor skema tabel students dan users
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'; // Komponen Card dari Shadcn UI
import { Button } from '@/components/ui/button'; // Komponen Button dari Shadcn UI
import Link from 'next/link';
import { eq } from 'drizzle-orm'; // Untuk kondisi query

// Fungsi ini akan dijalankan di sisi server untuk mengambil data.
// Karena ini adalah komponen server, kita bisa langsung melakukan query database.
async function getStudents() {
  // Mengambil semua siswa dan menggabungkan dengan informasi pengguna terkait
  const studentList = await db.query.students.findMany({
    with: {
      user: true, // Mengambil data user yang terkait dengan student
    },
    orderBy: (students, { asc }) => [asc(students.grade), asc(students.studentIdNumber)],
  });
  return studentList;
}

export default async function StudentsPage() {
  const studentList = await getStudents();

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Daftar Siswa</h1>
        <Link href="/students/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out">
            Tambah Siswa Baru
          </Button>
        </Link>
      </div>

      {studentList.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300">Belum ada data siswa.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studentList.map((student) => (
            <Card key={student.id} className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden transform transition duration-300 hover:scale-105">
              <CardHeader className="bg-gray-50 dark:bg-gray-700 p-4 border-b border-gray-200 dark:border-gray-600">
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-50">{student.user?.name || 'Nama Tidak Diketahui'}</CardTitle>
                <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
                  NISN: {student.studentIdNumber} | Kelas: {student.grade}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 text-gray-700 dark:text-gray-200">
                <p className="mb-2">
                  <span className="font-medium">Email:</span> {student.user?.email || 'N/A'}
                </p>
                <p className="mb-2">
                  <span className="font-medium">Tanggal Lahir:</span> {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'}
                </p>
                <p className="mb-2">
                  <span className="font-medium">Telepon:</span> {student.phoneNumber || 'N/A'}
                </p>
                <p className="mb-2">
                  <span className="font-medium">Alamat:</span> {student.address || 'N/A'}
                </p>
                <div className="mt-4 flex justify-end space-x-2">
                  <Link href={`/students/${student.id}`}>
                    <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-gray-700">
                      Lihat Detail
                    </Button>
                  </Link>
                  {/* Anda bisa menambahkan tombol edit/hapus di sini */}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}