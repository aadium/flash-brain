import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/api/utils/mongodb';
import User from "@/app/api/models/User";

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const token = req.headers.get('Authorization')?.split(' ')[1];
        const otherUserId = decodeURIComponent(req.nextUrl.pathname.split('/').pop() || '');
        if (!token) {
            return NextResponse.json({ error: 'Authorization token is required' }, { status: 401 });
        }

        if (!otherUserId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const user = await User.find({ _id: otherUserId });
        const email = user[0].email;
        const name = user[0].name;
        const profilePicChoice = user[0].profilePicChoice;
        return NextResponse.json({
            email,
            name,
            profilePicChoice
        });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}