import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
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

  token: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {
    const token = this.cookieService.get('token');
    if (token) {
      this.saveToken(token);
      const role = this.getRoleFromToken();
      this.userRoleSubject.next(role);
    }
  }

  get isAuth() {
    if (!this.token) {
      this.token = this.cookieService.get('token');
    }
    return !!this.token;
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http
      .post<{ accessToken: string }>(`${this.baseUrl}/login`, credentials, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          this.saveToken(response.accessToken);
          const role = this.getRoleFromToken();
          this.userRoleSubject.next(role);
        })
      );
  }

  registerUser(userDetails: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userDetails);
  }

  logout(): void {
    this.cookieService.deleteAll();
    this.token = null;
    this.userRoleSubject.next(null);
    this.router.navigate(['auth/login']);
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
          this.saveToken(response.accessToken);
        }),
        catchError((error) => {
          this.logout();
          return throwError(error);
        })
      );
  }

  getRoleFromToken(): string | null {
    if (this.token) {
      const userRole = JSON.parse(atob(this.token.split('.')[1])).role;
      return userRole;
    } else {
      return null;
    }
  }

  getRole(): Observable<string | null> {
    return this.userRole$;
  }

  saveToken(token: string) {
    this.token = token;
    this.cookieService.set('token', this.token);
  }
}
