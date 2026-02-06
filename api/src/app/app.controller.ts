import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import type { AuthRequest } from '../auth/auth-request';

@Controller()
export class AppController {
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('protected')
  @Roles('OWNER')
  protected() {
    return { ok: true, message: 'OWNER can see this' };
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get('admin-area')
  @Roles('ADMIN')
  adminArea() {
    return { ok: true, message: 'ADMIN or OWNER can see this' };
  }

  // ✅ here we demonstrate typed req.user
  @UseGuards(AuthGuard('jwt'))
  @Get('viewer-area')
  viewerArea(@Req() req: AuthRequest) {
    return {
      ok: true,
      message: `Any logged-in user can see this (hello ${req.user.username})`,
      role: req.user.role,
    };
  }
}
