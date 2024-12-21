"use client";
import Sidebar from "@/components/SideMenu";

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <main className="flex flex-col md:flex-row min-h-screen bg-gray-900 text-white">
            <Sidebar/>
            <div className="flex-1 p-4 md:p-8">
                {children}
            </div>
        </main>
    );
}
