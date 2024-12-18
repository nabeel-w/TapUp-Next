import { useSession } from "next-auth/react";
import { createContext, ReactNode, useContext, useEffect, useState, useMemo, useCallback } from "react";

interface MetaData {
  objectId: string;
  name: string;
  generation: bigint;
  metageneration: bigint;
  contentType: string;
  md5Hash: string;
  selfLink: string;
  mediaLink: string;
  timeCreated: string;
  updated: string;
  size: bigint;
  ownerId: string;
}

interface UserFileContextType {
  files: MetaData[] | null;
  loading: boolean;
  error: string | null;
  setFiles: (files: MetaData[]) => void;
}

const UserFilesContext = createContext<UserFileContextType | undefined>(undefined);

export const UserFilesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<MetaData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const session = useSession();

  // Memoizing the fetchUserFiles function using useCallback
  const fetchUserFiles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/user-files?userId=${session.data?.user.id}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch user files');
      }
      const data = await response.json();
      setFiles([...data]); // Ensure we use spread operator to avoid direct mutation
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        setFiles(null);
      } else {
        setError('Failed to fetch user files');
        setFiles(null);
      }
    } finally {
      setLoading(false);
    }
  }, [session.data?.user.id]);

  useEffect(() => {
    if (session.status === 'authenticated') {
      fetchUserFiles();
    }
  }, [session.status, fetchUserFiles]);

  // Memoizing the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({ files, loading, error, setFiles }),
    [files, loading, error]
  );

  return (
    <UserFilesContext.Provider value={contextValue}>
      {children}
    </UserFilesContext.Provider>
  );
};

export const useUserFiles = () => {
  const context = useContext(UserFilesContext);
  if (!context) {
    throw new Error("useUserFiles must be used within a UserFilesProvider");
  }
  return context;
};
