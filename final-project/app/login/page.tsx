"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { signIn, useSession } from 'next-auth/react'; // Import fungsi signIn dari next-auth/react
import { useRouter } from 'next/navigation'; // Untuk navigasi setelah login

export default function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  // Efek untuk mengarahkan pengguna jika sudah login
  useEffect(() => {
    if (status === 'authenticated') {
      // Jika sesi aktif, alihkan ke dashboard
      router.push('/dashboard');
    }
  }, [status, router]); // Dependensi: status sesi dan router

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error
    setIsLoading(true);

    if (!email || !password) {
      setError('Email dan kata sandi harus diisi.');
      setIsLoading(false);
      return;
    }

    try {
      // Panggil fungsi signIn dari next-auth
      const result = await signIn('credentials', {
        redirect: false, // Jangan redirect otomatis, kita akan handle sendiri
        email,
        password,
      });

      if (result?.error) {
        // Jika ada error dari server (misalnya kredensial tidak valid)
        setError('Login gagal: Email atau kata sandi salah.');
      } else {
        // Login berhasil, alihkan ke dashboard
        // router.push('/dashboard');
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError('Terjadi kesalahan jaringan atau server.');
    } finally {
      setIsLoading(false);
    }
  };

  // Tampilkan loading state atau null jika sesi sedang dimuat
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <p className="text-gray-700 dark:text-gray-300">Memuat sesi...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="text-center p-6 bg-blue-600 dark:bg-indigo-700 text-white">
          <CardTitle className="text-3xl font-extrabold mb-2">Login</CardTitle>
          <CardDescription className="text-blue-100 dark:text-indigo-200">
            Masuk ke akun Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-200">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-200">Kata Sandi</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full py-3 text-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-300 ease-in-out"
              disabled={isLoading}
            >
              {isLoading ? 'Memuat...' : 'Login'}
            </Button>
          </form>

          {error && (
            <div className="mt-6 p-4 rounded-lg text-center bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
              {error}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}