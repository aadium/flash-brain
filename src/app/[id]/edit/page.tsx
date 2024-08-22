"use client";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Header from "@/app/widgets/header";
import {FaPlus, FaTrash} from "react-icons/fa";

export default function FlashSetPage() {
    const router = useRouter();
    const { id } = useParams();
    const [userId, setUserId] = useState("");
    const [flashCards, setFlashCards] = useState([{ question: "", answer: "" }]);
    const [flashSetName, setFlashSetName] = useState("");

    useEffect(() => {
        const fetchFlashCards = async (userId: String) => {
            const res = await fetch(`/api/flash/get/set/${id}`, {
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
        const res = await fetch(`/api/flash/get/set/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });
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
                <div className="flex justify-center items-center">
                    <form className="flex flex-col gap-4 w-4/5">
                        {flashCards.map((flashCard, index) => (
                            <div key={index}
                                 className="bg-gray-800 p-2 rounded-lg shadow-md flex justify-between items-center">
                            <textarea
                                placeholder="Question"
                                value={flashCard.question}
                                onChange={(e) => handleFlashCardChange(index, "question", e.target.value)}
                                className="w-full border border-solid border-gray-700 text-[14px] rounded p-2 bg-gray-800 text-white mr-1"
                                required
                            />
                                <textarea
                                    placeholder="Answer"
                                    value={flashCard.answer}
                                    onChange={(e) => handleFlashCardChange(index, "answer", e.target.value)}
                                    className="w-full border border-solid border-gray-700 text-[14px] rounded p-2 bg-gray-800 text-white ml-1"
                                    required
                                />
                                <FaTrash onClick={() => removeFlashCard(index)}
                                         className='m-2 text-red-400 hover:text-red-600 w-10 transition duration-150 cursor-pointer'/>
                            </div>
                        ))}
                        <div className="flex gap-4 justify-center items-center">
                            <button type="button" onClick={updateFlashCards}
                                    className="bg-green-700 w-1/4 hover:bg-green-600 p-2 rounded transition duration-150">Save
                            </button>
                            <button type="button" onClick={cancelChanges}
                                    className="bg-red-800 w-1/4 hover:bg-red-700 p-2 rounded transition duration-150">Cancel
                            </button>
                            <button type="button" onClick={addFlashCard}
                                    className="bg-blue-500 hover:bg-blue-700 w-10 h-10 p-2 rounded flex items-center justify-center transition duration-150">
                                <FaPlus/>
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}