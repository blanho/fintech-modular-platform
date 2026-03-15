import { api } from '@/shared/api';
import type { LoginRequest, RegisterRequest, UpdateProfileRequest, ChangePasswordRequest, User, AuthTokens } from '@/shared/types';

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<{ user: User } & AuthTokens>('/auth/login', data).then((r) => r.data),

  register: (data: RegisterRequest) =>
    api.post<{ user: User } & AuthTokens>('/auth/register', data).then((r) => r.data),

  refresh: (refreshToken: string) =>
    api.post<AuthTokens>('/auth/refresh', { refreshToken }).then((r) => r.data),

  logout: (accessToken: string, refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),

  me: () => api.get<User>('/users/me').then((r) => r.data),

  updateProfile: (data: UpdateProfileRequest) =>
    api.patch<User>('/users/me', data).then((r) => r.data),

  changePassword: (data: ChangePasswordRequest) =>
    api.post('/users/me/change-password', data),
};
