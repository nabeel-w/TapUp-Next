"use client"
import Sidebar from "@/components/SideMenu";
import { SessionProvider } from "next-auth/react";

export default function Layout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (

        <main className="flex flex-row">
            <SessionProvider>
            <Sidebar/>
                {children}
            </SessionProvider>
        </main>
    );
}