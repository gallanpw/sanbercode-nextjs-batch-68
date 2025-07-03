import Head from 'next/head';

export default function Blog() {
    return (
        <> {/* Ganti dengan fragmen React jika Layout dihapus */}
            <Head>
                <title>Blog | Next.js Course</title>
                <meta name='title' content='Blog Post Page' />
                <meta name="description" content="Learn more blog post page" />
            </Head>
                <main className="flex min-h-screen flex-col items-center justify-center p-24">
                <h1 className="text-4xl font-bold text-red-600">Welcome to the blog post page</h1>
                <p className="mt-4 text-lg text-gray-700">This is the blog post page content.</p>
            </main>
        </> // Ganti dengan fragmen React jika Layout dihapus
    );
}