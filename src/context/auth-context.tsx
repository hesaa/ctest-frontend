// context/auth-context.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { handleLogin, handleLogout, handleMe } from '@/app/login/serverAction/auth';

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(null);
  const router = useRouter();


  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get('token');
      if (token) {
        const userData = await fetchUserData(token)
        if (userData) {
          setUser(userData)
        }
      } else {
        Cookies.remove('token');
        setUser(null);
        router.push('/login');
      }
    }
    fetchData()
  }, []);


  const login = async (email: string, password: string) => {
    try {
      const response = await handleLogin(email, password)
      if (!response.success) {
        throw new Error('Login failed');
      }

      // Store token in cookie
      Cookies.set('token', response.data.token, {
        expires: 1, // 1 day
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      // Set user data
      setUser(response.data);
      router.push('/dashboard');
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const logout = async () => {
    try {
      const token = Cookies.get('token');
      if (token) {
        await handleLogout(token)
      } else {
        Cookies.remove('token');
        setUser(null);
        router.push('/login');
      }
      // Call Laravel logout endpoint if needed
    } finally {
      // Clear client-side auth state
      Cookies.remove('token');
      setUser(null);
      router.push('/login');
    }
  };

  const fetchUserData = async (token: string) => {
    try {
      const response = await handleMe(token)
      return response;
    } catch (error) {
      Cookies.remove('token');
      return null;
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};