import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { getToken } from './auth.storage';

export const loginRedirectGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = getToken();

  if (token) {
    return router.createUrlTree(['/']);
  }
  return true;
};
