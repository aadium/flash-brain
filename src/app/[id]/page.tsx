"use client";
import {useRouter, useParams} from "next/navigation";
import {useEffect, useState} from "react";
import Header from "@/app/widgets/header";

export default function FlashSetPage() {
    const router = useRouter();
    const {id} = useParams();
    const [userId, setUserId] = useState("");
    const [flashCards, setFlashCards] = useState([]);
    const [flashSetName, setFlashSetName] = useState("");

    useEffect(() => {
        const fetchFlashCards = async (userId: String) => {
            const res = await fetch(`/api/flash/get/${id}/?userId=${userId}`);
            const data = await res.json();
            setFlashCards(data.flashSet.set);
            setFlashSetName(data.flashSet.name);
        };
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
                await fetchFlashCards(result.decoded.id);
            }
        };
        checkAuth();
    }, [id, router]);

    return (
        <div className="min-h-screen flex flex-col bg-gray-900 text-white">
            <Header />
            <main className="flex-grow p-4">
                <button onClick={() => router.back()} className="mb-4 bg-gray-800 p-2 rounded">Back</button>
                <h2 className="text-4xl my-4 text-center">{flashSetName}</h2>
                <div className="flex flex-col gap-4">
                    {flashCards.map((flashCard: any) => (
                        <div key={flashCard._id} className="bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center">
                            <h3 className="text-xl font-semibold">{flashCard.question}</h3>
                            <p className="text-sm text-gray-400">{flashCard.answer}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}