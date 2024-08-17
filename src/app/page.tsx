"use client";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";

export default function Home() {
    const router = useRouter();
    const [userId, setUserId] = useState("");
    const [userFlashCards, setUserFlashCards] = useState([]);

    const logout = () => {
        localStorage.removeItem("token");
        router.push("/login");
    };

    useEffect(() => {
        const fetchUserFlashCards = async (userId: String) => {
            const res = await fetch("/api/flash/get/?userId=" + userId);
            const data = await res.json();
            setUserFlashCards(data.flashSets);
        }
        const checkAuth = async () => {
            if (!localStorage.getItem("token")) {
                router.push("/login");
            } else {
                const res = await fetch("/api/auth/check", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                const result = await res.json();
                if (result.valid === false) {
                    router.push("/login");
                }
                setUserId(result.decoded.id);
                await fetchUserFlashCards(result.decoded.id);
            }
        };
        checkAuth();
    }, [router]);

    return (
        <div className="min-h-screen flex flex-col bg-gray-900 text-white">
            <nav className="bg-gray-800 p-4">
                <ul className="flex justify-between">
                    <li><Link href="/">Home</Link></li>
                    <li><button onClick={logout}>Logout</button></li>
                </ul>
            </nav>
            <header className="flex flex-col items-center justify-center flex-grow">
                <h1 className="text-4xl mb-4">Welcome to Flash Brain</h1>
                <p className="text-xl">Instantly generate flashcards of the provided topic</p>
            </header>
            <section className="flex-grow p-4">
                <h2 className="text-2xl mb-4">Your Flash Sets</h2>
                {
                    userId && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {
                                userFlashCards.map((flashCard: any) => (
                                    <div key={flashCard._id} className="bg-gray-800 p-4 rounded-lg shadow-md">
                                        <h3 className="text-xl font-semibold">{flashCard.name}</h3>
                                        <h5 className="text-sm text-gray-400">{flashCard.set.length} Flashcards</h5>
                                    </div>
                                ))
                            }
                        </div>
                    )
                }
            </section>
        </div>
    );
}