import { useQuery } from '@tanstack/react-query';
import { auditApi } from '../api/auditApi';
import type { AuditFilters } from '@/shared/types';

export function useAuditLog(filters: AuditFilters = {}) {
  return useQuery({
    queryKey: ['audit', filters],
    queryFn: () => auditApi.list(filters),
  });
}
