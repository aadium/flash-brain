"use client";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/app/widgets/header";
import { FaSearch } from "react-icons/fa";

function SearchResultsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get("query");
    const [flashSets, setFlashSets] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [token, setToken] = useState("");

    useEffect(() => {
        setToken(localStorage.getItem("token") || "");
        setSearchQuery(query || "");
        const fetchSearchResults = async () => {
            const res = await fetch(`/api/flash/get/topic/${encodeURIComponent(query || "")}`);
            const data = await res.json();
            setFlashSets(data);
        };

        if (query) {
            fetchSearchResults();
        }
    }, [query]);

    const handleSearch = () => {
        router.push(`/search?query=${searchQuery}`);
    };

    return (
        <div className="flex flex-col bg-gray-900 text-white">
            <section className="flex-grow p-4 mt-10">
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
                            <FaSearch/>
                        </button>
                    </div>
                </div>
                <h2 className="text-2xl mb-4">Search Results for <b>{query}</b></h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {flashSets.map((flashSet: any) => (
                        <div key={flashSet._id}
                             className="bg-gray-800 p-4 rounded-lg shadow-md cursor-pointer"
                             onClick={() => router.push(
                                 token ? `/${flashSet._id}` : "/login"
                             )}>
                            <h3 className="text-xl font-semibold">{flashSet.name}</h3>
                            <h5 className="text-sm text-gray-400">{flashSet.set.length} Flashcard(s)</h5>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default function SearchResults() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-900 text-white">
            <Header />
            <Suspense fallback={<div>Loading...</div>}>
                <SearchResultsContent />
            </Suspense>
        </div>
    );
}