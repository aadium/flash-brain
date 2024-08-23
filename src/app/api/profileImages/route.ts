import { NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
    const directoryPath = path.join(process.cwd(), 'public/profileImages');
    try {
        const files = await fs.readdir(directoryPath);
        const imageFiles = files.filter(file => /\.(jpg|jpeg|png|gif)$/.test(file));
        return NextResponse.json(imageFiles);
    } catch (err) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}