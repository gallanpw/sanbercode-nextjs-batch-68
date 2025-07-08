import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Ambil data dari JSON Placeholder API
      const response = await fetch('https://jsonplaceholder.typicode.com/todos');
      const data = await response.json();

      // Kirim data sebagai respon JSON
      res.status(200).json(data);
    } catch (error) {
      // Tangani error jika terjadi masalah saat mengambil data
      console.error('Error fetching todos:', error);
      res.status(500).json({ message: 'Failed to fetch todos' });
    }
  } else {
    // Jika metode request bukan GET, kirim status 405 Method Not Allowed
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}