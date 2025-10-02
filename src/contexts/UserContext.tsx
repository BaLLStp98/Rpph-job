'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'superadmin' | 'applicant';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
  permissions: string[];
  department?: string;
  phone?: string;
  profileImage?: string;
  lineId?: string;
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isApplicant: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  loginWithUser: (user: User) => void;
  logout: () => void;
  checkUser: (id?: string, email?: string) => Promise<User | null>;
  updateUser: (userData: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ตรวจสอบสถานะการเข้าสู่ระบบเมื่อโหลดหน้า
  useEffect(() => {
    const checkAuthStatus = () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('user');
        }
      }
    };

    checkAuthStatus();
  }, []);

  // ฟังก์ชันเข้าสู่ระบบ
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/users/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(data.user));
          return true;
        }
      } else {
        const errorData = await response.json();
        console.error('Login error:', errorData.error);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
    return false;
  };

  // ฟังก์ชันเข้าสู่ระบบด้วยข้อมูลผู้ใช้โดยตรง (ใช้สำหรับ SSO/NextAuth)
  const loginWithUser = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // ฟังก์ชันออกจากระบบ
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  // ฟังก์ชันตรวจสอบข้อมูลผู้ใช้
  const checkUser = async (id?: string, email?: string): Promise<User | null> => {
    try {
      const params = new URLSearchParams();
      if (id) params.append('id', id);
      if (email) params.append('email', email);

      const response = await fetch(`/api/users/check?${params.toString()}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          return data.user;
        }
      }
    } catch (error) {
      console.error('Error checking user:', error);
    }
    return null;
  };

  // ฟังก์ชันอัปเดตข้อมูลผู้ใช้
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  // คำนวณค่าต่างๆ
  const isAdmin = isAuthenticated && (user?.role === 'admin' || user?.role === 'superadmin');
  const isSuperAdmin = isAuthenticated && user?.role === 'superadmin';
  const isApplicant = isAuthenticated && user?.role === 'applicant';

  const value: UserContextType = {
    user,
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    isApplicant,
    login,
    loginWithUser,
    logout,
    checkUser,
    updateUser,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
