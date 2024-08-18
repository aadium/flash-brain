"use client";
import {FormEvent, useState} from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";

export default function Login() {
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const response = await fetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify({
                email: formData.get("email"),
                password: formData.get("password")
            }),
            headers: {
                "Content-Type": "application/json"
            }});
        if (response.ok) {
            const {token} = await response.json();
            localStorage.setItem("token", token);
            router.push("/");
        } else {
            const {error} = await response.json();
            setError(error);
        }
    };

    return (
        <section className="w-full h-screen flex items-center justify-center bg-gray-900">
            <form
                className="p-6 w-full max-w-[400px] flex flex-col justify-between items-center gap-2
        border border-solid border-gray-700 bg-gray-800 rounded"
                onSubmit={handleSubmit}>
                <h1 className="mb-5 w-full text-2xl font-bold text-white">Sign In</h1>
                <label className="w-full text-sm text-gray-300">Email</label>
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full h-8 border border-solid border-gray-700 rounded text-[13px] p-2 bg-gray-700 text-white"
                    name="email"/>
                <label className="w-full text-sm text-gray-300">Password</label>
                <div className="flex w-full">
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full h-8 border border-solid border-gray-700 rounded text-[13px] p-2 bg-gray-700 text-white"
                        name="password"/>
                </div>
                {error && <div className="text-red-500">{error}</div>}
                <button className="w-full border border-solid border-gray-700 py-1.5 mt-2.5 rounded
        transition duration-150 ease hover:bg-gray-700 text-white">
                    Sign In
                </button>

                <Link
                    href="/register"
                    className="text-sm text-gray-400 transition duration-150 ease hover:text-white">
                    Do not have an account?
                </Link>
            </form>
        </section>
    );
};