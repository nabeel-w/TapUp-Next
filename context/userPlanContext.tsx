import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type UserPlan = {
  subscriptionName: string;
  storageSize: number;
  storageUsed: string;
  startDate: string; // ISO string
  endDate: string | null; // ISO string or null
};

type UserPlanContextType = {
  userPlan: UserPlan | null;
  loading: boolean;
  error: string | null;
};

const UserPlanContext = createContext<UserPlanContextType | undefined>(undefined);

export const UserPlanProvider: React.FC<{ userId?: string, children: ReactNode }> = ({ userId, children }) => {
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserPlan = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/user-plan?userId=${userId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch user plan');
        }
        const data = await response.json();
        setUserPlan(data);
        setError(null);
      } catch (err: unknown) {
        if (err instanceof Error) {
            setError(err.message);
            setUserPlan(null);
        } else {
            setError('Failed to fetch user plan');
            setUserPlan(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserPlan();
  }, [userId]);

  return (
    <UserPlanContext.Provider value={{ userPlan, loading, error }}>
      {children}
    </UserPlanContext.Provider>
  );
};

export const useUserPlan = () => {
  const context = useContext(UserPlanContext);
  if (!context) {
    throw new Error('useUserPlan must be used within a UserPlanProvider');
  }
  return context;
};
