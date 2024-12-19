"use client"
import Sidebar from "@/components/SideMenu";
import { ApiKeyProvider } from "@/context/apiKeyContext";
import { UserFilesProvider } from "@/context/userFilesContext";
import { UserFilesTagsProvider } from "@/context/userFileTagsContext";

export default function Layout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (

        <main className="flex min-h-screen bg-gray-900 text-white">
                <Sidebar />
                <ApiKeyProvider>
                    <UserFilesProvider>
                        <UserFilesTagsProvider>
                            {children}
                        </UserFilesTagsProvider>
                    </UserFilesProvider>
                </ApiKeyProvider>
        </main>
    );
}