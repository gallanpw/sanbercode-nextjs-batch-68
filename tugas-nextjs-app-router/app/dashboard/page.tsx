'use client';

import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter();

    const handleLogout = () => {
        // Menghapus cookie 'auth_token' dengan mengaturnya ke tanggal kadaluarsa di masa lalu
        document.cookie = 'auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT;';

        // Redirect pengguna kembali ke halaman login
        router.push('/login');
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-indigo-100">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h1 className="text-4xl font-bold text-indigo-700 mb-4">Dashboard Page</h1>
                <p className="text-xl text-gray-700">Ini adalah halaman yang dilindungi!</p>
                <p className="mt-4 text-gray-600">Anda berhasil masuk.</p>
                <div className="flex flex-col space-y-4 mt-8">
                    <a
                        href="/"
                        className="inline-block bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Kembali ke Home
                    </a>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </main>
    );
}