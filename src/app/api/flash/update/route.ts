import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/api/utils/mongodb';
import FlashSet from '@/app/api/models/FlashSet';

export async function PUT(req: NextRequest) {
    try {
        await connectDB();

        const { userId, setId, name, set } = await req.json();

        if (!userId || !setId || !name || !set) {
            return NextResponse.json({ error: 'User ID, Set ID, name, and set are required' }, { status: 400 });
        }

        const flashSet = await FlashSet.findOneAndUpdate({ userId, _id: setId }, { name, set }, { new: true });

        if (!flashSet) {
            return NextResponse.json({ error: 'Flash set not found' }, { status: 404 });
        }

        return NextResponse.json({ flashSet });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}