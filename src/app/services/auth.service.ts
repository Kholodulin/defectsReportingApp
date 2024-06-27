import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {
  BehaviorSubject,
  Observable,
  catchError,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../auth/user-model';

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
        this.getUserRoleFromToken(token).subscribe((role) => {
          this.userRoleSubject.next(role);
        });
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
          if (this.isBrowser()) {
            localStorage.setItem('accessToken', response.accessToken);
          }
        }),
        switchMap(() => this.getUserRoleFromToken()),
        tap((role) => this.userRoleSubject.next(role))
      );
  }

  registerUser(userDetails: User): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userDetails);
  }

  logout(): void {
    this.http
      .post(`${this.baseUrl}/logout`, {}, { withCredentials: true })
      .subscribe(() => {
        if (this.isBrowser()) {
          localStorage.removeItem('accessToken');
        }
        this.userRoleSubject.next(null);
        this.router.navigate(['auth/login']);
      });
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
        })
      );
  }

  getUserRoleFromToken(token?: string): Observable<string | null> {
    if (!token && this.isBrowser()) {
      token = localStorage.getItem('accessToken') as string;
    }
    if (token) {
      const userRole = JSON.parse(atob(token.split('.')[1])).role;
      return of(userRole);
    } else {
      return of(null);
    }
  }

  private isBrowser(): boolean {
    return (
      typeof window !== 'undefined' &&
      typeof window.localStorage !== 'undefined'
    );
  }
}
