import { NextResponse, NextRequest } from 'next/server';

// 1. Route Handler untuk GET request (Mengambil semua catatan)
export async function GET(request: NextRequest) {
    try {
        // Mengambil data dari API Notes eksternal
        const response = await fetch('https://service.pace11.my.id/api/notes');

        if (!response.ok) {
            // Jika respons dari API eksternal tidak berhasil (misalnya 404, 500)
            const errorData = await response.json().catch(() => ({ message: 'Failed to fetch notes' }));
            return NextResponse.json(errorData, { status: response.status });
        }

        const notes = await response.json();

        // Mengembalikan respons JSON ke klien Next.js
        return NextResponse.json(notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

// 2. Route Handler untuk POST request (Membuat catatan baru)
export async function POST(request: NextRequest) {
    try {
        // Membaca body request dari klien (form add-note.tsx)
        const body = await request.json();
        const { title, content } = body;

        // Pastikan data yang diperlukan ada
        if (!title || !content) {
            return NextResponse.json({ message: 'Title and content are required.' }, { status: 400 });
        }

        // Mengirim data ke API Notes eksternal
        // PENTING: Kita menggunakan endpoint POST yang sudah Anda konfirmasi: /api/note (singular)
        const externalApiResponse = await fetch('https://service.pace11.my.id/api/note', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Pastikan properti yang dikirim sesuai dengan API Notes (title, description)
            body: JSON.stringify({
                title,
                description: content,
            }),
        });

        const data = await externalApiResponse.json();

        if (!externalApiResponse.ok) {
            console.error('External API error:', data);
            // Mengembalikan respons error dari API eksternal
            return NextResponse.json(data, { status: externalApiResponse.status });
        }

        // Mengembalikan respons sukses ke klien dengan status 201 Created
        return NextResponse.json({ message: 'Note created successfully!', note: data }, { status: 201 });

    } catch (error) {
        console.error('Error creating note:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}