export const ROLE_ORDER = ['VIEWER', 'ADMIN', 'OWNER'] as const;

export type Role = (typeof ROLE_ORDER)[number];

export interface JwtPayload {
  sub: string;
  username: string;
  role: Role;
}
