import Navbar from './navbar';
import Footer from './footer';
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        // Kontainer utama untuk layout, membuatnya menjadi flex column
        // dan memastikan tinggi minimalnya adalah 100% dari viewport
        <div className="flex flex-col min-h-screen">
            <Navbar />
            {/* Konten utama yang akan mengisi sisa ruang yang tersedia */}
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}