import {NextRequest, NextResponse} from 'next/server';
import {connectDB} from '@/app/api/utils/mongodb';
import User from '@/app/api/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const {email, password} = await req.json();

        // Find the user in the 'users' collection
        const user = await User.findOne({email}).select('+password');
        if (!user) {
            return NextResponse.json({error: 'Invalid email or password'}, {status: 401});
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return NextResponse.json({error: 'Invalid email or password'}, {status: 401});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET!, {expiresIn: '3h'});

        return NextResponse.json({token: token});
    } catch (error) {
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
    }
}