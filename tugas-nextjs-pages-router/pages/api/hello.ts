import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  name: string;
  message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    name: 'John Doe',
    message: 'Hello, Next.js API!'
  } as Data);
}