import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation'; // Untuk mengarahkan pengguna setelah submit

export default function AddNoteServerActionPage() {

    // Server Action untuk menangani pengiriman formulir
    // Ini adalah fungsi async yang akan berjalan di server
    async function createNoteAction(formData: FormData) {
        'use server'; // Tandai fungsi ini sebagai Server Action

        const title = formData.get('title') as string;
        const content = formData.get('content') as string;

        if (!title || !content) {
            // Anda bisa menambahkan penanganan error yang lebih canggih di sini,
            // misalnya dengan mengirimkan error kembali ke client
            // console.error('Title and content are required.');
            console.error('Title and content are required.');
            return; // Ensure the function returns void
        }

        try {
            // Memanggil API Notes eksternal untuk membuat catatan baru
            const externalApiResponse = await fetch('https://service.pace11.my.id/api/note', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    description: content, // Pastikan nama properti sesuai API
                }),
            });

            if (!externalApiResponse.ok) {
                const errorData = await externalApiResponse.json().catch(() => ({ message: 'Failed to create note externally' }));
                console.error('External API error during note creation:', errorData);
                // return { error: errorData.message || 'Failed to create note.' };
                return; // Ensure the function returns void
            }

            // Opsional: Dapatkan data respons jika diperlukan
            const responseData = await externalApiResponse.json();
            console.log('Note created successfully via Server Action:', responseData);

            // Setelah catatan berhasil dibuat, revalidasi path yang menampilkan daftar catatan
            // Ini akan memastikan halaman SSR/SSG/ISR mendapatkan data terbaru
            revalidatePath('/notes/ssr'); // Revalidasi halaman SSR notes
            revalidatePath('/notes/ssg'); // Revalidasi halaman SSG notes
            revalidatePath('/notes/isr'); // Revalidasi halaman ISR notes
            // revalidatePath('/'); // Jika halaman home juga menampilkan catatan

            // Arahkan pengguna kembali ke halaman daftar catatan SSR setelah berhasil
            redirect('/notes/ssr');

        } catch (error: any) {
            // Periksa apakah error adalah error internal NEXT_REDIRECT
            if (error.message && error.message.includes('NEXT_REDIRECT')) {
                // Ini adalah perilaku yang diharapkan dari redirect(), jadi kita tidak perlu mencatatnya sebagai 'Error'
                // PENTING: Lemparkan kembali error ini agar Next.js dapat memproses redirect dengan benar.
                throw error;
            }
            // Untuk error lain yang bukan NEXT_REDIRECT, catat sebagai error yang sebenarnya
            console.error('Error in Server Action while creating note:', error);
            return;
        }
    }

    return (
        <main className="flex flex-col items-center justify-center p-8 pb-20">
            <h1 className="text-4xl font-bold text-teal-600 mb-8">Add New Note (Server Action)</h1>
            <form action={createNoteAction} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <div className="mb-4">
                    <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title" // Penting: 'name' harus sesuai dengan formData.get()
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">
                        Content
                    </label>
                    <textarea
                        id="content"
                        name="content" // Penting: 'name' harus sesuai dengan formData.get()
                        rows={5}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    ></textarea>
                </div>
                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Add Note
                    </button>
                </div>
            </form>
        </main>
    );
}