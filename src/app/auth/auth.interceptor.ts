import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const accessToken = localStorage.getItem('accessToken');
  let authReq = req;

  if (accessToken) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return authService.refreshAccessToken().pipe(
          switchMap((tokenResponse) => {
            localStorage.setItem('accessToken', tokenResponse.accessToken);
            const newAuthReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${tokenResponse.accessToken}`,
              },
              withCredentials: true,
            });
            return next(newAuthReq);
          })
        );
      }
      return throwError(error);
    })
  );
};
