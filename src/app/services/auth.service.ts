import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  of,
  tap,
  throwError,
} from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.API_URL;
  private userRoleSubject = new BehaviorSubject<string | null>(null);
  private userRole$ = this.userRoleSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.getAccessToken().subscribe((token) => {
      if (token) {
        localStorage.setItem('accessToken', token);
        const role = this.getUserRoleFromToken(token);
        this.userRoleSubject.next(role);
      }
    });
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http
      .post<{ accessToken: string }>(`${this.baseUrl}/login`, credentials, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          localStorage.setItem('accessToken', response.accessToken);
          const role = this.getUserRoleFromToken(response.accessToken);
          this.userRoleSubject.next(role);
        })
      );
  }

  registerUser(userDetails: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userDetails);
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    this.userRoleSubject.next(null);
    this.router.navigate(['auth/login']);
  }

  getAccessToken(): Observable<string | null> {
    if (this.isBrowser()) {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        return this.refreshAccessToken().pipe(
          map((response) => response.accessToken),
          catchError(() => of(null))
        );
      } else {
        return of(token);
      }
    } else {
      return of(null);
    }
  }

  refreshAccessToken(): Observable<{ accessToken: string }> {
    return this.http
      .post<{ accessToken: string }>(
        `${this.baseUrl}/token`,
        {},
        { withCredentials: true }
      )
      .pipe(
        tap((response) => {
          if (this.isBrowser()) {
            localStorage.setItem('accessToken', response.accessToken);
          }
        }),
        catchError((error) => {
          this.logout();
          return throwError(error);
        })
      );
  }
  getUserRoleFromToken(token: string): string | null {
    if (token) {
      const userRole = JSON.parse(atob(token.split('.')[1])).role;
      return userRole;
    } else {
      return null;
    }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  getRole(): Observable<string | null> {
    return this.userRole$;
  }
}
