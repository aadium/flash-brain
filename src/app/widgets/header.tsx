"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";

interface User {
    name: string;
    email: string;
    profilePicChoice: number;
}

export default function Header() {
    const [user, setUser] = useState<User | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const logout = () => {
        const confirm = window.confirm("Are you sure you want to logout?");
        if (!confirm) return;
        localStorage.removeItem("token");
        setUser(null);
        router.push("/login");
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const fetchUserData = async () => {
                setLoading(true);
                try {
                    const res = await fetch("/api/user/self/get", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    if (res.ok) {
                        const data = await res.json();
                        setUser(data);
                    }
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            };
            fetchUserData();
        }
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className="bg-gray-800 fixed w-full border-b-2 border-blue-500">
            <ul className="flex justify-between items-center p-4">
                <li><Link href='/dashboard'><h2 className="text-2xl font-semibold text-blue-300">Flash Brain</h2></Link></li>
                <div className="flex items-center space-x-4">
                    <button onClick={toggleMenu} className="text-white md:hidden">
                        <FaBars className="text-2xl" />
                    </button>
                    {user ? (
                        <>
                            <li className="hidden md:block"><Link href="/create"><span className="text-white">Create</span></Link></li>
                            <li className="hidden md:block relative">
                                <button onClick={toggleMenu}
                                        className="text-white px-4 py-2 border-l-2 border-gray-600 bg-gray-900 flex items-center">
                                    <img
                                        src={
                                            user.profilePicChoice
                                                ? '/profileImages/' + user.profilePicChoice.toString() + '.jpg'
                                                : "/profile.jpg"
                                        }
                                        alt="User"
                                        className="w-10 h-10 mr-2 rounded-full border-2 border-blue-500"
                                    />
                                    {user.name}
                                </button>
                                {menuOpen && (
                                    <div className="absolute right-0 w-44 bg-gray-800 shadow-lg z-10 border border-gray-600">
                                        <Link href="/user/self"
                                              className="block px-4 py-2 text-white hover:bg-gray-700 transition duration-150">Profile</Link>
                                        <button onClick={logout}
                                                className="block w-full text-left px-4 py-2 text-white hover:bg-red-500 transition duration-150">Logout</button>
                                    </div>
                                )}
                            </li>
                        </>
                    ) : (
                        <li className="hidden md:block">
                            <Link href="/login">
                                <button className="text-white px-4 py-2 my-2 rounded-md bg-gray-700">
                                    Login
                                </button>
                            </Link>
                            <Link href="/register">
                                <button className="text-white px-4 py-2 m-2 rounded-md bg-gray-900">
                                    Register
                                </button>
                            </Link>
                        </li>
                    )}
                </div>
            </ul>
            {menuOpen && (
                <div className="md:hidden bg-gray-800 border-t border-gray-600">
                    {user ? (
                        <>
                            <Link href="/create"
                                  className="block px-4 py-2 text-white hover:bg-gray-700 transition duration-150">Create</Link>
                            <Link href="/user/self"
                                  className="block px-4 py-2 text-white hover:bg-gray-700 transition duration-150">Profile</Link>
                            <button onClick={logout}
                                    className="block w-full text-left px-4 py-2 text-white hover:bg-red-500 transition duration-150">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link href="/login"
                                  className="block px-4 py-2 text-white hover:bg-gray-700 transition duration-150">Login</Link>
                            <Link href="/register"
                                  className="block px-4 py-2 text-white hover:bg-gray-700 transition duration-150">Register</Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}