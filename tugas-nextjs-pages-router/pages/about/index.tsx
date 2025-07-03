import Head from 'next/head';

export default function About() {
    return (
        <> {/* Ganti dengan fragmen React jika Layout dihapus */}
            <Head>
                <title>About | Next.js Course</title>
                <meta name='title' content='About Page' />
                <meta name="description" content="Learn more about us" />
            </Head>
                <main className="flex min-h-screen flex-col items-center justify-center p-24">
                <h1 className="text-4xl font-bold text-green-600">Welcome to the about page</h1>
                <p className="mt-4 text-lg text-gray-700">This is the about page content.</p>
            </main>
        </> // Ganti dengan fragmen React jika Layout dihapus
    );
}