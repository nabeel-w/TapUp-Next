"use client"
import Navbar from "@/components/NavBar";
import Sidebar from "@/components/SideMenu";
import { useSession } from "next-auth/react";

export default function Layout({ children }: Readonly<{ children: React.ReactNode; }>) {
    const session = useSession();

    return (
        <>
        {session.status==='unauthenticated' && <Navbar/>}
        <main className="flex min-h-max bg-gray-900 text-white">
            {session.status==='authenticated' && <Sidebar/>}
            {children}
        </main>
        </>
    );
}