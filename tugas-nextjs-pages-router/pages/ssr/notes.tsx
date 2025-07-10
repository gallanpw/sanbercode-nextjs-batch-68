import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';

// Definisikan tipe data untuk catatan Anda (sesuaikan dengan respon API Notes yang sebenarnya)
type Note = {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
};

// getServerSideProps akan berjalan di sisi server pada setiap request
export const getServerSideProps: GetServerSideProps<{ notes: Note[] }> = async (context) => {
    try {
      const response = await fetch('https://service.pace11.my.id/api/notes');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const apiResponse = await response.json(); // Ubah nama variabel untuk kejelasan
  
      console.log('API Response Data:', apiResponse); // Log ini sudah benar
  
      let notesToReturn: Note[] = [];
  
      // Perubahan di sini: Akses data.data
      if (apiResponse && Array.isArray(apiResponse.data)) {
          notesToReturn = apiResponse.data;
      } else {
          // Jika apiResponse.data tidak ada atau bukan array, pastikan notesToReturn kosong
          console.warn('API response does not contain an array in apiResponse.data:', apiResponse);
          notesToReturn = [];
      }
  
      return {
        props: {
          notes: notesToReturn,
        },
      };
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      return {
        props: {
          notes: [],
        },
      };
    }
};

// ... (Komponen NotesPage Anda tetap sama seperti sebelumnya) ...
export default function NotesPage({
  notes,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <Head>
        <title>Notes | Next.js Course</title>
        <meta name="description" content="List of notes fetched from API" />
      </Head>
      <main className="flex flex-col items-center justify-center p-8 pb-20">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">My Notes SSR</h1>
        {notes.length === 0 ? (
          <p className="text-lg text-gray-700">No notes found or failed to load.</p>
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
    </>
  );
}