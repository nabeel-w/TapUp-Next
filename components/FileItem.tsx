"use client"
import { useState } from "react";
import ApiKeySelector from "./apiKeySelector";
import { getFileIcon } from "./FileIcon";
import { FaTrash } from "react-icons/fa";
import { RiCloseLargeLine } from "react-icons/ri";
import { useApiKeyContext } from "@/context/apiKeyContext";
import { initWrapper } from "tapup-wrapper-client";
import ErrorNotification from "./ErrorNotification";
import { useUserFiles } from "@/context/userFilesContext";

interface FileItemProps {
    fileName: string;
    fileType: string;
    fileSize: string;
}

const FileItem = ({ fileName, fileType, fileSize }: FileItemProps) => {
    const [modal, setModal] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { activeApiKey } = useApiKeyContext();
    const { files, setFiles } = useUserFiles();

    const handleDelete = async () => {
        if (activeApiKey && files) {
            const wrapper = initWrapper(activeApiKey);
            try {
                const result = await wrapper.deleteFile(fileName);
                if (result.success) {
                    console.log(result.message);
                    const updatedFiles = files.filter(file=> file.name.split('/')[1]!==fileName)
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
        }else{
            console.log("API key not selected");
        }
    }



    return (
        <>
            {error && <ErrorNotification message={error} setError={setError} />}
            {modal && <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
                <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                    <div onClick={()=>setModal(false)} className="flex justify-end items-end w-4 ms-auto bg-gray-700 hover:bg-gray-800 rounded-lg">
                        <RiCloseLargeLine />
                    </div>
                    <ApiKeySelector />
                    <button onClick={handleDelete} className="w-auto mx-auto bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg flex flex-row gap-2 items-center">
                        <FaTrash />
                        Confirm
                    </button>
                </div>
            </div>}
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700">
                <div className="flex items-center space-x-4 me-4">
                    {getFileIcon
                        (fileType)} {/* Display the file icon based on mime type */}
                    <div className="text-lg text-white">{fileName}</div>
                </div>
                <div className="text-sm text-gray-400 text-nowrap pe-2">{fileSize}</div>
                <div className="ms-2">
                    <button
                        className="text-red-500 flex flex-row gap-2 items-center"
                        onClick={() => setModal(true)}
                    >
                        <FaTrash />
                    </button>
                </div>
            </div>
        </>
    );
};

export default FileItem;
