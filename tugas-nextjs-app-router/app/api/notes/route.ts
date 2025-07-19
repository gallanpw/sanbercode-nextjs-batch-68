import { NextResponse, NextRequest } from 'next/server';
import { db } from '../../../db';
import { notes } from '../../../db/schema';

// 1. Route Handler untuk GET request (Mengambil semua catatan)
export async function GET_LAMA(request: NextRequest) {
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
export async function POST_LAMA(request: NextRequest) {
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

// Handler untuk GET request: Mengambil semua catatan
export async function GET(request: NextRequest) {
    try {
      const allNotes = await db.select().from(notes);
      return NextResponse.json(allNotes, { status: 200 });
    } catch (error: any) {
      console.error('Error fetching notes:', error);
      return NextResponse.json(
        { message: 'Failed to fetch notes', error: error.message },
        { status: 500 }
      );
    }
  }
  
  // Handler untuk POST request: Membuat catatan baru
  export async function POST(request: NextRequest) {
    try {
      const body = await request.json(); // Mengambil body dari request
      const { title, description } = body;
  
      if (!title) {
        return NextResponse.json({ message: 'Title is required' }, { status: 400 });
      }
  
      const newNote = await db.insert(notes).values({
        title,
        description: description || null,
      }).returning(); // Mengembalikan data catatan yang baru dibuat
  
      return NextResponse.json(newNote[0], { status: 201 }); // Mengembalikan catatan yang dibuat
    } catch (error: any) {
      console.error('Error creating note:', error);
      return NextResponse.json(
        { message: 'Failed to create note', error: error.message },
        { status: 500 }
      );
    }
  }