import type { NextApiRequest, NextApiResponse } from 'next';
import { forbidden } from 'next/navigation';

type Data = {
    id?: string | string[] | undefined
    name?: string
    message?: string
    data?: object
    headers?: string | string[] | undefined
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
            res.status(200).json({
            id: req?.query?.id,
            name: 'John Doe',
            message: 'Hello, Next.js API!'
        } as Data);
    } 
    
    if (req.method === 'POST') {
        res.status(200).json({
            id: req?.query?.id,
            name: 'John Doe',
            message: 'Hello, Next.js API!',
            data: req.body,
            headers: req.headers['api-token']
        })
    } else {
        res.status(403).json({ message: 'forbidden' })
    }
}