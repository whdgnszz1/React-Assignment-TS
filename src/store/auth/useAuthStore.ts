import { registerUserAPI } from '@/api/auth';
import { auth } from '@/firebase';
import { UserDTO } from '@/types/authType';
import Cookies from 'js-cookie';
import { create } from 'zustand';

interface AuthState {
  isLogin: boolean;
  user: UserDTO | null;
  checkLoginStatus: () => Promise<void>;
  registerStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  registerError: string | null;
  registerUser: (
    email: string,
    password: string,
    name: string
  ) => Promise<void>;
  logout: () => void;
  setIsLogin: (isLogin: boolean) => void;
  setUser: (user: UserDTO) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLogin: !!Cookies.get('accessToken'),
  user: null,
  registerStatus: 'idle',
  registerError: null,

  checkLoginStatus: async () => {
    const token = Cookies.get('accessToken');
    if (token) {
      try {
        auth.onAuthStateChanged((currentUser) => {
          if (currentUser) {
            set({
              user: {
                uid: currentUser.uid,
                email: currentUser.email ?? '',
                displayName: currentUser.displayName ?? '',
              },
              isLogin: true,
            });
          } else {
            set({
              user: null,
              isLogin: false,
            });
            console.error('유저 정보를 가져올 수 없습니다.');
          }
        });
      } catch (error) {
        console.error('유저 정보를 가져오는 중 에러가 발생했습니다.', error);
        set({ user: null, isLogin: false });
      }
    }
  },

  registerUser: async (email: string, password: string, name: string) => {
    set({ registerStatus: 'loading', registerError: null });
    try {
      const user = await registerUserAPI({ email, password, name });
      set({
        user,
        isLogin: true,
        registerStatus: 'succeeded',
      });
    } catch (error: any) {
      set({
        registerStatus: 'failed',
        registerError: error.message || 'Registration failed',
      });
    }
  },

  logout: () => {
    Cookies.remove('accessToken');
    set({
      isLogin: false,
      user: null,
      registerStatus: 'idle',
      registerError: null,
    });
  },

  setIsLogin: (isLogin: boolean) => {
    set({ isLogin });
  },

  setUser: (user: UserDTO) => {
    set({ user, isLogin: true });
  },
}));
