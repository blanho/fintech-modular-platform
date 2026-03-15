import { useAuthStore } from '@/shared/stores';

export type Permission =
  | 'users:read'
  | 'users:write'
  | 'users:manage'
  | 'wallets:read'
  | 'wallets:write'
  | 'wallets:manage'
  | 'transactions:read'
  | 'transactions:write'
  | 'transactions:manage'
  | 'audit:read'
  | 'audit:export'
  | 'reports:read'
  | 'reports:export'
  | 'system:manage';

export type RoleType = 'Admin' | 'User' | 'Auditor' | 'Support';

export function usePermissions() {
  const user = useAuthStore((s) => s.user);
  const permissions = user?.permissions ?? [];
  const roles = user?.roles ?? [];

  const hasPermission = (permission: Permission) => permissions.includes(permission);

  const hasAnyPermission = (...perms: Permission[]) =>
    perms.some((p) => permissions.includes(p));

  const hasAllPermissions = (...perms: Permission[]) =>
    perms.every((p) => permissions.includes(p));

  const hasRole = (role: RoleType) => roles.includes(role);

  const isAdmin = roles.includes('Admin');

  return { permissions, roles, hasPermission, hasAnyPermission, hasAllPermissions, hasRole, isAdmin };
}
