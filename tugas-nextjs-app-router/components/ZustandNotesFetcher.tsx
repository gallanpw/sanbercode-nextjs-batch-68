'use client';

import { useEffect } from 'react';
import { useNoteStore } from '../app/store/noteStore';

export default function ZustandNotesFetcher() {
  const { notes, loading, error, fetchNotes } = useNoteStore();

  useEffect(() => {
    // Panggil fetchNotes saat komponen di-mount
    fetchNotes();
  }, [fetchNotes]); // Pastikan fetchNotes tidak berubah antar render

  if (loading) return <p className="text-blue-600">Loading notes with Zustand...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;

  return (
    <div className="bg-emerald-100 p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4 text-emerald-800">Notes from Zustand Store</h2>
      {notes.length === 0 ? (
        <p className="text-gray-700">No notes found in Zustand store.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-4">
          {notes.slice(0, 5).map((note) => ( // Batasi 5 catatan saja untuk contoh
            <li key={note.id} className="bg-emerald-50 p-4 rounded-md shadow-sm">
              <h3 className="font-semibold text-emerald-700">{note.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{note.description}</p>
            </li>
          ))}
          {notes.length > 5 && <p className="text-sm text-gray-500 mt-2">... {notes.length - 5} more notes</p>}
        </ul>
      )}
    </div>
  );
}