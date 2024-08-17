import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/api/utils/mongodb';
import FlashSet from '@/app/api/models/FlashSet';
import jwt, {JwtPayload} from "jsonwebtoken";

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const flashSetId = req.nextUrl.pathname.split('/').pop();
        const token = req.headers.get('Authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ error: 'Authorization token is required' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        if (!decoded) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }
        const userId = decoded.id;
        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }
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