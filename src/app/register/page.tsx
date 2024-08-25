"use client";
import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {Analytics} from "@vercel/analytics/next";

export default function Register() {
    const [error, setError] = useState<string>();
    const router = useRouter();
    const ref = useRef<HTMLFormElement>(null);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const response = await fetch("/api/auth/register", {
            method: "POST",
            body: JSON.stringify({
                name: formData.get("name"),
                email: formData.get("email"),
                password: formData.get("password")
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.ok) {
            const { token } = await response.json();
            localStorage.setItem("token", token);
            router.push("/");
        } else {
            const { error } = await response.json();
            setError(error);
        }
    };

    return (
        <section className="w-full h-screen flex items-center justify-center bg-gray-900">
            <Analytics />
            <form
                className="p-6 w-full max-w-[400px] flex flex-col justify-between items-center gap-2
        border border-solid border-gray-700 bg-gray-800 rounded"
                onSubmit={handleSubmit}>
                <h1 className="mb-5 w-full text-2xl font-bold text-white">Sign Up</h1>

                <label className="w-full text-sm text-gray-300">Full Name</label>
                <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full border border-solid border-gray-700 text-[13px] rounded p-2 bg-gray-800 text-white"
                    name="name"
                />

                <label className="w-full text-sm text-gray-300">Email</label>
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full border border-solid border-gray-700 text-[13px] rounded p-2 bg-gray-800 text-white"
                    name="email"
                />

                <label className="w-full text-sm text-gray-300">Password</label>
                <input
                    type="password"
                    placeholder="Enter your password"
                    className="w-full border border-solid border-gray-700 text-[13px] rounded p-2 bg-gray-800 text-white"
                    name="password"
                />

                {error && <div className="text-red-500">{error}</div>}
                <button className="w-full bg-gray-700 py-1.5 mt-2.5 rounded
        transition duration-150 ease hover:bg-gray-600 text-white">
                    Register
                </button>

                <Link href="/login"
                      className="text-sm text-gray-400 transition duration-150 ease hover:text-white">
                    Already have an account?
                </Link>
            </form>
        </section>
    );
}