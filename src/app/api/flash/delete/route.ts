import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/api/utils/mongodb';
import FlashSet from '@/app/api/models/FlashSet';

export async function DELETE(req: NextRequest) {
    try {
        await connectDB();

        const userId = req.nextUrl.searchParams.get('userId');
        const setId = req.nextUrl.searchParams.get('setId');
        if (!userId || !setId) {
            return NextResponse.json({ error: 'User ID and Set ID are required' }, { status: 400 });
        }

        const flashSet = await FlashSet.findOneAndDelete({ userId, _id: setId });
        if (!flashSet) {
            return NextResponse.json({ error: 'Flash set not found' }, { status: 404 });
        }

        return NextResponse.json({ flashSet });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}