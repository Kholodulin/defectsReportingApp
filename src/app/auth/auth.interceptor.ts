import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const accessToken = localStorage.getItem('accessToken');
  let authReq = req;

  // Исключаем путь для запросов, которые не требуют аутентификации
  const isExcludedRoute =
    (req.method === 'POST' && req.url.includes('/api/requests')) ||
    (req.method === 'GET' && req.url.includes('/api/constructionObjects'));

  if (accessToken && !isExcludedRoute) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
  }

  return next(authReq).pipe(
    catchError((error) => {
      if (
        error.status === 401 &&
        !req.url.endsWith('/api/token') &&
        !isExcludedRoute
      ) {
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
          }),
          catchError((refreshError) => {
            authService.logout();
            return throwError(refreshError);
          })
        );
      }
      return throwError(error);
    })
  );
};