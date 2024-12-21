"use client";
import Sidebar from "@/components/SideMenu";
import { ApiKeyProvider } from "@/context/apiKeyContext";
import { UserFilesProvider } from "@/context/userFilesContext";
import { UserFilesTagsProvider } from "@/context/userFileTagsContext";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <main className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-white">
            <Sidebar />
            <ApiKeyProvider>
                <UserFilesProvider>
                    <UserFilesTagsProvider>
                        <div className="flex-1">{children}</div>
                    </UserFilesTagsProvider>
                </UserFilesProvider>
            </ApiKeyProvider>
        </main>
    );
}
