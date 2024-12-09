import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FaXmark } from 'react-icons/fa6';
import { getFileIcon } from "./FileIcon";
import { initWrapper, GCSUploader } from "tapup-wrapper-client";
import { useApiKeyContext } from "@/context/apiKeyContext";



const DragAndDrop = () => {
    const [file, setFile] = useState<File | null>(null);
    const [size, setSize] = useState<string | null>(null);
    const { activeApiKey } = useApiKeyContext();
    const [wrapper, setWrapper] = useState<GCSUploader | null>(null)

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {              
                setFile(acceptedFiles[0]);
                setSize(formatFileSize(acceptedFiles[0].size))
            }
        },
        multiple: false,  // Only accept one file
        maxSize: 30 * 1024 * 1024,  // Max file size 10 MB
    });

    const handleRemoveFile = () => {
        setFile(null);
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 B';

        const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
        const sizeIndex = Math.floor(Math.log(bytes) / Math.log(1024));

        const size = (bytes / Math.pow(1024, sizeIndex)).toFixed(2); // Limiting to 2 decimal places
        return `${size} ${units[sizeIndex]}`;
    };

    const handleFileUpload = async () => {
        const onProgress = (progress: number) => {
            console.log(`Upload Progress: ${progress}%`);
        };
        if(!file || !wrapper) return;
        try {
            const result = await wrapper.uploadFileWithProgress(file, file?.name, onProgress);
            if (result.success) {
                console.log(result.message);
              } else {
                console.error(result.message);
              }
        }  catch (error: unknown) {
            if (error instanceof Error) {
              console.log(error.message); // Safe to access 'message' on the error
            } else {
              console.log("An unknown error occurred");
            }
          }
    }

    useEffect(() => {
        if (activeApiKey) {
          const initializedWrapper = initWrapper(activeApiKey);
          setWrapper(initializedWrapper);  // Reinitialize the wrapper when activeApiKey changes
        }
      }, [activeApiKey]); 

    return (
        <>
            <div
                className={`${isDragActive ? "bg-gray-700 border-2 border-blue-400" : "bg-gray-800"
                    } rounded-lg min-w-96 h-96 flex items-center justify-center border-2 border-dashed border-gray-600 px-10`}
                {...getRootProps()}
            >
                <input {...getInputProps()} />
                <div className="text-center text-white">
                    {!file && (<>
                        <h3 className="text-xl font-semibold mb-4">Drag and Drop Files Here</h3>
                        <p className="text-gray-400">or</p>
                        <p className="text-gray-400">Click or Drag a file to upload</p>
                    </>)}
                    {file && (
                        <div className="mt-4 text-gray-300 flex flex-row gap-2 items-center justify-center">
                            {getFileIcon(file.type)} {/* Display the file icon based on mime type */}
                            <p>File: {file.name}</p>
                            <p>Size: {size}</p>
                            <button
                                className="text-red-500 flex flex-row gap-2 items-center"
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
