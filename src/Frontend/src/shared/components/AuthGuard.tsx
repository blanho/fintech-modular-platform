import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/shared/stores';

export function AuthGuard() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}
