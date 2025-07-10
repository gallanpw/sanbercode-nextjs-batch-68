import { useState } from 'react';
import Head from 'next/head';
// import Layout from '../components/layout'; // Sesuaikan path jika berbeda
import { useRouter } from 'next/router'; // Untuk redirect setelah berhasil

export default function AddNotePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Mencegah reload halaman
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/notes', { // Panggil API Route internal kita
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }), // Kirim data form sebagai JSON
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Note added successfully!');
        setTitle(''); // Kosongkan form
        setContent(''); // Kosongkan form
        // Opsional: Redirect atau refresh data setelah berhasil
        router.push('/ssr/notes'); // Redirect ke halaman daftar catatan SSR
      } else {
        setMessage(`Failed to add note: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error adding note:', error);
      setMessage('An error occurred while adding the note.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Add New Note | Next.js Course</title>
        <meta name="description" content="Add a new note to the API" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center p-8 pb-20 bg-gray-50">
        <h1 className="text-4xl font-bold text-purple-600 mb-8">Add New Note</h1>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
              Title:
            </label>
            <input
              type="text"
              id="title"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">
              Content:
            </label>
            <textarea
              id="content"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Note'}
          </button>
          {message && (
            <p className={`mt-4 text-center ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
              {message}
            </p>
          )}
        </form>
      </main>
    </>
  );
}