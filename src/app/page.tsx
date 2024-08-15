"use client";
import {signOut, useSession} from "next-auth/react";
import Link from "next/link";
import {useRouter} from "next/navigation";

export default function Home() {
    const {status} = useSession();
    const router = useRouter();

    const showSession = () => {
        if (status === "authenticated") {
            return (
                <button
                    className="border border-solid border-gray-700 rounded text-white bg-gray-800 py-1 px-3 transition duration-150 ease hover:bg-gray-700"
                    onClick={() => {
                        signOut({redirect: false}).then(() => {
                            router.push("/");
                        });
                    }}
                >
                    Sign Out
                </button>
            )
        } else if (status === "loading") {
            return (
                <span className="text-gray-400 text-sm mt-7">Loading...</span>
            )
        } else {
            return (
                <Link
                    href="/login"
                    className="border border-solid border-gray-700 rounded text-white bg-gray-800 py-1 px-3 transition duration-150 ease hover:bg-gray-700"
                >
                    Sign In
                </Link>
            )
        }
    }
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
            <h1 className="text-xl">Home</h1>
            {showSession()}
        </main>
    );
}