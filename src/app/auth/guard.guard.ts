import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return new Promise<boolean>((resolve) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token && !authService.isTokenExpired(token)) {
        resolve(true);
      } else {
        localStorage.removeItem('accessToken');
        router.navigate(['/login']).then(() => resolve(false));
      }
    } else {
      router.navigate(['/login']).then(() => resolve(false));
    }
  });
};
