import { useState, useEffect, useContext, createContext } from 'react';
import { useRouter } from 'next/router';
import { api } from '../utils/api';
import { AuthContextType, User } from '../types/auth';
import { supabase } from '../utils/supabaseClient';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const session = supabase.auth.session();
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  const login = async (email: string, password: string) => {
    const { user, error } = await supabase.auth.signIn({ email, password });
    if (error) {
      throw new Error(error.message);
    }
    setUser(user);
    router.push('/dashboard');
  };

  const register = async (email: string, password: string) => {
    const { user, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      throw new Error(error.message);
    }
    setUser(user);
    router.push('/dashboard');
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
