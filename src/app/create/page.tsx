"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Header from "@/app/widgets/header";
import { FaPlus, FaTrash } from "react-icons/fa";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function CreateFlashSetPage() {
    const router = useRouter();
    const [userId, setUserId] = useState("");
    const [flashSetName, setFlashSetName] = useState("");
    const [flashCards, setFlashCards] = useState([{ question: "", answer: "" }]);
    const [flashCardCount, setFlashCardCount] = useState(1);
    const [generateLoading, setGenerateLoading] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [content, setContent] = useState("");

    const handleFlashCardChange = (index: number, field: string, value: string) => {
        const newFlashCards = [...flashCards];
        // @ts-ignore
        newFlashCards[index][field] = value;
        setFlashCards(newFlashCards);
    };

    const generateUsingAI = async () => {
        setGenerateLoading(true);
        try {
            if (!content) {
                alert("Content is required");
                return;
            }
            if (flashCardCount < 1) {
                alert("Card count should be greater than 0");
                return;
            }
            const res = await fetch(`/api/flash/generateJson`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ content, flashCardCount })
            });
            const data = await res.json();
            setFlashCards(data.flashcards);
        } catch (error) {
            alert("Error generating flashcards");
            console.error(error);
        } finally {
            setGenerateLoading(false);
            setShowDialog(false);
        }
    }

    const extractFromCSV = async (file: File) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target?.result as string;
            const lines = text.split("\n");
            const newFlashCards = lines.map((line) => {
                const [question, answer] = line.split(",");
                return { question, answer };
            });
            setFlashCards(newFlashCards);
        };
        reader.readAsText(file);
    };

    const extractFromPDF = async (file: File) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            const typedArray = new Uint8Array(e.target?.result as ArrayBuffer);
            const pdf = await pdfjsLib.getDocument(typedArray).promise;
            let extractedText = "";

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(" ");
                extractedText += pageText + "\n";
            }

            setContent(extractedText);
            setShowDialog(true); // Show dialog with extracted text
        };
        reader.readAsArrayBuffer(file);
    };

    const addFlashCard = () => {
        setFlashCards([...flashCards, { question: "", answer: "" }]);
    };

    const removeFlashCard = (index: number) => {
        const newFlashCards = flashCards.filter((_, i) => i !== index);
        setFlashCards(newFlashCards);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!flashSetName) {
            alert("Flashcard set name is required");
            return;
        }
        const res = await fetch("/api/flash/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({ name: flashSetName, set: flashCards })
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
            <main className="flex-grow p-4 flex justify-center items-center mt-20">
                <div className="w-full max-w-lg">
                    <h2 className="text-4xl my-4 text-center">Create Flashcard Set</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Flashcard Set Name"
                            value={flashSetName}
                            onChange={(e) => setFlashSetName(e.target.value)}
                            className="w-full border-2 border-solid border-gray-700 text-[15px] rounded p-2 bg-gray-800 text-white"
                            required
                        />
                        <div className="flex flex-row gap-4 justify-center w-full">
                            <input
                                type="file"
                                id="csvFile"
                                accept=".csv"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        const file = e.target.files[0];
                                        if (file.type === "text/csv" || file.name.endsWith(".csv")) {
                                            extractFromCSV(file);
                                        } else {
                                            alert("Please upload a valid CSV file.");
                                        }
                                    }
                                }}
                                className="hidden"
                            />
                            <label htmlFor="csvFile" className="bg-green-600 hover:bg-green-700 transition duration-150 text-center p-2 rounded cursor-pointer w-full">Upload CSV</label>

                            <input
                                type="file"
                                id="pdfFile"
                                accept=".pdf"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        const file = e.target.files[0];
                                        if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
                                            extractFromPDF(file);
                                        } else {
                                            alert("Please upload a valid PDF file.");
                                        }
                                    }
                                }}
                                className="hidden"
                            />
                            <label htmlFor="pdfFile" className="bg-blue-600 hover:bg-blue-700 transition duration-150 text-center p-2 rounded cursor-pointer w-full">Upload PDF</label>

                            <button
                                type="button"
                                onClick={() => setShowDialog(true)}
                                className="bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 p-2 rounded w-full transition duration-150">
                                {generateLoading ? "Generating..." : "Generate"}
                            </button>
                        </div>
                        {flashCards.map((flashCard, index) => (
                            <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col gap-2">
                                <div className='flex flex-row'>
                                    <button type="button" onClick={() => removeFlashCard(index)}
                                            className="bg-red-500 w-min hover:bg-red-700 p-2 mr-2 rounded flex items-center justify-center">
                                        <FaTrash />
                                    </button>
                                    <input
                                        type="text"
                                        placeholder="Question"
                                        value={flashCard.question}
                                        onChange={(e) => handleFlashCardChange(index, "question", e.target.value)}
                                        className="w-full text-[13px] rounded p-2 bg-gray-700 text-white"
                                        required
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Answer"
                                    value={flashCard.answer}
                                    onChange={(e) => handleFlashCardChange(index, "answer", e.target.value)}
                                    className="w-full text-[13px] rounded p-2 bg-gray-700 text-white"
                                    required
                                />
                            </div>
                        ))}
                        <div className='flex flex-row w-full'>
                            <button type="submit" className="bg-gray-700 hover:bg-gray-600 p-2 rounded w-full transition duration-150">Create Set
                            </button>
                            <button type="button" onClick={addFlashCard}
                                    className="bg-blue-500 hover:bg-blue-700 w-10 h-10 ml-4 p-2 rounded flex items-center justify-center transition duration-150">
                                <FaPlus />
                            </button>
                        </div>
                    </form>
                </div>
            </main>
            {showDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-gray-900 border-2 border-gray-700 p-6 rounded-lg shadow-lg w-3/4 max-w-2xl">
                        <h2 className="text-2xl mb-4">Flashcard-generation content</h2>
                        <textarea
                            className="w-full h-64 border-2 border-solid border-gray-600 text-[15px] rounded p-2 bg-gray-800 text-white"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <label>
                            Enter card count
                        </label>
                        <input
                            type='text'
                            className="border ml-2 w-12 border-solid border-gray-700 text-[14px] rounded p-2 bg-gray-800 text-white mr-1"
                            placeholder="Card count"
                            value={flashCardCount}
                            onChange={(e) => setFlashCardCount(Number(e.target.value))}
                        />
                        <div className="flex justify-end mt-4">
                            <button onClick={() => setShowDialog(false)} className="bg-red-500 hover:bg-red-600 transition duration-150 px-4 py-2 rounded mr-2">Cancel</button>
                            <button onClick={generateUsingAI} className="bg-gradient-to-r from-purple-600 to-indigo-700 hover:bg-gradient-to-r hover:from-purple-700 hover:to-indigo-800 rounded transition duration-150 px-4 py-2">
                                {generateLoading ? "Generating..." : "Generate Flashcards"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}