export interface User {
  id: number;
  name: string;
  email: string;
  picture?: string;
  email_verified: boolean;
  provider?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  token: string;
  user: User;
  message: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  register: (name: string, email: string, password: string) => Promise<RegisterResponse>;
  login: (email: string, password: string) => Promise<AuthResponse>;
  loginWithGoogle: () => Promise<any>;
  loginWithFacebook: () => Promise<any>;
  logout: () => Promise<void>;
}

export interface LoginFormProps {
  onSuccess?: () => void;
}

export interface RegisterFormProps {
  onSuccess?: () => void;
} 