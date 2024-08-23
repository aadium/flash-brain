"use client";
import {useRouter, useParams} from "next/navigation";
import {useEffect, useState} from "react";
import Header from "@/app/widgets/header";
import {FaEdit} from "react-icons/fa";
import FlipCard from "@/app/widgets/flashcard";

interface Author {
    name: string;
    email: string;
}

export default function FlashSetPage() {
    const router = useRouter();
    const {id} = useParams();
    const [userId, setUserId] = useState("");
    const [author, setAuthor] = useState<Author>({name: "", email: ""});
    const [flashCardUserId, setFlashCardUserId] = useState("");
    const [flashCards, setFlashCards] = useState([]);
    const [flashSetName, setFlashSetName] = useState("");

    useEffect(() => {
        const getAuthor = async (userId: any) => {
            const res = await fetch(`/api/user/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                console.log(data);
                setAuthor(data);
            }
        }
        const fetchFlashCards = async (userId: String) => {
            const res = await fetch(`/api/flash/get/set/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            const data = await res.json();
            setFlashCards(data.flashSet.set);
            setFlashCardUserId(data.flashSet.userId);
            await getAuthor(data.flashSet.userId);
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
            <main className="flex-grow p-4 mt-24">
                <div className="flex flex-col mb-4 w-full justify-center items-center">
                    <div className="flex flex-row mb-4 w-full justify-center items-center">
                        <h2 className="text-4xl mr-4 text-center">{flashSetName}</h2>
                    </div>
                    <h3 className="text-xl text-gray-400 flex flex-col">
                        {
                            (userId !== flashCardUserId) ? (
                                <button onClick={() => router.push(`/user/${flashCardUserId}`)} className="hover:underline">
                                    {author.name}
                                </button>
                            ) : (
                                author.name
                            )
                        }
                    </h3>
                </div>
                <div className="flex justify-center items-center">
                    <div className="flex flex-col gap-4 w-4/5">
                        {flashCards.map((flashCard: any) => (
                            <FlipCard key={flashCard._id} id={flashCard._id} question={flashCard.question} answer={flashCard.answer} />
                        ))}
                        {userId === flashCardUserId && (
                            <div className="flex justify-center items-center">
                                <button
                                className="text-white border border-gray-700 px-10 py-2 w-min rounded-md bg-gray-800 hover:bg-gray-700 transition duration-150"
                                onClick={() => router.push(`/${id}/edit`)}
                        >
                        Edit
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
);
}