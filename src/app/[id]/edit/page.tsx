"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/app/widgets/header";
import { FaTrash } from "react-icons/fa";

export default function FlashSetPage() {
    const router = useRouter();
    const { id } = useParams();
    const [userId, setUserId] = useState("");
    const [flashCards, setFlashCards] = useState([{ question: "", answer: "" }]);
    const [flashSetName, setFlashSetName] = useState("");

    useEffect(() => {
        const fetchFlashCards = async (userId: String) => {
            const res = await fetch(`/api/flash/get/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            const data = await res.json();
            if (data.flashSet.userId !== userId) {
                router.push(`/${id}`);
            } else {
                setFlashCards(data.flashSet.set);
                setFlashSetName(data.flashSet.name);
            }
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

    const handleFlashCardChange = (index: number, field: string, value: string) => {
        const newFlashCards = [...flashCards];
        // @ts-ignore
        newFlashCards[index][field] = value;
        setFlashCards(newFlashCards);
    };

    const addFlashCard = () => {
        setFlashCards([...flashCards, { question: "", answer: "" }]);
    };

    const removeFlashCard = (index: number) => {
        const newFlashCards = flashCards.filter((_, i) => i !== index);
        setFlashCards(newFlashCards);
    };

    const updateFlashCards = async () => {
        try {
            await fetch('/api/flash/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    setId: id,
                    name: flashSetName,
                    set: flashCards
                })
            });
            alert('Flashcards updated successfully');
        } catch (error) {
            console.error('Error updating flashcards:', error);
            alert('Error updating flashcards');
        }
    };

    const cancelChanges = async () => {
        const res = await fetch(`/api/flash/get/${id}/?userId=${userId}`);
        const data = await res.json();
        setFlashCards(data.flashSet.set);
        setFlashSetName(data.flashSet.name);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-900 text-white">
            <Header />
            <main className="flex-grow p-4">
                <button onClick={() => router.back()} className="mb-4 bg-gray-800 p-2 rounded">Back</button>
                <h2 className="text-4xl my-4 text-center">{flashSetName}</h2>
                <form className="flex flex-col gap-4">
                    {flashCards.map((flashCard, index) => (
                        <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center">
                            <input
                                type="text"
                                placeholder="Question"
                                value={flashCard.question}
                                onChange={(e) => handleFlashCardChange(index, "question", e.target.value)}
                                className="bg-gray-700 p-2 rounded flex-grow mr-2"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Answer"
                                value={flashCard.answer}
                                onChange={(e) => handleFlashCardChange(index, "answer", e.target.value)}
                                className="bg-gray-700 p-2 rounded flex-grow ml-2"
                                required
                            />
                            <button type="button" onClick={() => removeFlashCard(index)} className="bg-red-500 hover:bg-red-700 p-2 rounded ml-2">
                                <FaTrash />
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addFlashCard} className="bg-blue-500 hover:bg-blue-700 p-2 rounded">Add Flashcard</button>
                    <div className="flex gap-4">
                        <button type="button" onClick={updateFlashCards} className="bg-green-500 hover:bg-green-700 p-2 rounded">Save</button>
                        <button type="button" onClick={cancelChanges} className="bg-gray-500 hover:bg-gray-700 p-2 rounded">Cancel</button>
                    </div>
                </form>
            </main>
        </div>
    );
}