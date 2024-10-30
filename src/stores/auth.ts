// src/stores/auth.ts
import { defineStore } from 'pinia';
import axiosInstance from '@/plugins/axios';
import { User, LoginResponse, RefreshTokenResponse } from '@/types/api';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    refreshToken: null,
  }),
  actions: {
    async login(credentials: { username: string; password: string }) {
      try {
        const response = await axiosInstance.post<LoginResponse>('/login', credentials);
        this.user = response.data.user;
        this.token = response.data.token;
        this.refreshToken = response.data.refreshToken;
      } catch (error) {
        throw new Error('Login failed');
      }
    },
    logout() {
      this.user = null;
      this.token = null;
      this.refreshToken = null;
    },
    async refreshAccessToken() {
      try {
        const response = await axiosInstance.post<RefreshTokenResponse>('/refresh-token', {
          refreshToken: this.refreshToken,
        });
        this.token = response.data.token;
      } catch (error) {
        this.logout();
        throw new Error('Unable to refresh token');
      }
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
  persist: true, // Enable persistence for this store
});