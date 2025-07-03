import Head from 'next/head';

export default function DetailBlog() {
    return (
        <> {/* Ganti dengan fragmen React jika Layout dihapus */}
            <Head>
                <title>Detail Blog | Next.js Course</title>
                <meta name='title' content='Detail Blog Post Page' />
                <meta name="description" content="Learn more blog post page" />
            </Head>
                <main className="flex min-h-screen flex-col items-center justify-center p-24">
                <h1 className="text-4xl font-bold text-pink-400">Welcome to the detail blog post page</h1>
                <p className="mt-4 text-lg text-gray-700">This is the detail blog post page content.</p>
            </main>
        </> // Ganti dengan fragmen React jika Layout dihapus
    );
}