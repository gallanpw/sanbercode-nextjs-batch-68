import { NextResponse } from 'next/server';

type Note = {
  id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export default async function IsrNotesPage() {
  let notes: Note[] = [];
  let error: string | null = null;

  try {
    // Menggunakan next: { revalidate: X } untuk perilaku ISR
    // Halaman akan divalidasi ulang setiap X detik
    const response = await fetch('https://service.pace11.my.id/api/notes', {
      next: { revalidate: 60 }, // Revalidate setiap 60 detik (contoh)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to fetch notes' }));
      throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || 'Unknown error'}`);
    }

    const apiResponse = await response.json();

    if (apiResponse && Array.isArray(apiResponse.data)) {
      notes = apiResponse.data;
    } else {
      console.warn('API response does not contain an array in apiResponse.data:', apiResponse);
      notes = [];
    }
  } catch (err: any) {
    console.error('Error fetching notes for ISR:', err);
    error = err.message || 'Failed to load notes for ISR.';
  }

  return (
    <main className="flex flex-col items-center justify-center p-8 pb-20">
      <h1 className="text-4xl font-bold text-orange-600 mb-8">Notes (App Router - ISR)</h1>
      {error ? (
        <p className="text-lg text-red-600">{error}</p>
      ) : notes.length === 0 ? (
        <p className="text-lg text-gray-700">No notes found for ISR.</p>
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