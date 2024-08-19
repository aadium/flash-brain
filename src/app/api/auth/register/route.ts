import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/app/api/utils/mongodb';
import User from '@/app/api/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { name, email, password } = await req.json();

        // Check if the email format is valid
        if (!isValidEmail(email)) {
            return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET!, { expiresIn: '3h' });

        return NextResponse.json({ token: token });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error: ' + error }, { status: 500 });
    }
}