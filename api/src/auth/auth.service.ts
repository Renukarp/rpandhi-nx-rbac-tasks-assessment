import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import type { Role, JwtPayload } from './types';

interface User {
  id: number;
  username: string;
  passwordHash: string;
  role: Role;
  orgId: number;
}

@Injectable()
export class AuthService {
  private users: User[] = [
    {
      id: 1,
      username: 'owner',
      passwordHash: bcrypt.hashSync('password', 10),
      role: 'OWNER',
      orgId: 1,
    },
    {
      id: 2,
      username: 'admin',
      passwordHash: bcrypt.hashSync('password', 10),
      role: 'ADMIN',
      orgId: 1,
    },
    {
      id: 3,
      username: 'viewer',
      passwordHash: bcrypt.hashSync('password', 10),
      role: 'VIEWER',
      orgId: 1,
    },
  ];

  constructor(private jwtService: JwtService) {}

  async login(username: string, password: string) {
    const user = this.users.find((u) => u.username === username);
    if (!user) throw new UnauthorizedException();

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException();

    // Keep your orgId claim, but still leverage the shared JwtPayload shape
    const payload: JwtPayload & { orgId: number } = {
      sub: String(user.id), // JwtPayload.sub is string
      username: user.username,
      role: user.role,
      orgId: user.orgId,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
