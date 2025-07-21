'use client'; // Ini adalah Client Component karena akan ada interaksi

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirect_to') || '/dashboard';
    const [message, setMessage] = useState('');
    const [isLoginMode, setIsLoginMode] = useState(true); // State untuk switch antara Login dan Signup

    // State untuk form input
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // Untuk signup

    // Fungsi simulasi login
    const handleLogin = () => {
        // Di sini Anda akan melakukan otentikasi nyata (kirim username/password ke API)
        // Setelah berhasil, set cookie otentikasi (misalnya 'auth_token')
        document.cookie = 'auth_token=my_secret_token; Path=/; Max-Age=3600'; // Cookie berlaku 1 jam

        setMessage('Login successful! Redirecting...');
        // Redirect ke halaman yang ingin dituju (atau defaultnya /dashboard)
        router.push(redirectTo);
    };

    // --- Fungsi untuk menangani Sign Up ---
    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            setMessage('Passwords do not match!');
            return;
        }

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message + ' You can now log in.');
                setIsLoginMode(true); // Kembali ke mode login setelah sukses signup
                setEmail(''); // Bersihkan form
                setPassword('');
                setConfirmPassword('');
            } else {
                setMessage(data.message || 'Signup failed.');
            }
        } catch (error) {
            console.error('Signup error:', error);
            setMessage('Network error during signup.');
        }
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
                <h1 className="text-3xl font-bold text-teal-600 mb-6 text-center">
                    {isLoginMode ? 'Login Page' : 'Sign Up Page'}
                </h1>
                {message && <p className="mb-4 text-center text-green-600">{message}</p>}

                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                        Email:
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                        Password:
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {!isLoginMode && (
                    <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
                            Confirm Password:
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                )}

                <button
                    onClick={isLoginMode ? handleLogin : handleSignUp} // Menggunakan simulasi login untuk sementara
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                >
                    {isLoginMode ? 'Login' : 'Sign Up'}
                </button>

                <p className="mt-4 text-center text-gray-600">
                    {isLoginMode ? (
                        <>
                            Belum punya akun?{' '}
                            <button
                                onClick={() => {
                                    setIsLoginMode(false);
                                    setMessage('');
                                    setEmail('');
                                    setPassword('');
                                    setConfirmPassword('');
                                }}
                                className="text-blue-500 hover:underline"
                            >
                                Daftar sekarang!
                            </button>
                        </>
                    ) : (
                        <>
                            Sudah punya akun?{' '}
                            <button
                                onClick={() => {
                                    setIsLoginMode(true);
                                    setMessage('');
                                    setEmail('');
                                    setPassword('');
                                    setConfirmPassword('');
                                }}
                                className="text-blue-500 hover:underline"
                            >
                                Login di sini.
                            </button>
                        </>
                    )}
                </p>
            </div>
        </main>
    );
}