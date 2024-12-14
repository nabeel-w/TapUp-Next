"use client"
import FileItem from "@/components/FileItem";
import SearchBar from "@/components/SearchBar";
import { useUserFiles } from "@/context/userFilesContext";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const formatFileSize = (bytes: bigint): string => {
    const size = parseInt(bytes.toString(2))
    if (size === 0) return '0 B';

    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
    const sizeIndex = Math.floor(Math.log(size) / Math.log(1024));

    const fileSize = (size / Math.pow(1024, sizeIndex)).toFixed(2); // Limiting to 2 decimal places
    return `${fileSize} ${units[sizeIndex]}`;
};

export default function HomePage() {
    const session = useSession();
    const { files, loading, error } = useUserFiles();

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
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="flex justify-end mb-6 ms-auto">
                <SearchBar />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {files && files.length > 0 ? (
                    files.map((file, index) => (
                        <FileItem
                            key={index}
                            fileName={file.name.split('/')[1]}
                            fileType={file.contentType}
                            fileSize={formatFileSize(file.size)}
                        />
                    ))
                ) : (
                    <div className="mx-auto text-center text-gray-500 dark:text-gray-400">
                        No files available. Please upload some files to get started.
                    </div>
                )}
            </div>
        </div>
    );
}