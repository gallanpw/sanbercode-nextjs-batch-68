import Link from 'next/link';
import React from 'react';

export default function Navbar() {
    return (
        <nav className="bg-gray-800 p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                {/* Logo atau Nama Aplikasi */}
                {/* Link ini akan bertindak sebagai logo/nama aplikasi yang clickable ke Home */}
                <Link href="/" className="text-white text-2xl font-bold hover:text-gray-300">
                    MyNextApp
                </Link>

                {/* Navigasi Utama */}
                <ul className="flex space-x-6">
                    <li>
                        <Link href="/" className="text-white hover:text-gray-300 transition-colors duration-200">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link href="/about" className="text-white hover:text-gray-300 transition-colors duration-200">
                            About
                        </Link>
                    </li>
                    <li>
                        <Link href="/blog" className="text-white hover:text-gray-300 transition-colors duration-200">
                            Blog
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}