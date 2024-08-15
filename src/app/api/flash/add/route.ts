import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/api/utils/mongodb';
import FlashSet from '@/app/api/models/FlashSet';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { userId, name, set } = await req.json();
        if (!userId || !name || !set) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }
        const flashSet = new FlashSet({ userId, name, set });
        await flashSet.save();
        return NextResponse.json({ flashSet });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}