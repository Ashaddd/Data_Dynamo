
"use client";

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation'; 

export interface MockUser {
  id: string; // This ID should correspond to the Firestore document ID (UID in real Firebase Auth)
  name: string;
  email: string;
  userType: 'student' | 'alumni';
  graduationYear?: string; 
  expectedGraduationYear?: string; 
  major?: string;
}

interface AuthContextType {
  user: MockUser | null;
  loading: boolean;
  login: (id: string, email: string, name: string, userType: 'student' | 'alumni', year: string, major?: string) => void;
  logout: () => void;
  register: (id: string, name: string, email: string, userType: 'student' | 'alumni', year: string, major: string) => void; // id added
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('nexus-alumni-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('nexus-alumni-user');
    }
    setLoading(false);
  }, []);

  const login = (id: string, email: string, name: string, userType: 'student' | 'alumni', year: string, major?: string) => {
    const mockUser: MockUser = { 
      id: id || Date.now().toString(), // Use provided ID or generate if empty (for initial mock login)
      name, 
      email, 
      userType,
      major,
    };
    if (userType === 'alumni') {
      mockUser.graduationYear = year;
    } else {
      mockUser.expectedGraduationYear = year;
    }

    try {
      localStorage.setItem('nexus-alumni-user', JSON.stringify(mockUser));
      setUser(mockUser);
      // router.push('/dashboard'); // Navigation should be handled by the calling component (e.g., LoginForm)
    } catch (error) {
      console.error("Failed to save user to localStorage", error);
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('nexus-alumni-user');
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error("Failed to remove user from localStorage", error);
    }
  };

  const register = (id: string, name: string, email: string, userType: 'student' | 'alumni', year: string, major: string) => {
    console.log('Mock register in useAuth context:', { id, name, email, userType, year, major });
    // After server action `handleRegistration` stores in DB, this updates client-side context
    login(id, email, name, userType, year, major); 
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
