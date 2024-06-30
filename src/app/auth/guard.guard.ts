import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (): Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getAccessToken().pipe(
    map((token) => {
      if (token) {
        return true;
      } else {
        router.navigate(['auth/login']);
        return false;
      }
    }),
    catchError((error) => {
      router.navigate(['auth/login']);
      return of(false);
    })
  );
};
