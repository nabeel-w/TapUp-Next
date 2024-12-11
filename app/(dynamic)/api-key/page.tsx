'use client';
import { useEffect, useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import KeyModal from '@/components/KeyModal';
import { FaXmark } from 'react-icons/fa6';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useApiKeyContext } from '@/context/apiKeyContext';

interface APIkey {
    name: string;
    key: string;
    createdAt: string;
}


const GenerateKeyPage = () => {
    const [apiKey, setApiKey] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const [keys, setKeys] = useState<APIkey[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
    const [keyName, setKeyName] = useState(''); // Key name input state
    const session = useSession();
    const { apiKeys } = useApiKeyContext();

    // Generate a new API key and add it to the table
    const generateApiKey = async () => {
        try {
            const response = await fetch('/api/create-api', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: session.data?.user.id,
                    keyName: keyName || `Key-${keys.length + 1}`,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create API key');
            }

            const { result, msg } = await response.json();

            if (msg) {
                const newKey = {
                    name: result.name,
                    key: result.apiKey,
                    createdAt: new Date(result.createdAt).toLocaleString(),
                };

                setKeys([...keys, newKey]);
                setApiKey(newKey.key);
                setIsCopied(false); // Reset copy state
                setKeyName(''); // Reset input
                setIsModalOpen(false); // Close modal
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error fetching API keys:', error.message);
            } else {
                console.error('Unknown error occurred:', error);
            }
        }
    };


    // Copy key to clipboard
    const copyToClipboard = () => {
        navigator.clipboard.writeText(apiKey);
        setIsCopied(true); // Set copied state to true
        setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
    };

    // Delete a key from the list
    const deleteKey = async (index: number) => {
        try {
            const apiKeyToDelete = keys[index].key;

            const response = await fetch('/api/create-api', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    apiKey: apiKeyToDelete,
                    userId: session.data?.user.id,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete API key');
            }

            const { msg } = await response.json();

            if (msg) {
                setKeys(keys.filter((_, i) => i !== index)); // Remove the deleted key
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error fetching API keys:', error.message);
            } else {
                console.error('Unknown error occurred:', error);
            }
        }
    };

    useEffect(() => {
        if (session.status === 'unauthenticated')
            redirect('/auth/login')
        else if(session.status === 'authenticated')
            setKeys([...apiKeys]);
    }, [session])


    return (
        <div className="flex-1 p-8">
            <h1 className="text-3xl font-bold mb-6">Generate API Key</h1>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <p className="text-gray-400 mb-4">
                    Generate a new API key for uploading your files. Keep it secure and do not share it publicly.
                </p>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition-all"
                >
                    Generate Key
                </button>

                {apiKey && (
                    <div className="mt-6">
                        <p className="text-gray-300 mb-2">Your API Key:</p>
                        <div className="flex items-center bg-gray-700 p-4 rounded-md">
                            <span className="text-gray-200 break-all">{apiKey}</span>
                            <button
                                onClick={copyToClipboard}
                                className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-all"
                            >
                                {isCopied ? 'Copied!' : 'Copy'}
                            </button>
                            <button className='mx-auto text-red-500 hover:text-red-600' onClick={() => setApiKey('')}>
                                <FaXmark size={20} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Table Component */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Your API Keys</h2>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-700">
                                <th className="py-3 px-4 border-b border-gray-600">Key Name</th>
                                <th className="py-3 px-4 border-b border-gray-600">API Key</th>
                                <th className="py-3 px-4 border-b border-gray-600">Created At</th>
                                <th className="py-3 px-4 border-b border-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {keys.length > 0 ? (
                                keys.map((key, index) => (
                                    <tr key={index} className="hover:bg-gray-700">
                                        <td className="py-3 px-4 border-b border-gray-600">{key.name}</td>
                                        <td className="py-3 px-4 border-b border-gray-600">
                                            **** **** **** {key.key.slice(-4) || "Invalid Key"}
                                        </td>
                                        <td className="py-3 px-4 border-b border-gray-600">{key.createdAt}</td>
                                        <td className="py-3 px-4 border-b border-gray-600">
                                            <button
                                                onClick={() => deleteKey(index)}
                                                className="text-red-500 hover:text-red-600"
                                            >
                                                <FaTrashAlt />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        className="py-3 px-4 text-center text-gray-400 border-b border-gray-600"
                                        colSpan={4}
                                    >
                                        No API Keys generated yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {isModalOpen && (<KeyModal keyName={keyName} setIsModalOpen={setIsModalOpen} generateApiKey={generateApiKey} setKeyName={setKeyName} />)}
            </div>
        </div>
    );
};

export default GenerateKeyPage;
