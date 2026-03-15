import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportApi } from '../api/reportApi';
import type { GenerateReportRequest } from '@/shared/types';

export function useReports(page = 1, pageSize = 20) {
  return useQuery({
    queryKey: ['reports', page, pageSize],
    queryFn: () => reportApi.list(page, pageSize),
  });
}

export function useReport(id: string) {
  return useQuery({
    queryKey: ['reports', id],
    queryFn: () => reportApi.getById(id),
    enabled: Boolean(id),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === 'Pending' || status === 'Generating') return 3000;
      return false;
    },
  });
}

export function useGenerateReport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: GenerateReportRequest) => reportApi.generate(data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useDownloadReport() {
  return useMutation({
    mutationFn: async (id: string) => {
      const blob = await reportApi.download(id);
      const url = globalThis.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${id}.csv`;
      a.click();
      globalThis.URL.revokeObjectURL(url);
    },
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['reports', 'dashboard-stats'],
    queryFn: reportApi.getDashboardStats,
    staleTime: 60_000,
  });
}
