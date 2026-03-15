import { api } from '@/shared/api';
import type { LoginRequest, RegisterRequest, User, AuthTokens } from '@/shared/types';

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<{ user: User } & AuthTokens>('/identity/login', data).then((r) => r.data),

  register: (data: RegisterRequest) =>
    api.post<{ user: User } & AuthTokens>('/identity/register', data).then((r) => r.data),

  me: () => api.get<User>('/identity/me').then((r) => r.data),
};
