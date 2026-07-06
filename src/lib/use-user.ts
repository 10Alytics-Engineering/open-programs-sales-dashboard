"use client";

import { useCallback, useEffect, useState } from "react";

const ADMIN_USER_STORAGE_KEY = "nebiant_admin_user";

export type CurrentAdminUser = {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  [key: string]: any;
};

type UseCurrentAdminUserReturn = {
  user: CurrentAdminUser | null;
  loading: boolean;
  isSuperAdmin: boolean;
  isFinanceAdmin: boolean;
  role?: string;
  refreshUser: () => void;
  setUser: (user: CurrentAdminUser | null) => void;
  clearUser: () => void;
};

function safelyParseUser(value: string | null): CurrentAdminUser | null {
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function useCurrentAdminUser(): UseCurrentAdminUserReturn {
  const [user, setUserState] = useState<CurrentAdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(() => {
    if (typeof window === "undefined") return;

    const storedUser = localStorage.getItem(ADMIN_USER_STORAGE_KEY);
    const parsedUser = safelyParseUser(storedUser);

    setUserState(parsedUser);
    setLoading(false);
  }, []);

  const setUser = useCallback((nextUser: CurrentAdminUser | null) => {
    if (typeof window === "undefined") return;

    if (!nextUser) {
      localStorage.removeItem(ADMIN_USER_STORAGE_KEY);
      setUserState(null);
      return;
    }

    localStorage.setItem(ADMIN_USER_STORAGE_KEY, JSON.stringify(nextUser));
    setUserState(nextUser);
  }, []);

  const clearUser = useCallback(() => {
    if (typeof window === "undefined") return;

    localStorage.removeItem(ADMIN_USER_STORAGE_KEY);
    setUserState(null);
  }, []);

  useEffect(() => {
    refreshUser();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === ADMIN_USER_STORAGE_KEY) {
        setUserState(safelyParseUser(event.newValue));
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [refreshUser]);

  const role = user?.role;

  return {
    user,
    loading,
    role,
    isSuperAdmin: role === "SUPER_ADMIN",
    isFinanceAdmin: role === "FINANCE_ADMIN" || role === "SUPER_ADMIN",
    refreshUser,
    setUser,
    clearUser,
  };
}
