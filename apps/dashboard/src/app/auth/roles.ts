export type Role = 'OWNER' | 'ADMIN' | 'VIEWER';

export const ROLE_RANK: Record<Role, number> = {
  VIEWER: 1,
  ADMIN: 2,
  OWNER: 3,
};

export function hasAtLeast(userRole: Role | null, required: Role): boolean {
  if (!userRole) return false;
  return ROLE_RANK[userRole] >= ROLE_RANK[required];
}
