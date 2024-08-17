"use client";
import {useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import Header from "@/app/widgets/header";

export default function CreateFlashSetPage() {
    const router = useRouter();
    const [userId, setUserId] = useState("");
    const [flashSetName, setFlashSetName] = useState("");
    const [flashCards, setFlashCards] = useState([{question: "", answer: ""}]);

    const handleFlashCardChange = (index: number, field: string, value: string) => {
        const newFlashCards = [...flashCards];
        // @ts-ignore
        newFlashCards[index][field] = value;
        setFlashCards(newFlashCards);
    };

    const generateUsingAI = async () => {
        const res = await fetch(`/api/flash/generate/?topic=${flashSetName}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
        });
        const data = await res.json();
        setFlashCards(data);
    }

    const addFlashCard = () => {
        setFlashCards([...flashCards, {question: "", answer: ""}]);
    };

    const removeFlashCard = (index: number) => {
        const newFlashCards = flashCards.filter((_, i) => i !== index);
        setFlashCards(newFlashCards);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch("/api/flash/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({name: flashSetName, set: flashCards})
        });
        if (res.ok) {
            router.push("/");
        }
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
                const result = await res.json();
                if (result.valid === false) {
                    router.push("/login");
                }
                setUserId(result.decoded.id);
            }
        };
        checkAuth();
    }, [router]);

return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
        <Header />
        <main className="flex-grow p-4 flex justify-center items-center">
            <div className="w-full max-w-lg">
                <h2 className="text-4xl my-4 text-center">Create Flashcard Set</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Flashcard Set Name"
                        value={flashSetName}
                        onChange={(e) => setFlashSetName(e.target.value)}
                        className="bg-gray-800 p-2 rounded"
                        required
                    />
                    <button onClick={generateUsingAI}
                            className="bg-blue-500 hover:bg-blue-700 p-2 rounded">Generate using AI
                    </button>
                    {flashCards.map((flashCard, index) => (
                        <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col gap-2">
                            <input
                                type="text"
                                placeholder="Question"
                                value={flashCard.question}
                                onChange={(e) => handleFlashCardChange(index, "question", e.target.value)}
                                className="bg-gray-700 p-2 rounded"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Answer"
                                value={flashCard.answer}
                                onChange={(e) => handleFlashCardChange(index, "answer", e.target.value)}
                                className="bg-gray-700 p-2 rounded"
                                required
                            />
                            <button type="button" onClick={() => removeFlashCard(index)}
                                    className="bg-red-500 hover:bg-red-700 p-2 rounded">Remove
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addFlashCard}
                            className="bg-blue-500 hover:bg-blue-700 p-2 rounded">Add Flashcard
                    </button>
                    <button type="submit" className="bg-green-500 hover:bg-green-700 p-2 rounded">Create Set
                    </button>
                </form>
            </div>
        </main>
    </div>
);
}