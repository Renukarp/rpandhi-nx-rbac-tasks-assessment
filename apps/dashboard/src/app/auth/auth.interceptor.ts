import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenStorage } from './token.storage';

function isApiCall(url: string) {
  // Works for both:
  //  - "/api/protected"
  //  - "http://localhost:4200/api/protected"
  //  - "http://localhost:5000/api/protected"
  return url.includes('/api/');
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStorage = inject(TokenStorage);
  const token = tokenStorage.get();

  if (!token || !isApiCall(req.url)) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    })
  );
};
