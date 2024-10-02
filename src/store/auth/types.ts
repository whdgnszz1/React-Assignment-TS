import { UserDTO } from '@/lib/auth';

export interface AuthState {
  isLogin: boolean;
  user: UserDTO | null;
  checkLoginStatus: () => Promise<void>;
  logout: () => void;
  setIsLogin: (isLogin: boolean) => void;
  setUser: (user: UserDTO) => void;
}
