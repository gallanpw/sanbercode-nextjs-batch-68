import React from 'react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        // Menggunakan fixed bottom agar footer selalu di bawah viewport
        // Atau pakai absolute bottom-0 jika parent div di layout memiliki relative dan min-h-screen
        <footer className="bg-gray-800 p-4 text-white text-center text-sm w-full">
            <div className="container mx-auto">
                <p>&copy; {currentYear} Tugas NextJS Pages Router. All rights reserved.</p>
            </div>
        </footer>
    );
}