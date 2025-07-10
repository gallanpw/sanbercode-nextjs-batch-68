import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Tangani request GET (untuk menampilkan catatan, seperti yang sudah kita buat sebelumnya)
  if (req.method === 'GET') {
    try {
      const response = await fetch('https://service.pace11.my.id/api/notes');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const apiResponse = await response.json();
      res.status(200).json(apiResponse); // Kirim seluruh objek respons API Notes
    } catch (error) {
      console.error('Error fetching notes:', error);
      res.status(500).json({ message: 'Failed to fetch notes' });
    }
  }
  // Tangani request POST (untuk menambah catatan baru)
  else if (req.method === 'POST') {
    const { title, content } = req.body; // Ambil data dari body request

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }

    try {
      const externalApiResponse = await fetch('https://service.pace11.my.id/api/note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Periksa dokumentasi API Notes apakah ada header otorisasi atau API key yang diperlukan untuk POST
        },
        body: JSON.stringify({
          title,
          description: content, // Perhatikan: API Notes mungkin mengharapkan 'description' bukan 'content'
        }),
      });

      const data = await externalApiResponse.json();

      if (!externalApiResponse.ok) {
        console.error('External API error:', data);
        return res.status(externalApiResponse.status).json(data);
      }

      // Opsional: Revalidate halaman SSG notes jika Anda menggunakan ISR
      // Jika Anda ingin data di halaman SSG/ISR (/ssg/notes) diperbarui
      // setelah catatan baru ditambahkan, Anda bisa menggunakan revalidatePath.
      // Namun, untuk Pages Router, metode yang lebih umum adalah `res.revalidate()`
      // jika Anda punya path spesifik yang perlu di-revalidate.
      // Untuk contoh ini, kita asumsikan Anda tidak menggunakan ISR untuk /ssg/notes.
      // Jika Anda menggunakan ISR dengan 'revalidate' di getStaticProps
      // dan ingin trigger revalidation dari API Route, Anda perlu konfigurasi lebih lanjut
      // dan pastikan Next.js tahu path mana yang perlu divalidasi ulang.

      res.status(201).json({ message: 'Note created successfully!', note: data });
    } catch (error) {
      console.error('Error creating note:', error);
      res.status(500).json({ message: 'Failed to create note' });
    }
  }
  // Tangani metode HTTP lainnya
  else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}