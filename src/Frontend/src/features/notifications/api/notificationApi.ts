import { api } from '@/shared/api';
import type { Notification } from '@/shared/types';

export const notificationApi = {
  list: () => api.get<Notification[]>('/notifications').then((r) => r.data),
  markRead: (id: string) => api.patch(`/notifications/${id}/read`).then((r) => r.data),
  markAllRead: () => api.patch('/notifications/read-all').then((r) => r.data),
};
