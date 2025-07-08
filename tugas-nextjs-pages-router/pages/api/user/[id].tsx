import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  id: string | string[] | undefined;
  name: string;
  message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    id: req?.query?.id,
    name: 'John Doe',
    message: 'Hello, Next.js API!'
  } as Data);
}