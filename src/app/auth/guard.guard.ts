import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return new Promise<boolean>((resolve) => {
    if (!authService.isTokenExpired()) {
      authService.getUserRoleFromToken().subscribe(
        (userRole) => {
          const requiredRole = route.data['role'];

          if (requiredRole && userRole !== requiredRole) {
            router.navigate(['/page-not-found']).then(() => resolve(false));
          } else {
            resolve(true);
          }
        },
        (error) => {
          resolve(false);
          console.log(error);
        }
      );
    } else {
      authService.logout();
      router.navigate(['/login']).then(() => resolve(false));
    }
  });
};
