import { useSession } from "next-auth/react";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface FileTags {
    tags: string[];
    userId: string;
    objectId: string;
}

interface userFileTagsContextType {
    fileTags: FileTags[] | null;
}

const UserFilesTagsContext = createContext<userFileTagsContextType | undefined>(undefined);

export const UserFilesTagsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [filesTags, setFilesTags] = useState<FileTags[] | null>(null);
    const session = useSession();

    const fetchUserFilesTags = async () => {
        try {
            const response = await fetch(`/api/user-tags?userId=${session.data?.user.id}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch user plan');
            }
            const data = await response.json();
            setFilesTags([...data]);

        } catch (err: unknown) {
            if (err instanceof Error) {
                console.log(err.message);
                setFilesTags(null);
            } else {
                console.log('Failed to fetch user plan');
                setFilesTags(null);
            }
        }
    }

    useEffect(() => {
        if (session.status === 'authenticated')
            fetchUserFilesTags();
    }, [session])

    return (
        <UserFilesTagsContext.Provider value={{ fileTags:filesTags }}>
            {children}
        </UserFilesTagsContext.Provider>
    )
}

export const useUserFilesTags = () => {
    const context = useContext(UserFilesTagsContext);
    if (!context) {
        throw new Error('useUserFiles must be used within a UserFilesProvider');
    }
    return context;
};