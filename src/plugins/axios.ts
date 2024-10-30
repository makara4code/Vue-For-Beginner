// src/plugins/axios.ts
import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/auth';
import { RefreshTokenResponse } from '@/types/api';

const axiosInstance = axios.create({
  baseURL: '/', // Use the proxy path
  timeout: 10000, // Request timeout
  headers: {
    'Content-Type': 'application/json', // Set the Content-Type header to application/json
    "Accept": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const authStore = useAuthStore();
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const authStore = useAuthStore();
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axiosInstance.post<RefreshTokenResponse>('/refresh-token', {
          refreshToken: authStore.refreshToken,
        });
        authStore.token = response.data.token;
        originalRequest.headers.Authorization = `Bearer ${authStore.token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;