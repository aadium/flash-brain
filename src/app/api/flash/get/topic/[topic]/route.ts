import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/api/utils/mongodb';
import FlashSet from '@/app/api/models/FlashSet';

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const topic = decodeURIComponent(req.nextUrl.pathname.split('/').pop() || '');
        if (!topic) {
            return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
        }

        const flashSets = await FlashSet.find({ name: { $regex: topic, $options: 'i' } });
        return NextResponse.json(flashSets);
    } catch (error) {
        console.error('Internal Server Error:', error);
        return NextResponse.json({ error: 'Internal Server Error: ' + error }, { status: 500 });
    }
}