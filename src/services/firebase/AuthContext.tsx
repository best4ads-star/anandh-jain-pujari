/**
 * Authentication Context & Provider for Admin CMS
 * 
 * Tracks Firebase user authentication state, admin role permissions,
 * and Firebase configuration status.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import {
  loginAdminUser,
  logoutAdminUser,
  fetchAdminProfile,
  subscribeToAuthChanges,
  AdminAuthProfile,
} from './auth';
import { getFirebaseConfigStatus, FirebaseConfigStatus } from './config';

interface AuthContextType {
  user: FirebaseUser | null;
  adminProfile: AdminAuthProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isLoading: boolean;
  isFirebaseConfigured: boolean;
  configStatus: FirebaseConfigStatus;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminAuthProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [configStatus, setConfigStatus] = useState<FirebaseConfigStatus>(() =>
    getFirebaseConfigStatus()
  );

  const isFirebaseConfigured = configStatus.isConfigured;

  // Listen to auth state
  useEffect(() => {
    const status = getFirebaseConfigStatus();
    setConfigStatus(status);

    if (!status.isConfigured) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = subscribeToAuthChanges(async (fbUser) => {
      setUser(fbUser);
      if (fbUser) {
        try {
          const profile = await fetchAdminProfile(fbUser.uid);
          setAdminProfile(profile);
        } catch (err) {
          console.warn('Admin profile load note:', err);
          setAdminProfile(null);
        }
      } else {
        setAdminProfile(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const fbUser = await loginAdminUser(email, pass);
      setUser(fbUser);
      try {
        const profile = await fetchAdminProfile(fbUser.uid);
        setAdminProfile(profile);
      } catch (profileErr) {
        console.warn('Profile fetch note:', profileErr);
        setAdminProfile(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutAdminUser();
      setUser(null);
      setAdminProfile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const profile = await fetchAdminProfile(user.uid);
      setAdminProfile(profile);
    }
  };

  const isSuper = adminProfile?.role === 'superadmin';
  const isAdminUser = isSuper || adminProfile?.role === 'admin';

  const value: AuthContextType = {
    user,
    adminProfile,
    isAuthenticated: !!user,
    isAdmin: isAdminUser,
    isSuperAdmin: isSuper,
    isLoading,
    isFirebaseConfigured,
    configStatus,
    login,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
