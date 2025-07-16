import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    // Ambil token dari cookie (simulasi sederhana)
    // Di aplikasi nyata, ini bisa berupa JWT atau session token
    const hasAuthToken = request.cookies.has('auth_token');

    // Jika request adalah ke halaman dashboard yang ingin dilindungi
    // dan pengguna tidak memiliki token otentikasi
    if (request.nextUrl.pathname.startsWith('/dashboard') && !hasAuthToken) {
        // Redirect pengguna ke halaman login
        // Pastikan URL '/login' sudah ada atau akan Anda buat
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect_to', request.nextUrl.pathname); // Opsional: Tambahkan query param untuk redirect setelah login

        return NextResponse.redirect(loginUrl);
    }

    // Jika token ada atau path bukan yang dilindungi, lanjutkan request
    return NextResponse.next();
}

// Konfigurasi `matcher` untuk menentukan jalur mana yang akan dieksekusi oleh Middleware ini.
// Hanya jalur yang cocok dengan pola ini yang akan memicu middleware.
export const config = {
    matcher: [
        '/dashboard/:path*', // Lindungi semua jalur di bawah /dashboard (misal: /dashboard, /dashboard/settings)
        // '/login', // Jika Anda ingin middleware juga memproses halaman login (misal: untuk redirect pengguna yang sudah login dari halaman login)
        // '/', // Atau bisa juga diterapkan di root
    ],
};