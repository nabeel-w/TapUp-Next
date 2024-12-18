import { useApiKeyContext } from '@/context/apiKeyContext';
import React, { useState } from 'react'
import { FaTrash } from 'react-icons/fa';
import { LuSquareArrowUpRight } from 'react-icons/lu';
import ErrorNotification from './ErrorNotification';
import ApiKeySelector from './apiKeySelector';
import { RiCloseLargeLine } from 'react-icons/ri';
import { initWrapper } from 'tapup-wrapper-client';
import { useUserFiles } from '@/context/userFilesContext';
import { getFileIcon } from './FileIcon';

interface MetaData {
    objectId: string; // Unique identifier for the file
    name: string; // File name with the path
    generation: bigint; // Unique identifier for the version of the file
    metageneration: bigint; // Version of metadata for the file
    contentType: string; // MIME type of the file
    md5Hash: string; // MD5 hash of the file content
    selfLink: string; // URL to access file metadata
    mediaLink: string; // URL to download the file
    timeCreated: string; // Timestamp when the file was created (ISO 8601 format)
    updated: string; // Timestamp when the file metadata was last updated (ISO 8601 format)
    size: bigint; // Size of the file in bytes
    ownerId: string; // Identifier for the owner of the file
}

const formatFileSize = (bytes: bigint): string => {
    const size = parseInt(bytes.toString(2))
    if (size === 0) return '0 B';

    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
    const sizeIndex = Math.floor(Math.log(size) / Math.log(1024));

    const fileSize = (size / Math.pow(1024, sizeIndex)).toFixed(2); // Limiting to 2 decimal places
    return `${fileSize} ${units[sizeIndex]}`;
};

function formatFileName(filePath: string, maxLength: number = 20): string {
    // Extract the file name after the last "/"
    const fileName = filePath.split("/").pop() || "";

    // Separate the name and extension
    const [name, extension] = fileName.split(/\.([^.]*)$/); // Regex to split name and extension

    // Check if the name needs truncation
    if (name.length > maxLength) {
        return `${name.substring(0, maxLength)}....${extension}`;
    }

    // Return the full name if it's within the limit
    return fileName;
}

function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

function formatTime(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleTimeString();
}

export default function TableRow({ file }: { file: MetaData }) {
    const [modal, setModal] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { activeApiKey } = useApiKeyContext();
    const { files, setFiles } = useUserFiles();
    const fileName = file.name.split('/')[0];

    const handleDelete = async () => {
        if (activeApiKey && files) {
            const wrapper = initWrapper(activeApiKey);
            try {
                const result = await wrapper.deleteFile(fileName);
                if (result.success) {
                    console.log(result.message);
                    const updatedFiles = files.filter(file => file.name.split('/')[1] !== fileName)
                    setFiles([...updatedFiles])
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.log(error); // Safe to access 'message' on the error
                    setError(error.message);
                    setModal(false);
                } else {
                    console.log("An unknown error occurred");
                    setError("An unknown error occurred");
                }
            } finally {
                setModal(false);
            }
        } else {
            console.log("API key not selected");
        }
    }

    return (
        <>
            {error && <ErrorNotification message={error} setError={setError} />}
            {modal && <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
                <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                    <div onClick={() => setModal(false)} className="flex justify-end items-end w-4 ms-auto bg-gray-700 hover:bg-gray-800 rounded-lg">
                        <RiCloseLargeLine />
                    </div>
                    <ApiKeySelector />
                    <button onClick={handleDelete} className="w-auto mx-auto bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg flex flex-row gap-2 items-center">
                        <FaTrash />
                        Confirm
                    </button>
                </div>
            </div>}
            <tr
                className="border-b bg-gray-800 border-gray-700 hover:bg-gray-700"
            >
                <td className="px-4 py-2 flex items-center">{getFileIcon(file.contentType)}{formatFileName(file.name)}</td>
                <td className="px-4 py-2">{formatFileSize(file.size)}</td>
                <td className="px-4 py-2">{`v${parseFloat(file.metageneration.toString()).toFixed(1)}`}</td>
                <td className="px-4 py-2">{file.contentType}</td>
                <td className="px-4 py-2">{formatDate(file.timeCreated)}</td>
                <td className="px-4 py-2">{formatTime(file.timeCreated)}</td>
                <td className="px-4 py-2">
                    <button className="px-3 py-1 text-sm bg-indigo-600 hover:bg-indigo-500 text-white rounded-md">
                        <LuSquareArrowUpRight />
                    </button>
                    <button onClick={() => setModal(true)} className="px-3 py-1 text-sm bg-red-600 hover:bg-red-500 text-white rounded-md ml-2">
                        <FaTrash />
                    </button>
                </td>
            </tr>
        </>
    )
}
