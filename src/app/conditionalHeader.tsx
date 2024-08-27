"use client";

import { usePathname } from 'next/navigation';
import Header from "@/app/widgets/header";

export default function ConditionalHeader() {
    const pathname = usePathname();
    const showHeader = !['/login', '/register', '/'].includes(pathname);

    return (
        <>
            {showHeader && <Header />}
        </>
    );
}