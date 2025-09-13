import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '@/types';
import api from '@/services/api';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  // Inicializar auth do localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('amfi_token');
        const storedUser = localStorage.getItem('amfi_user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // Validar token com o servidor
          try {
            const response = await api.get('/auth/me');
            setUser(response.data.user);
          } catch (error) {
            // Token inválido, limpar dados
            localStorage.removeItem('amfi_token');
            localStorage.removeItem('amfi_user');
            setToken(null);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Erro ao inicializar auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      const { token: newToken, user: newUser } = response.data;

      setToken(newToken);
      setUser(newUser);
      
      localStorage.setItem('amfi_token', newToken);
      localStorage.setItem('amfi_user', JSON.stringify(newUser));
      
      toast.success('Login realizado com sucesso!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Erro ao fazer login';
      toast.error(errorMessage);
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      const { token: newToken, user: newUser } = response.data;

      setToken(newToken);
      setUser(newUser);
      
      localStorage.setItem('amfi_token', newToken);
      localStorage.setItem('amfi_user', JSON.stringify(newUser));
      
      toast.success('Conta criada com sucesso!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Erro ao criar conta';
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('amfi_token');
    localStorage.removeItem('amfi_user');
    toast.success('Logout realizado com sucesso!');
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};