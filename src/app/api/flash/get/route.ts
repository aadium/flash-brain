import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/api/utils/mongodb';
import FlashSet from '@/app/api/models/FlashSet';

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const userId = req.nextUrl.searchParams.get('userId');
        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const flashSets = await FlashSet.find({ userId });
        return NextResponse.json({ flashSets });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}