"use client";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import Header from "@/app/widgets/header";
import Link from "next/link";
import {FaPlus, FaTrash, FaSearch} from "react-icons/fa";

export default function Home() {
    const router = useRouter();
    const [userId, setUserId] = useState("");
    const [userFlashCards, setUserFlashCards] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchUserFlashCards = async (userId: String) => {
        const res = await fetch("/api/flash/get", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
        const data = await res.json();
        setUserFlashCards(data.flashSets);
    }

    useEffect(() => {
        const checkAuth = async () => {
            if (!localStorage.getItem("token")) {
                return
            } else {
                const res = await fetch("/api/auth/check", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                if (!res.ok) {
                    return
                } else {
                    const result = await res.json();
                    setUserId(result.decoded.id);
                    await fetchUserFlashCards(result.decoded.id);
                }
            }
        };
        checkAuth();
    }, [router]);

    const handleSearch = () => {
        router.push(`/search?query=${searchQuery}`);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-900 text-white">
            <Header/>
            <header className="flex flex-col items-center justify-center flex-grow mt-10">
                <h1 className="text-4xl mb-4">Welcome to Flash Brain</h1>
                <p className="text-xl">Instantly generate flashcards of the provided topic</p>
            </header>
            <div className="flex flex-row items-center justify-between p-4">
                <div className="flex w-full">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full border-2 border-solid border-gray-700 border-r-gray-800 text-[15px] rounded-l p-2 bg-gray-800 text-white"
                        placeholder="Search flashcard sets..."
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-gray-800 border-2 border-gray-700 hover:bg-gray-700 p-2 rounded-r flex-shrink-0 transition duration-150"
                    >
                        <FaSearch />
                    </button>
                </div>
            </div>
            <section className="flex-grow p-4">
                <div className="flex flex-row mb-4">
                    <h2 className="text-2xl mr-3">Your Flash Sets</h2>
                    <Link href={
                        userId ? "/create" : "/login"
                    }>
                        <button className="bg-gray-800 hover:bg-gray-700 border border-gray-700 transition duration-150 p-2 rounded mb-4"><FaPlus/></button>
                    </Link>
                </div>
                {
                    userId ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {
                                userFlashCards.map((flashCard: any) => (
                                    <div key={flashCard._id}
                                         className="relative bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer group"
                                         onClick={() => router.push(`/${flashCard._id}`)}>
                                        <h3 className="text-xl font-semibold">{flashCard.name}</h3>
                                        <h5 className="text-sm text-gray-400">{flashCard.set.length} Flashcard(s)</h5>
                                        <button
                                            type="button"
                                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-700 transition duration-150 p-2 rounded-full opacity-100"
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                const confirmDelete = confirm("Are you sure you want to delete this flash set?");
                                                if (confirmDelete) {
                                                    const res = await fetch(`/api/flash/delete/${flashCard._id}`, {
                                                        method: "DELETE",
                                                        headers: {
                                                            Authorization: `Bearer ${localStorage.getItem("token")}`
                                                        }
                                                    })
                                                    if (res.ok) {
                                                        alert("Flashcard set deleted successfully");
                                                        await fetchUserFlashCards(userId);
                                                    }
                                                } else {
                                                    return;
                                                }
                                            }}
                                        >
                                            <FaTrash className="text-white"/>
                                        </button>
                                    </div>
                                ))
                            }
                        </div>
                    ) : (
                        <div className="text-center text-gray-400">
                            <p>You are not logged in. Please <a href='/login'>login</a> or <a
                                href='/register'>Register</a> to view your flashcards.</p>
                        </div>
                    )
                }
            </section>
        </div>
    );
}