"use client"
import Sidebar from "@/components/SideMenu";
import { SessionProvider } from "next-auth/react";

export default function Layout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (

        <main className="flex min-h-screen bg-gray-900 text-white">
            <SessionProvider>
                <Sidebar />
                {children}
            </SessionProvider>
        </main>
    );
}