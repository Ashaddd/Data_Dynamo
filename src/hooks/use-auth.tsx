"use client";

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation for App Router

export interface MockUser {
  id: string;
  name: string;
  email: string;
  userType: 'student' | 'alumni';
  graduationYear?: string; // For alumni (string from form/localStorage)
  expectedGraduationYear?: string; // For students (string from form/localStorage)
  major?: string;
}

interface AuthContextType {
  user: MockUser | null;
  loading: boolean;
  login: (email: string, name: string, userType: 'student' | 'alumni', year: string, major?: string) => void;
  logout: () => void;
  register: (name: string, email: string, userType: 'student' | 'alumni', year: string, major: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate checking auth status from localStorage
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

  const login = (email: string, name: string, userType: 'student' | 'alumni', year: string, major?: string) => {
    const mockUser: MockUser = { 
      id: Date.now().toString(), 
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
      router.push('/dashboard');
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

  const register = (name: string, email: string, userType: 'student' | 'alumni', year: string, major: string) => {
    // In a real app, this would hit an API and then call login upon success
    console.log('Mock register:', { name, email, userType, year, major });
    // For registration, the 'year' parameter is either graduationYear or expectedGraduationYear
    login(email, name, userType, year, major); 
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
