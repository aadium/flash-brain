import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/api/utils/mongodb';
import FlashSet from '@/app/api/models/FlashSet';

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const flashSetId = req.nextUrl.pathname.split('/').pop();
        const userId = req.nextUrl.searchParams.get('userId');
        if (!flashSetId || !userId) {
            return NextResponse.json({ error: 'Flash set ID and user ID are required' }, { status: 400 });
        }

        const flashSet = await FlashSet.findById(flashSetId);
        if (!flashSet) {
            return NextResponse.json({ error: 'Flash set not found' }, { status: 404 });
        }

        return NextResponse.json({ flashSet });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}