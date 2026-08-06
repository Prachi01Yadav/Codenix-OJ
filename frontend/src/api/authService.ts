import axiosInstance from './axiosInstance';
import type {
  LoginRequestDTO,
  RegisterRequestDTO,
  AuthResponseDTO,
  UserDTO,
} from './types';

export const authService = {
  async login(data: LoginRequestDTO): Promise<AuthResponseDTO> {
    const response = await axiosInstance.post('/auth/login', data);
    return response.data;
  },

  async register(data: RegisterRequestDTO): Promise<AuthResponseDTO> {
    const response = await axiosInstance.post('/auth/register', data);
    return response.data;
  },

  async getCurrentUser(): Promise<UserDTO> {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  },

  async oauthLogin(provider: 'github' | 'google'): Promise<AuthResponseDTO> {
    const response = await axiosInstance.post(`/auth/oauth2/${provider}`);
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('codenix_token');
    localStorage.removeItem('codenix_user');
  },
};

