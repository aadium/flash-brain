"use client";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

export default function Home() {
    const router = useRouter();

    const logout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    useEffect(() => {
        const checkAuth = async () => {
            if (!localStorage.getItem("token")) {
                router.push("/login");
            } else {
                const res = await fetch("/api/auth/check", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                const result = JSON.stringify(await res.json());
                console.log(result);
            }
        };
        checkAuth();
    });

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
            <h1 className="text-xl">Home</h1>
            <button onClick={logout}>Logout</button>
        </main>
    );
}