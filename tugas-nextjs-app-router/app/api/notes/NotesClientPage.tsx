'use client';

import { useState } from 'react';

interface Note {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

interface NotesClientPageProps {
  initialNotes: Note[];
}

export default function NotesClientPage({ initialNotes }: NotesClientPageProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Panggil App Router API Route internal
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTitle, description: newDescription }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Error: ${res.status} - ${errorData.message || res.statusText}`);
      }

      const addedNote: Note = await res.json();
      setNotes((prevNotes) => [...prevNotes, addedNote]); // Tambahkan catatan baru ke state
      setNewTitle('');
      setNewDescription('');
    } catch (err: any) {
      setError(err.message || 'Failed to add note');
      console.error('Failed to add note:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
          Fullstack Notes App (App Router)
        </h1>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">Add New Note</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
                Title:
              </label>
              <input
                type="text"
                id="title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">
                Description:
              </label>
              <textarea
                id="description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                rows={4}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
            >
              {loading ? 'Adding Note...' : 'Add Note'}
            </button>
          </form>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-purple-700 mb-4">Your Notes</h2>
          {notes.length === 0 ? (
            <p className="text-gray-600">No notes yet. Add one above!</p>
          ) : (
            <ul className="space-y-4">
              {notes.map((note) => (
                <li key={note.id} className="bg-blue-50 p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-blue-800">{note.title}</h3>
                  {note.description && (
                    <p className="text-gray-700 mt-2">{note.description}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    Created: {new Date(note.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}