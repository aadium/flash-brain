"use client";
import Link from "next/link";

interface User {
    name: string;
    email: string;
    profilePicChoice: number;
}

export default function LandHeader() {
    return (
        <nav className="fixed w-full p-2 blurbg">
            <ul className="flex justify-between flex-row items-center">
                <li><h2 className="text-3xl font-semibold text-blue-300 ml-4">Flash Brain</h2></li>
                <div className="flex flex-row items-center space-x-4">
                    <li>
                        <Link href="/dashboard">
                            <button className="text-white text-lg px-8 py-2 m-2 rounded-md">
                                Dashboard
                            </button>
                        </Link>
                    </li>
                </div>
            </ul>
        </nav>
    );
}