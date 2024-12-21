import { useSession } from "next-auth/react";
import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback, useMemo } from "react";

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
    const fetchAllKeys = useCallback(async () => {
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
    }, [session.data?.user.id])

    useEffect(() => {
        if (session.status === "authenticated") {
            fetchAllKeys();  // Run fetch only if the session is authenticated
        }
    }, [session, fetchAllKeys]); // Call fetchAllKeys on component mount

    const contextValue = useMemo(() => ({ apiKeys, activeApiKey, setActiveApiKey }), [apiKeys, activeApiKey]);

    return (
        <ApiKeyContext.Provider value={contextValue}>
            {loading ? (
                <div className="relative h-full flex items-center justify-center p-4 left-10 sm:top-4 sm:left-4">
                    <p className="text-white bg-gray-800 px-4 py-2 rounded-md shadow-md text-sm sm:text-base">
                        Loading...
                    </p>
                </div>
            ) : error ? (
                <div className="relative h-full flex items-center justify-center p-4 left-10 sm:top-4 sm:left-4">
                    <p className="text-red-500 bg-gray-800 px-4 py-2 rounded-md shadow-md text-sm sm:text-base">
                        Error: {error}
                    </p>
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