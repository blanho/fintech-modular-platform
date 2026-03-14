import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth.api';
import type { LoginRequest, RegisterRequest } from '../api/auth.types';
import { useAuthStore } from '@/shared/stores/authStore';
import type { AxiosError } from 'axios';
import type { ApiError } from '@/shared/types/common';

export function useLogin() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      const { user, accessToken, refreshToken } = response.data;
      login(user, accessToken, refreshToken);
      navigate('/dashboard');
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: () => {
      navigate('/login', { state: { registered: true } });
    },
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      logout();
      navigate('/login');
    },
    onError: () => {

      logout();
      navigate('/login');
    },
  });
}

export function useAuth() {
  const { user, isAuthenticated } = useAuthStore();
  const logoutMutation = useLogout();

  return {
    user,
    isAuthenticated,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}

export function getErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<ApiError>;
  return axiosError.response?.data?.error?.message || 'An unexpected error occurred';
}