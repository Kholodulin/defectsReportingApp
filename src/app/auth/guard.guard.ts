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
        authService.getUserRole().subscribe(
          (userRole) => {
            const requiredRole = route.data['role'];
            if (requiredRole && userRole !== requiredRole) {
              router.navigate(['/access-denied']).then(() => resolve(false));
            } else {
              resolve(true);
            }
          },
          (result) => {
            resolve(false);
          }
        );
      } else {
        localStorage.removeItem('accessToken');
        router.navigate(['/login']).then(() => resolve(false));
      }
    } else {
      router.navigate(['/login']).then(() => resolve(false));
    }
  });
};
