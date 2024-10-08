import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ConditionalHeader from "@/app/conditionalHeader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Flash Brain",
    description: "Flash Your Way to a Sharper Brain",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ConditionalHeader />
                {children}
            </body>
        </html>
    );
}