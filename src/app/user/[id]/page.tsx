"use client";
import { useEffect, useState } from "react";
import {useParams, useRouter} from "next/navigation";
import Header from "@/app/widgets/header";

interface User {
    name: string;
    email: string;
    profilePicChoice: number;
}

export default function OtherUserPage() {
    const [user, setUser] = useState<User | null>(null);
    const {id} = useParams();
    const [loading, setLoading] = useState(true); // Initial loading state
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            const res = await fetch(`/api/user/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data);
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
    }, [id, router]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-white bg-gray-900">Loading...</div>;
    }

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center text-white bg-gray-900">Loading...</div>;
    }

    return (
        <div className='text-white'>
            <Header />
            <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center">
                <div className="p-4 text-center">
                    <h1 className="text-4xl mb-4">User Information</h1>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center">
                        <img src={
                            user.profilePicChoice
                                ? '/profileImages/' + user.profilePicChoice.toString() + '.jpg'
                                : "/profile.jpg"
                        } alt="User" className="w-32 h-32 mb-4 rounded-full border-2 border-blue-500"/>
                        <p className="text-2xl font-semibold mb-2">{user.name}</p>
                        <p className="text-lg text-gray-400">{user.email}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}