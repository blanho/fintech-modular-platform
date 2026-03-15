import { api } from '@/shared/api';
import type { AuditEntry, PaginatedResponse } from '@/shared/types';

export const auditApi = {
  list: (page = 1, pageSize = 20) =>
    api
      .get<PaginatedResponse<AuditEntry>>(`/audit?page=${page}&pageSize=${pageSize}`)
      .then((r) => r.data),
};
