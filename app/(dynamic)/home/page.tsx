"use client"
import FileTable from "@/components/FileTable";
import { useUserFiles } from "@/context/userFilesContext";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";



export default function HomePage() {
    const session = useSession();
    const { loading, error } = useUserFiles();

    if (session.status === 'unauthenticated') {
        redirect('/auth/login')
    }

    if (loading) {
        return (
            <div className="relative top-4 left-4  h-full">
                <p className="text-white bg-gray-800 px-4 py-2 rounded-md shadow-md">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="relative top-4 left-4  h-full">
                <p className="text-red-500 bg-gray-800 px-4 py-2 rounded-md shadow-md">
                    Error: {error}
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 mx-auto bg-gray-900 text-white justify-center mt-10">
            <FileTable/>      
        </div>
    );
}