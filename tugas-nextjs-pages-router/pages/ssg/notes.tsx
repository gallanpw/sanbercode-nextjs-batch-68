import type { GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';

// Definisikan tipe data untuk catatan Anda (sesuaikan dengan respon API yang sebenarnya)
type Note = {
  id: number; // Menggunakan number berdasarkan log API Anda
  title: string;
  description: string; // Properti 'description' dari log API Anda
  created_at: string;
  updated_at: string;
};

// getStaticProps akan berjalan di sisi server pada saat build time
export const getStaticProps: GetStaticProps<{ notes: Note[] }> = async (context) => {
  try {
    const response = await fetch('https://service.pace11.my.id/api/notes');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const apiResponse = await response.json();

    console.log('API Response Data (getStaticProps):', apiResponse);

    let notesToReturn: Note[] = [];

    // Mengambil array catatan dari properti 'data' pada respons API
    if (apiResponse && Array.isArray(apiResponse.data)) {
        // Mengubah nama properti agar sesuai dengan Note type yang diharapkan komponen
        // Jika API menggunakan 'description' dan komponen mengharapkan 'content'
        notesToReturn = apiResponse.data.map((note: any) => ({
            id: note.id,
            title: note.title,
            description: note.description, // Sesuaikan di sini: 'description' dari API ke 'content' di Note type
            created_at: note.created_at,
            updated_at: note.updated_at,
        }));
    } else {
        console.warn('API response does not contain an array in apiResponse.data:', apiResponse);
        notesToReturn = [];
    }

    return {
      props: {
        notes: notesToReturn,
      },
      // Opsional: Untuk Incremental Static Regeneration (ISR)
      // revalidate: 60, // Halaman akan divalidasi ulang setiap 60 detik
    };
  } catch (error) {
    console.error('Failed to fetch notes in getStaticProps:', error);
    return {
      props: {
        notes: [], // Selalu kembalikan array kosong jika terjadi error agar JSON serializable
      },
    };
  }
};

// Komponen halaman yang akan menerima data dari getStaticProps
export default function SsgNotesPage({
  notes,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    // Gunakan React Fragment atau hilangkan sepenuhnya, karena Layout sudah di _app.tsx
    <>
      <Head>
        <title>Static Notes | Next.js Course</title>
        <meta name="description" content="List of notes fetched using SSG" />
      </Head>
      <main className="flex flex-col items-center justify-center p-8 pb-20">
        <h1 className="text-4xl font-bold text-green-600 mb-8">My Notes SSG</h1>
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