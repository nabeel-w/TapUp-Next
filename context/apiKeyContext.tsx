import { useSession } from "next-auth/react";
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";

type ApiKey = {
    key: string;
    name: string;
    createdAt: string;
};

interface apiKeysServer {
    name: string;
    apiKey: string;
    createdAt: Date;
    userId: string;
}

type ApiKeyContextType = {
    apiKeys: ApiKey[];
    activeApiKey: string | null;
    setActiveApiKey: (apiKey: string) => void;
};

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider = ({ children }: { children: ReactNode }) => {
    const [activeApiKey, setActiveApiKey] = useState<string | null>(null);
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const session = useSession();

    // Function to fetch API keys from the server
    const fetchAllKeys = async () => {
        try {
            const response = await fetch(`/api/create-api?userId=${session.data?.user.id}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch API keys" + response);
            }

            const { result } = await response.json();

            if (result) {
                const formattedKeys = result.map((key: apiKeysServer) => ({
                    name: key.name,
                    key: key.apiKey,
                    createdAt: new Date(key.createdAt).toLocaleString(),
                }));

                setApiKeys([...formattedKeys]);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Unknown error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session.status === "authenticated") {
            fetchAllKeys();  // Run fetch only if the session is authenticated
        }
    }, [session]); // Call fetchAllKeys on component mount

    return (
        <ApiKeyContext.Provider value={{ apiKeys, activeApiKey, setActiveApiKey }}>
            {loading ? (
                <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
                    <span className="text-lg">Loading...</span>
                </div>
            ) : error ? (
                <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
                    <span className="text-lg">Error loading API keys: {error}</span>
                </div>
            ) : (
                children
            )}
        </ApiKeyContext.Provider>
    );
};

export const useApiKeyContext = (): ApiKeyContextType => {
    const context = useContext(ApiKeyContext);
    if (!context) {
        throw new Error("useApiKeyContext must be used within a ApiKeyProvider");
    }
    return context;
};