import type { JwtPayload } from './types';

export interface AuthRequest extends Request {
  user: JwtPayload;
}
