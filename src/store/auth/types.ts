import { UserDTO } from '@/lib/auth';

export interface AuthStore {
  isLogin: boolean;
  user: UserDTO | null;
  checkLoginStatus: () => Promise<void>;
  logout: () => void;
  setIsLogin: (isLogin: boolean) => void;
  setUser: (user: UserDTO) => void;
}
