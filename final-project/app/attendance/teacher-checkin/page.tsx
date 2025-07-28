"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TeacherCheckinPage() {
  const [nuptk, setNuptk] = useState<string>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setIsLoading(true);

    if (!nuptk) {
      setMessage({ type: 'error', text: 'NUPTK tidak boleh kosong.' }); // Pesan error diperbarui
      setIsLoading(false);
      return;
    }

    try {
      // Panggil API Route check-in guru yang baru
      const response = await fetch('/api/attendance/teacher-checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teacherIdNumber: nuptk }), // Kirim teacherIdNumber
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
        setNuptk('');
      } else {
        setMessage({ type: 'error', text: data.message || 'Terjadi kesalahan saat check-in.' });
      }
    } catch (error) {
      console.error('Error during teacher check-in:', error);
      setMessage({ type: 'error', text: 'Terjadi kesalahan jaringan atau server.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="text-center p-6 bg-blue-600 dark:bg-indigo-700 text-white">
          <CardTitle className="text-3xl font-extrabold mb-2">Absensi Guru</CardTitle>
          <CardDescription className="text-blue-100 dark:text-indigo-200">
            Masukkan NUPTK Anda untuk check-in kehadiran.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="nuptk" className="text-gray-700 dark:text-gray-200 text-lg">Nomor Unik Pendidik dan Tenaga Kependidikan (NUPTK)</Label>
              <Input
                id="nuptk"
                type="text"
                placeholder="Contoh: 1234567890"
                value={nuptk}
                onChange={(e) => setNuptk(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full py-3 text-lg bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
              disabled={isLoading}
            >
              {isLoading ? 'Memproses...' : 'Check-in Kehadiran'}
            </Button>
          </form>

          <br />
          <Link href="/" passHref>
              <Button className="w-full py-3 text-lg bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                <span className="mr-2"></span> Kembali ke Beranda
              </Button>
            </Link>

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