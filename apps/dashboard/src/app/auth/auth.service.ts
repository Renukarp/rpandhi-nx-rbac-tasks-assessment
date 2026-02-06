import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Role } from './roles';

const TOKEN_KEY = 'auth_token';

type JwtPayload = {
  sub?: string;
  username?: string;
  role?: Role;
  exp?: number;
  iat?: number;
};

type LoginResponse = {
  access_token: string;
};

function safeJsonParse<T>(s: string): T | null {
  try {
    return JSON.parse(s) as T;
  } catch {
    return null;
  }
}

function decodeJwtPayload(token: string): JwtPayload | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const payloadB64 = parts[1];

  // base64url -> base64
  const b64 = payloadB64.replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64.padEnd(Math.ceil(b64.length / 4) * 4, '=');

  try {
    const json = atob(padded);
    return safeJsonParse<JwtPayload>(json);
  } catch {
    return null;
  }
}

function isExpired(payload: JwtPayload | null): boolean {
  if (!payload?.exp) return false;
  const nowSec = Math.floor(Date.now() / 1000);
  return nowSec >= payload.exp;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  private tokenSig = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  token = computed(() => this.tokenSig());
  payload = computed(() => {
    const t = this.tokenSig();
    if (!t) return null;
    return decodeJwtPayload(t);
  });

  role = computed<Role | null>(() => {
    const p = this.payload();
    return (p?.role as Role) ?? null;
  });

  username = computed(
    () => this.payload()?.username ?? this.payload()?.sub ?? null
  );

  isAuthed = computed(() => {
    const t = this.tokenSig();
    if (!t) return false;
    return !isExpired(this.payload());
  });

  login(username: string, password: string) {
    return this.http.post<LoginResponse>('/api/auth/login', {
      username,
      password,
    });
  }

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
    this.tokenSig.set(token);
  }

  clear() {
    localStorage.removeItem(TOKEN_KEY);
    this.tokenSig.set(null);
  }
}
