'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/widgets/header";
import {FaEdit} from "react-icons/fa";

interface User {
    name: string;
    email: string;
    profilePicChoice: number;
}

export default function SelfUserPage() {
    const [user, setUser] = useState<User | null>(null);
    const [editedName, setEditedName] = useState("");
    const [editedEmail, setEditedEmail] = useState("");
    const [loading, setLoading] = useState(true); // Initial loading state
    const [showModal, setShowModal] = useState(false);
    const [selectedPic, setSelectedPic] = useState<number | null>(null);
    const [availablePics, setAvailablePics] = useState<string[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            const res = await fetch("/api/user/self/get", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data);
                setEditedName(data.name);
                setEditedEmail(data.email);
            }
            setLoading(false); // Set loading to false after fetching data
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
                if (!res.ok) {
                    router.push("/login");
                } else {
                    await fetchUserData();
                }
            }
        };

        const fetchAvailablePics = async () => {
            const res = await fetch("/api/profileImages");
            if (res.ok) {
                const data = await res.json();
                setAvailablePics(data);
            }
        };

        checkAuth();
        fetchAvailablePics();
    }, [router]);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const handlePicSelect = (pic: number) => setSelectedPic(pic);

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/user/self/put", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ name: editedName, email: editedEmail, profilePicChoice: selectedPic })
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data);
            }
        } catch (error) {
            alert("An error occurred: " + error);
            console.error(error);
        } finally {
            setLoading(false);
            alert("Profile updated successfully");
        }
    };

    const handleSetPic = () => {
        if (selectedPic !== null) {
            setUser((prevUser) => prevUser ? { ...prevUser, profilePicChoice: selectedPic } : null);
            closeModal();
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-white bg-gray-900">Loading...</div>;
    }

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center text-white bg-gray-900">Loading...</div>;
    }

    return (
    <div className="bg-gray-900 text-white">
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
            <h1 className="text-3xl sm:text-4xl mb-4">User Information</h1>
            <div className="flex flex-col w-full sm:w-2/5">
                <div className="flex flex-col items-center my-4">
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32">
                        <img
                            src={
                                user.profilePicChoice
                                    ? '/profileImages/' + user.profilePicChoice.toString() + '.jpg'
                                    : "/profile.jpg"
                            }
                            alt="User"
                            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-blue-500"
                        />
                        <button
                            onClick={openModal}
                            className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 transition duration-150 p-2 rounded-full text-lg sm:text-xl"
                        >
                            <FaEdit />
                        </button>
                    </div>
                    <div className="flex flex-col w-full mt-4">
                        <label className="text-sm text-gray-300">Name</label>
                        <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="w-full border border-solid border-gray-700 rounded p-2 mb-2 bg-gray-800 text-white"
                        />
                        <label className="text-sm text-gray-300">Email</label>
                        <input
                            type="email"
                            value={editedEmail}
                            onChange={(e) => setEditedEmail(e.target.value)}
                            className="w-full border border-solid border-gray-700 rounded p-2 mb-6 bg-gray-800 text-white"
                        />
                        <button
                            onClick={handleSave}
                            className="w-full bg-gray-700 py-2 text-lg rounded transition duration-150 ease hover:bg-gray-600 text-white"
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-gray-900 border-2 border-gray-700 p-6 rounded-lg shadow-lg w-11/12 sm:w-3/4 max-w-2xl">
                    <h2 className="text-xl sm:text-2xl mb-4">Choose Profile Picture</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {availablePics.map((pic) => (
                            <img
                                key={pic}
                                src={`/profileImages/${pic}`}
                                alt={`Profile ${pic}`}
                                className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 ${selectedPic === parseInt(pic.split('.')[0]) ? 'border-blue-500' : 'border-gray-500'} cursor-pointer`}
                                onClick={() => handlePicSelect(parseInt(pic.split('.')[0]))}
                            />
                        ))}
                    </div>
                    <div className="flex justify-end mt-4">
                        <button onClick={closeModal} className="bg-red-500 hover:bg-red-600 transition duration-150 px-4 py-2 rounded mr-2">Close</button>
                        <button onClick={handleSetPic} className="bg-green-500 hover:bg-green-600 transition duration-150 px-4 py-2 rounded">Set</button>
                    </div>
                </div>
            </div>
        )}
    </div>
);
}