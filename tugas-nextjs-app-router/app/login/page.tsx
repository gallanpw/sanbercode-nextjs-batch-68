'use client'; // Ini adalah Client Component karena akan ada interaksi

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect_to') || '/dashboard';
    const [message, setMessage] = useState('');

    // Fungsi simulasi login
    const handleLogin = () => {
        // Di sini Anda akan melakukan otentikasi nyata (kirim username/password ke API)
        // Setelah berhasil, set cookie otentikasi (misalnya 'auth_token')
        document.cookie = 'auth_token=my_secret_token; Path=/; Max-Age=3600'; // Cookie berlaku 1 jam

        setMessage('Login successful! Redirecting...');
        // Redirect ke halaman yang ingin dituju (atau defaultnya /dashboard)
        router.push(redirectTo);
    };

    useEffect(() => {
        // Contoh: Jika ada token, langsung redirect dari halaman login
        const hasAuthToken = document.cookie.includes('auth_token');
        if (hasAuthToken && window.location.pathname === '/login') {
            setMessage('Already logged in! Redirecting...');
            router.push('/dashboard'); // Atau ke halaman utama jika sudah login
        }
    }, [router]);


    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-3xl font-bold text-teal-600 mb-6 text-center">Login Page</h1>
                {message && <p className="mb-4 text-center text-green-600">{message}</p>}
                <p className="mb-4 text-center text-gray-700">
                    Anda perlu login untuk mengakses halaman yang dilindungi.
                </p>
                <button
                    onClick={handleLogin}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                >
                    Simulasi Login
                </button>
            </div>
        </main>
    );
}