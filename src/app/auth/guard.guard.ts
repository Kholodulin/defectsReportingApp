import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  if (typeof window !== 'undefined' && localStorage.getItem('accessToken')) {
    return true;
  } else {
    const router = inject(Router);
    return router.navigate(['login']);
  }
};
