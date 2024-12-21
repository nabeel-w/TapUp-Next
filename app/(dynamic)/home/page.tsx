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
        return null;
    }

    if (error) {
        return (
            <div className="relative h-full w-1/3 sm:w-2/12 p-4 sm:top-4 sm:left-4">
                <p className="text-red-500 bg-gray-800 px-4 py-2 rounded-md shadow-md text-sm sm:text-base">
                    Error: {error}
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 mx-auto bg-gray-900 text-white justify-center mt-10">
            <FileTable />
        </div>
    );
}