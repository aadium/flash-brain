"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/app/widgets/header";

interface User {
    name: string;
    email: string;
}

export default function SelfUserPage() {
    const [user, setUser] = useState<User | null>(null);
    const [editedName, setEditedName] = useState("");
    const [editedEmail, setEditedEmail] = useState("");
    const [loading, setLoading] = useState(true); // Initial loading state
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
        checkAuth();
    }, [router]);

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/user/self/put", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ name: editedName, email: editedEmail })
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            alert("Profile updated successfully");
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
            <Header />
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
                <h1 className="text-4xl mb-4">User Information</h1>
                <div className="flex flex-col w-3/5">
                    <div className="flex flex-col items-center my-4">
                        <div className="flex flex-col w-full mt-4">
                            <label className="text-sm text-gray-300">Name</label>
                            <input
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
                            />
                            <label className="text-sm text-gray-300">Email</label>
                            <input
                                type="email"
                                value={editedEmail}
                                onChange={(e) => setEditedEmail(e.target.value)}
                                className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
                            />
                            <button
                                onClick={handleSave}
                                className="w-full py-2 mt-2 rounded bg-blue-600 hover:bg-blue-700"
                            >
                                {loading ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}