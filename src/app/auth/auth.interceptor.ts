import {
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token;
  let authReq = req;

  // Исключаем путь для запросов, которые не требуют аутентификации
  let isExcludedRoute =
    (req.method === 'POST' && req.url.includes('/api/requests')) ||
    (req.method === 'GET' && req.url.includes('/api/constructionObjects'));

  if (token && !isExcludedRoute) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
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
        authService.refreshAccessToken().pipe(
          switchMap((response) => {
            authService.saveToken(response.accessToken);
            const newAuthReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${response.accessToken}`,
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
