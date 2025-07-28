import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { classes, teachers, users } from '@/db/schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
// import { signOut } from 'next-auth/react';
import { LogoutButton } from '@/components/logout-button'; // Import dari file terpisah

export default async function ClassesPage() {
    const session = await auth();
  
    if (!session?.user) {
      redirect('/login');
    }
  
    const classList = await db.query.classes.findMany({
      with: {
        teacher: {
          with: {
            user: true,
          },
        },
      },
      orderBy: (classes, { asc }) => [asc(classes.name)],
    });
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center p-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6 mt-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Daftar Kelas</h1>
            {session.user.role === 'admin' && (
              <Link href="/admin/add-class" passHref>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out">
                  Tambah Kelas Baru
                </Button>
              </Link>
            )}
          </div>
  
          {classList.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-300">Belum ada data kelas.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {classList.map((cls) => (
                <Card key={cls.id} className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden transform transition duration-300 hover:scale-105">
                  <CardHeader className="bg-gray-50 dark:bg-gray-700 p-4 border-b border-gray-200 dark:border-gray-600">
                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-50">{cls.name}</CardTitle>
                    <CardDescription className="text-sm text-gray-600 dark:text-gray-300">
                      Kode Kelas: {cls.classCode}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 text-gray-700 dark:text-gray-200">
                    <p className="mb-2">
                      <span className="font-medium">Guru Pengajar:</span> {cls.teacher?.user?.name || 'Belum Ditentukan'}
                    </p>
                    <p className="mb-2">
                      <span className="font-medium">Deskripsi:</span> {cls.description || 'Tidak ada deskripsi.'}
                    </p>
                    <div className="mt-4 flex justify-end space-x-2">
                      <Link href={`/classes/${cls.id}`}>
                        <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-gray-700">
                          Lihat Detail
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          <div className="mt-8 text-center">
            <LogoutButton />
          </div>
        </div>
      </div>
    );
  }