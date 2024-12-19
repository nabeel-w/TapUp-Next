import { useSession } from "next-auth/react";
import { createContext, ReactNode, useContext, useEffect, useState, useMemo, useCallback } from "react";

interface FileTags {
  tags: string[];
  userId: string;
  objectId: string;
}

interface UserFileTagsContextType {
  fileTags: FileTags[] | null;
}

const UserFilesTagsContext = createContext<UserFileTagsContextType | undefined>(undefined);

export const UserFilesTagsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [filesTags, setFilesTags] = useState<FileTags[] | null>(null);
  const session = useSession();

  // Memoize fetchUserFilesTags function
  const fetchUserFilesTags = useCallback(async () => {
    try {
      const response = await fetch(`/api/user-tags?userId=${session.data?.user.id}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch user tags");
      }
      const data = await response.json();
      setFilesTags([...data]);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err.message);
        setFilesTags(null);
      } else {
        console.error("Failed to fetch user tags");
        setFilesTags(null);
      }
    }
  }, [session.data?.user.id]);

  useEffect(() => {
    if (session.status === "authenticated") {
      fetchUserFilesTags();
    }
  }, [session.status, fetchUserFilesTags]);

  // Memoize the context value
  const contextValue = useMemo(
    () => ({ fileTags: filesTags }),
    [filesTags]
  );

  return (
    <UserFilesTagsContext.Provider value={contextValue}>
      {children}
    </UserFilesTagsContext.Provider>
  );
};

export const useUserFilesTags = () => {
  const context = useContext(UserFilesTagsContext);
  if (!context) {
    throw new Error("useUserFilesTags must be used within a UserFilesTagsProvider");
  }
  return context;
};
