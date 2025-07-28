"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'; // Untuk memeriksa sesi dan role di client-side
import { useEffect } from 'react';

export default function AddStudentPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [studentIdNumber, setStudentIdNumber] = useState<string>('');
  const [grade, setGrade] = useState<string>('');
  const [dateOfBirth, setDateOfBirth] = useState<string>(''); // Format YYYY-MM-DD
  const [address, setAddress] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const [message, setMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Proteksi rute di client-side: Arahkan jika bukan admin
  useEffect(() => {
    if (status === 'loading') return; // Tunggu sesi dimuat
    if (!session || session.user.role !== 'admin') {
      router.push('/login'); // Arahkan ke login jika tidak terautentikasi atau bukan admin
    }
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setIsLoading(true);

    // Validasi input
    if (!name || !email || !password || !studentIdNumber || !grade) {
      setMessage({ type: 'error', text: 'Nama, email, kata sandi, NISN, dan kelas harus diisi.' });
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Kata sandi minimal 6 karakter.' });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          studentIdNumber,
          grade,
          dateOfBirth,
          address,
          phoneNumber,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
        // Reset form
        setName('');
        setEmail('');
        setPassword('');
        setStudentIdNumber('');
        setGrade('');
        setDateOfBirth('');
        setAddress('');
        setPhoneNumber('');
        // Opsional: Redirect ke daftar siswa atau dashboard admin
        // setTimeout(() => router.push('/dashboard/admin'), 2000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Terjadi kesalahan saat menambah siswa.' });
      }
    } catch (error) {
      console.error('Error adding student:', error);
      setMessage({ type: 'error', text: 'Terjadi kesalahan jaringan atau server.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <p className="text-gray-700 dark:text-gray-300">Memuat...</p>
      </div>
    );
  }

  if (!session || session.user.role !== 'admin') {
    return null; // Akan dialihkan oleh useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="text-center p-6 bg-blue-600 dark:bg-indigo-700 text-white">
          <CardTitle className="text-3xl font-extrabold mb-2">Tambah Siswa Baru</CardTitle>
          <CardDescription className="text-blue-100 dark:text-indigo-200">
            Masukkan detail siswa dan informasi akunnya.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Informasi Akun (User)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-gray-700 dark:text-gray-200">Nama Lengkap</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nama Lengkap Siswa"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-200">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-200">Kata Sandi</Label>
              <Input
                id="password"
                type="password"
                placeholder="Minimal 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                disabled={isLoading}
              />
            </div>

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-4">Informasi Siswa</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="studentIdNumber" className="text-gray-700 dark:text-gray-200">NISN</Label>
                <Input
                  id="studentIdNumber"
                  type="text"
                  placeholder="Nomor Induk Siswa Nasional"
                  value={studentIdNumber}
                  onChange={(e) => setStudentIdNumber(e.target.value)}
                  className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="grade" className="text-gray-700 dark:text-gray-200">Kelas</Label>
                <Input
                  id="grade"
                  type="text"
                  placeholder="Contoh: 10A, XI IPA 1"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dateOfBirth" className="text-gray-700 dark:text-gray-200">Tanggal Lahir</Label>
                <Input
                  id="dateOfBirth"
                  type="date" // Menggunakan type="date" untuk input tanggal
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phoneNumber" className="text-gray-700 dark:text-gray-200">Nomor Telepon</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="Contoh: +628123456789"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address" className="text-gray-700 dark:text-gray-200">Alamat</Label>
              <Input
                id="address"
                type="text"
                placeholder="Alamat lengkap siswa"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out mt-6"
              disabled={isLoading}
            >
              {isLoading ? 'Menambah Siswa...' : 'Tambah Siswa'}
            </Button>
          </form>

          {message.text && (
            <div
              className={`mt-6 p-4 rounded-lg text-center ${
                message.type === 'success'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}
            >
              {message.text}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}