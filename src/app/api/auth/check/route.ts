import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/api/utils/mongodb';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const token = req.headers.get('Authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ valid: false, error: 'No token provided' }, { status: 401 });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!);
            return NextResponse.json({ valid: true, decoded });
        } catch (error) {
            return NextResponse.json({ valid: false, error: 'Invalid token' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}