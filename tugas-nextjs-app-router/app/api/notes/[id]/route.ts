import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = await params;

    try {
        // Mengambil data catatan berdasarkan ID dari API Notes eksternal
        const response = await fetch(`https://service.pace11.my.id/api/note/${id}`);

        if (!response.ok) {
            // Jika respons dari API eksternal tidak berhasil (misalnya 404, 500)
            const errorData = await response.json().catch(() => ({ message: 'Failed to fetch note' }));
            return NextResponse.json(errorData, { status: response.status });
        }
        const note = await response.json();
        // Mengembalikan respons JSON ke klien Next.js
        return NextResponse.json(note);
    } catch (error) {
        console.error('Error fetching note by ID:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}