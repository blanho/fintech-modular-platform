import type { ReactNode } from 'react';
import { usePermissions } from '@/shared/hooks';
import type { Permission } from '@/shared/hooks';

interface PermissionGateProps {
  readonly permission?: Permission;
  readonly anyOf?: Permission[];
  readonly allOf?: Permission[];
  readonly children: ReactNode;
  readonly fallback?: ReactNode;
}

export function PermissionGate({ permission, anyOf, allOf, children, fallback = null }: PermissionGateProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

  let allowed = true;
  if (permission) allowed = hasPermission(permission);
  if (anyOf) allowed = hasAnyPermission(...anyOf);
  if (allOf) allowed = hasAllPermissions(...allOf);

  return allowed ? <>{children}</> : <>{fallback}</>;
}
