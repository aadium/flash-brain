"use client";
import Link from "next/link";
import {useRouter} from "next/navigation";
export default function Header() {
    const router = useRouter();
    const logout = () => {
        const confirm = window.confirm("Are you sure you want to logout?");
        if (!confirm) return;
        localStorage.removeItem("token");
        router.push("/login");
    };
    return (
        <nav className="bg-gray-800 py-2 pl-4 pr-2 fixed w-full">
            <ul className="flex justify-between flex-row items-center">
                <li><Link href="/"><h2 className="text-xl">Flash Brain</h2></Link></li>
                <div className="flex flex-row items-center space-x-4">
                    <li><Link href="/create"><span className="text-white">Create</span></Link></li>
                    <li><button onClick={logout} className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded-md">Logout</button></li>
                </div>
            </ul>
        </nav>
    );
}