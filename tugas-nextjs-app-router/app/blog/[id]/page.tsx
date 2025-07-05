import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Detail Blog | Next.js Course",
  description: "Learn more detail blog post page",
};

export default async function DetailBlogPage({ params }: { params: { id: string } }) {
    const { id } = await params;

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="text-4xl font-bold text-pink-400">
                Welcome to the detail blog post page with ID: {id}
            </h1>
            <p className="mt-4 text-lg text-gray-700">
                This is the content for blog post {id}.
            </p>
        </main>
    );
}