import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaXmark } from "react-icons/fa6";
import { getFileIcon } from "./FileIcon";
import { initWrapper, GCSUploader } from "tapup-wrapper-client";
import { useApiKeyContext } from "@/context/apiKeyContext";
import ErrorNotification from "./ErrorNotification";
import UploadProgress from "./UploadProgress";

const DragAndDrop = () => {
    const [file, setFile] = useState<File | null>(null);
    const [size, setSize] = useState<string | null>(null);
    const { activeApiKey } = useApiKeyContext();
    const [wrapper, setWrapper] = useState<GCSUploader | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState<number | null>(null);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                setFile(acceptedFiles[0]);
                setSize(formatFileSize(acceptedFiles[0].size));
            }
        },
        multiple: false,
        maxSize: 3 * 1024 * 1024 * 1024, // Max file size 3GB
    });

    const handleRemoveFile = () => {
        setFile(null);
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return "0 B";

        const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB"];
        const sizeIndex = Math.floor(Math.log(bytes) / Math.log(1024));

        const size = (bytes / Math.pow(1024, sizeIndex)).toFixed(2); // Limiting to 2 decimal places
        return `${size} ${units[sizeIndex]}`;
    };

    const handleFileUpload = async () => {
        const onProgress = (prog: number) => {
            console.log(`Upload Progress: ${prog}%`);
            setProgress(prog);
        };
        if (!file || !wrapper) {
            setError("File or API Key Not Selected");
            return;
        }

        try {
            const result = await wrapper.uploadFileWithProgress(file, file?.name, onProgress);
            if (result.success) {
                console.log(result.message);
            } else {
                setError(result.message);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log(error); // Safe to access 'message' on the error
                setError(error.message);
            } else {
                console.log("An unknown error occurred");
                setError("An unknown error occurred");
            }
        }
    };

    function formatFileName(filePath: string, maxLength: number = 20): string {
        const fileName = filePath.split("/").pop() || "";
        const [name, extension] = fileName.split(/\.([^.]*)$/);

        if (name.length > maxLength) {
            return `${name.substring(0, maxLength)}....${extension}`;
        }

        return fileName;
    }

    useEffect(() => {
        if (activeApiKey) {
            const initializedWrapper = initWrapper(activeApiKey);
            setWrapper(initializedWrapper);
        }
    }, [activeApiKey]);

    return (
        <>
            {progress && <UploadProgress progress={progress} setProgress={setProgress} />}
            {error && <ErrorNotification message={error} setError={setError} />}
            <div
                className={`${
                    isDragActive ? "bg-gray-700 border-blue-400" : "bg-gray-800"
                } rounded-lg h-72 sm:h-96 flex items-center justify-center border-2 border-dashed border-gray-600 px-4 sm:px-10`}
                {...getRootProps()}
            >
                <input {...getInputProps()} />
                <div className="text-center text-white">
                    {!file ? (
                        <>
                            <h3 className="text-lg sm:text-xl font-semibold mb-4">Drag and Drop Files Here</h3>
                            <p className="text-gray-400">or</p>
                            <p className="text-gray-400">Click or Drag a file to upload</p>
                        </>
                    ) : (
                        <div className="mt-4 text-gray-300 flex flex-col sm:flex-row gap-2 items-center justify-center">
                            {getFileIcon(file.type)}
                            <p className="break-all text-center">{formatFileName(file.name)}</p>
                            <p>Size: {size}</p>
                            <button
                                className="text-red-500 flex gap-2 items-center"
                                onClick={handleRemoveFile}
                            >
                                <FaXmark /> Remove
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-8 flex justify-center">
                <button className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 focus:outline-none" onClick={handleFileUpload}>
                    Upload File
                </button>
            </div>
        </>
    );
};

export default DragAndDrop;
