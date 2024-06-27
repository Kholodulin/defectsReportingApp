import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return new Promise<boolean>((resolve) => {
    authService.getAccessToken().subscribe(
      (accessToken) => {
        if (accessToken) {
          authService.getUserRoleFromToken().subscribe(
            (userRole) => {
              const requiredRole = route.data['role'];

              if (requiredRole && userRole !== requiredRole) {
                resolve(false);
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
          router.navigate(['auth/login']).then(() => resolve(false));
        }
      },
      (error) => {
        resolve(false);
        console.log(error);
      }
    );
  });
};
