import { useSession } from "next-auth/react";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

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

interface UserFileContextType{
    files: MetaData[] | null;
    loading: boolean;
    error: string | null;
    setFiles: (files:MetaData[])=>void
}

const UserFilesContext = createContext<UserFileContextType | undefined>(undefined);

export const UserFilesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [files, setFiles] = useState<MetaData[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const session = useSession();

    const fetchUserFiles = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/user-files?userId=${session.data?.user.id}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch user plan');
            }
            const data = await response.json();
            setFiles([...data]);
            setError(null);

        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
                setFiles(null);
            } else {
                setError('Failed to fetch user plan');
                setFiles(null);
            }
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (session.status === 'authenticated')
            fetchUserFiles();
    }, [session])

    return (
        <UserFilesContext.Provider value={{ files, loading, error, setFiles }}>
            {children}
        </UserFilesContext.Provider>
    );

}

export const useUserFiles = () => {
    const context = useContext(UserFilesContext);
    if (!context) {
        throw new Error('useUserFiles must be used within a UserFilesProvider');
    }
    return context;
};