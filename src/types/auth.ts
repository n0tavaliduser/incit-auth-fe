export interface User {
  id: number;
  email: string;
  name: string;
  oauth_provider?: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  logout: () => Promise<void>;
}

export interface LoginFormProps {
  onSuccess?: () => void;
}

export interface PrivateRouteProps {
  children: React.ReactNode;
} 