'use client';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { UserResource } from '@/types/user';
import { getCsrf, getAuthenticatedUser, logout } from '@/services/api/auth';

type UserContextType = {
  user: UserResource | null | undefined;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  logoutUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType>({
  user: undefined,
  isLoading: true,
  refreshUser: async () => {},
  logoutUser: async () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserResource | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      // Pre-fetch CSRF cookie for subsequent POST requests throughout browser session.
      // Although GET request doesn't need it.
      await getCsrf();
      getAuthenticatedUser()
        .then((apiResponse) => {
          setUser(apiResponse.data.data);
        })
        .catch(() => setUser(null))
        .finally(() => setIsLoading(false));
    } catch {
      setUser(null);
    }
  };

  const logoutUser = async () => {
    logout()
      .then(() => setUser(null))
      .catch(() => {
        // TODO: Show toast to try again
      });
  };

  useEffect(() => {
    void refreshUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading, refreshUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
};
