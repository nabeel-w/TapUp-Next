"use client"
import Sidebar from "@/components/SideMenu";

export default function Layout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (

        <main className="flex min-h-screen bg-gray-900 text-white">
                <Sidebar />
                {children}
        </main>
    );
}