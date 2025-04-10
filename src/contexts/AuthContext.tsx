import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useSessionRefresh } from '../hooks/useSessionRefresh';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

interface AuthContextType {
  currentUser: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (user: Omit<User, 'id' | 'createdAt'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  refreshKey: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  
  const { refreshKey, isAuthenticated } = useSessionRefresh();

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      
      try {
        const { data } = await supabase.auth.getSession();
        const session = data.session;
        
        if (session) {
          const { data: userData } = await supabase.auth.getUser();
          
          if (userData && userData.user) {
            const user: User = {
              id: userData.user.id,
              firstName: userData.user.user_metadata?.firstName || '',
              lastName: userData.user.user_metadata?.lastName || '',
              email: userData.user.email || '',
              createdAt: userData.user.created_at || ''
            };
            
            setCurrentUser(user);
            setIsLoggedIn(true);
          }
        } else {
          const isLoggedInStorage = localStorage.getItem('isLoggedIn') === 'true';
          const storedUser = localStorage.getItem('user');
          
          if (isLoggedInStorage && storedUser) {
            setCurrentUser(JSON.parse(storedUser));
            setIsLoggedIn(true);
          } else {
            setCurrentUser(null);
            setIsLoggedIn(false);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        setCurrentUser(null);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [refreshKey]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Erreur de connexion:', error.message);
        return false;
      }
      
      if (data.user) {
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt'> & { password: string }): Promise<boolean> => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            firstName: userData.firstName,
            lastName: userData.lastName
          }
        }
      });
      
      if (error) {
        console.error('Erreur d\'inscription:', error.message);
        return false;
      }
      
      if (data.user) {
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      
      setCurrentUser(null);
      setIsLoggedIn(false);
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const value = {
    currentUser,
    isLoggedIn,
    login,
    register,
    logout,
    loading,
    refreshKey
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
} 