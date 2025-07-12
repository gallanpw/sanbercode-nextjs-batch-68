import { NextResponse } from 'next/server';

// Definisikan tipe data untuk catatan Anda (sesuaikan dengan respons API Notes)
type Note = {
    id: string;
    title: string;
    description: string; // Properti 'description' dari API
    created_at: string; // Properti 'created_at' dari API
    updated_at: string;
};

// Komponen halaman ini adalah Server Component secara default
export default async function SsrNotesPage() {
    let notes: Note[] = [];
    let error: string | null = null;

    try {
        // Melakukan data fetching langsung di Server Component
        // Next.js secara otomatis memperluas 'fetch' dengan caching
        const response = await fetch('https://service.pace11.my.id/api/notes', {
            // Opsi cache:
            // 'force-cache' (default) -> seperti SSG, cache sampai revalidate
            // 'no-store' -> seperti SSR, fetch setiap request
            // next: { revalidate: 60 } -> seperti ISR, revalidate setiap 60 detik
            cache: 'no-store' // Contoh: membuat ini seperti SSR, selalu fetch data terbaru
        });
    
        if (!response.ok) {
            // Tangani respons HTTP non-OK (misalnya 404, 500)
            const errorData = await response.json().catch(() => ({ message: 'Failed to fetch notes' }));
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
        }

        const apiResponse = await response.json();

        // Pastikan struktur respons API memiliki properti 'data' yang merupakan array
        if (apiResponse && Array.isArray(apiResponse.data)) {
            notes = apiResponse.data;
        } else {
            console.warn('API response does not contain an array in apiResponse.data:', apiResponse);
            notes = [];
        }
    } catch (err: any) {
        console.error('Error fetching notes:', err);
        error = err.message || 'Failed to load notes.';
    }

    return (
        <main className="flex flex-col items-center justify-center p-8 pb-20">
            <h1 className="text-4xl font-bold text-purple-600 mb-8">Notes (App Router - SSR)</h1>
  
            {error ? (
                <p className="text-lg text-red-600">{error}</p>
            ) : notes.length === 0 ? (
                <p className="text-lg text-gray-700">No notes found for SSR.</p>
            ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl w-full">
                    {notes.map((note) => (
                        <li key={note.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                            <h2 className="text-xl font-semibold mb-2 text-gray-900">{note.title}</h2>
                            <p className="text-gray-700 text-sm mb-4 line-clamp-3">{note.description}</p>
                            <p className="text-xs text-gray-500">Created: {new Date(note.created_at).toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}