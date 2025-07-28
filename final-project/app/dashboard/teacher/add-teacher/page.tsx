"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function AddTeacherPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [teacherIdNumber, setTeacherIdNumber] = useState<string>('');
  const [subjectTaught, setSubjectTaught] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const [message, setMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Proteksi rute di client-side: Arahkan jika bukan admin
  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'admin') {
      router.push('/login');
    }
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setIsLoading(true);

    if (!name || !email || !password || !teacherIdNumber || !subjectTaught) {
      setMessage({ type: 'error', text: 'Nama, email, kata sandi, NIP, dan mata pelajaran harus diisi.' });
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Kata sandi minimal 6 karakter.' });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/teachers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          teacherIdNumber,
          subjectTaught,
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
        setTeacherIdNumber('');
        setSubjectTaught('');
        setPhoneNumber('');
        // Opsional: Redirect ke daftar guru atau dashboard admin
        // setTimeout(() => router.push('/dashboard/teacher'), 2000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Terjadi kesalahan saat menambah guru.' });
      }
    } catch (error) {
      console.error('Error adding teacher:', error);
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
        <CardHeader className="text-center p-6 bg-purple-600 dark:bg-purple-700 text-white">
          <CardTitle className="text-3xl font-extrabold mb-2">Tambah Guru Baru</CardTitle>
          <CardDescription className="text-purple-100 dark:text-purple-200">
            Masukkan detail guru dan informasi akunnya.
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
                  placeholder="Nama Lengkap Guru"
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

            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-4">Informasi Guru</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="teacherIdNumber" className="text-gray-700 dark:text-gray-200">NIP</Label>
                <Input
                  id="teacherIdNumber"
                  type="text"
                  placeholder="Nomor Induk Pegawai"
                  value={teacherIdNumber}
                  onChange={(e) => setTeacherIdNumber(e.target.value)}
                  className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subjectTaught" className="text-gray-700 dark:text-gray-200">Mata Pelajaran</Label>
                <Input
                  id="subjectTaught"
                  type="text"
                  placeholder="Contoh: Matematika, Bahasa Inggris"
                  value={subjectTaught}
                  onChange={(e) => setSubjectTaught(e.target.value)}
                  className="p-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                  disabled={isLoading}
                />
              </div>
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

            <Button
              type="submit"
              className="w-full py-3 text-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out mt-6"
              disabled={isLoading}
            >
              {isLoading ? 'Menambah Guru...' : 'Tambah Guru'}
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