"use client";
import { createContext, useContext, useEffect, useState } from 'react';
const AuthContext = createContext<any>(null);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    const saved = localStorage.getItem('qalby_user');
    if (saved) { setUser(JSON.parse(saved)); setIsLoggedIn(true); }
  }, []);
  const logout = () => {
    localStorage.removeItem('qalby_user');
    localStorage.removeItem('qalby_token');
    setIsLoggedIn(false); setUser(null);
    window.location.href='/';
  };
  return <AuthContext.Provider value={{ user, isLoggedIn, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
