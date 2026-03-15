import { api } from '@/shared/api';
import type { Notification, NotificationPreference, NotificationFilters, PaginatedResponse } from '@/shared/types';

export const notificationApi = {
  list: (filters: NotificationFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.pageSize) params.set('pageSize', String(filters.pageSize));
    if (filters.type) params.set('type', filters.type);
    if (filters.isRead !== undefined) params.set('isRead', String(filters.isRead));
    return api
      .get<PaginatedResponse<Notification>>(`/notifications?${params.toString()}`)
      .then((r) => r.data);
  },

  markRead: (id: string) => api.patch(`/notifications/${id}/read`).then((r) => r.data),

  markAllRead: () => api.patch('/notifications/read-all').then((r) => r.data),

  getPreferences: () =>
    api.get<NotificationPreference>('/notifications/preferences').then((r) => r.data),

  updatePreferences: (data: Partial<NotificationPreference>) =>
    api.put<NotificationPreference>('/notifications/preferences', data).then((r) => r.data),
};
