import { create } from 'zustand';
import type { UserDTO } from '@/api/types';
import { authService } from '@/api/authService';
import type { LoginRequestDTO, RegisterRequestDTO } from '@/api/types';

interface AuthState {
  user: UserDTO | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginRequestDTO) => Promise<void>;
  register: (data: RegisterRequestDTO) => Promise<void>;
  oauthLogin: (provider: 'github' | 'google') => Promise<void>;
  logout: () => void;
  clearError: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authService.login(data);
      localStorage.setItem('codenix_token', res.token);
      localStorage.setItem('codenix_user', JSON.stringify(res.user));
      set({ user: res.user, token: res.token, isAuthenticated: true, isLoading: false });
    } catch (e) {
      set({ isLoading: false, error: 'Invalid email or password' });
      throw e;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authService.register(data);
      localStorage.setItem('codenix_token', res.token);
      localStorage.setItem('codenix_user', JSON.stringify(res.user));
      set({ user: res.user, token: res.token, isAuthenticated: true, isLoading: false });
    } catch (e) {
      set({ isLoading: false, error: 'Registration failed' });
      throw e;
    }
  },

  oauthLogin: async (provider) => {
    set({ isLoading: true, error: null });
    try {
      const res = await authService.oauthLogin(provider);
      localStorage.setItem('codenix_token', res.token);
      localStorage.setItem('codenix_user', JSON.stringify(res.user));
      set({ user: res.user, token: res.token, isAuthenticated: true, isLoading: false });
    } catch (e) {
      set({ isLoading: false, error: 'OAuth failed' });
      throw e;
    }
  },

  logout: () => {
    authService.logout();
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  clearError: () => set({ error: null }),

  hydrate: () => {
    const token = localStorage.getItem('codenix_token');
    const userStr = localStorage.getItem('codenix_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as UserDTO;
        set({ user, token, isAuthenticated: true });
      } catch {
        localStorage.removeItem('codenix_token');
        localStorage.removeItem('codenix_user');
      }
    }
  },
}));
