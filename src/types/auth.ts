export interface User {
  id: number;
  email: string;
  name: string;
  email_verified: boolean;
  oauth_provider?: string;
}

export interface LoginResponse {
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
  login: (email: string, password: string) => Promise<LoginResponse>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  logout: () => Promise<void>;
}

export interface LoginFormProps {
  onSuccess?: () => void;
}

export interface RegisterFormProps {
  onSuccess?: () => void;
} 