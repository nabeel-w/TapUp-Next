"use client";
import ApiKeySelector from "@/components/apiKeySelector";
import DragAndDrop from "@/components/DragDrop";
import { ApiKeyProvider } from "@/context/apiKeyContext";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const UploadFilePage = () => {
    const session = useSession();

    useEffect(() => {
        if (session.status === "unauthenticated") {
            redirect("/auth/login");
        }
    }, [session]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="bg-gray-800 rounded-lg shadow-lg p-4 sm:p-8 w-full max-w-xl md:max-w-2xl">
                <ApiKeyProvider>
                    <ApiKeySelector />
                    <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">Upload Your File</h1>
                    <DragAndDrop />
                </ApiKeyProvider>
            </div>
        </div>
    );
};

export default UploadFilePage;
