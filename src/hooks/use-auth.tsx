"use client";

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation for App Router

export interface MockUser {
  id: string;
  name: string;
  email: string;
  // Add other relevant user fields from your Alumni type if needed
  graduationYear?: number;
  major?: string;
}

interface AuthContextType {
  user: MockUser | null;
  loading: boolean;
  login: (email: string, name?: string) => void; // name is optional, used for register flow
  logout: () => void;
  register: (name: string, email: string) => void;
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

  const login = (email: string, name: string = 'Mock User') => {
    const mockUser: MockUser = { id: Date.now().toString(), name, email };
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

  const register = (name: string, email: string) => {
    // In a real app, this would hit an API and then call login upon success
    console.log('Mock register:', { name, email });
    login(email, name); // Auto-login after mock registration
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
