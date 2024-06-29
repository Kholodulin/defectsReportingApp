import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, map, of, switchMap, tap } from 'rxjs';
import { User } from '../auth/user-model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.API_URL;
  token: string | null = null;

  private userRoleSubject = new BehaviorSubject<string | null>(null);
  private userRole$ = this.userRoleSubject.asObservable();

  constructor(private http: HttpClient) {
    this.getToken();
  }

  get isAuth() {
    return !!this.token;
  }

  registerUser(userDetails: User): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userDetails);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http
      .post<{ accessToken: string }>(`${this.baseUrl}/login`, credentials)
      .pipe(
        tap((response) => {
          localStorage.setItem('accessToken', response.accessToken);
          this.token = response.accessToken;
        }),
        switchMap(() => this.getUserRoleFromToken()),
        tap((role) => this.userRoleSubject.next(role))
      );
  }

  getToken() {
    if (typeof window !== 'undefined') {
      if (this.isTokenExpired()) {
        this.logout;
      }
      this.token = localStorage.getItem('accessToken');
    }
  }

  isTokenExpired(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return false;
    }
    const tokenPlayload = token.split('.')[1];
    const decodePlayload = JSON.parse(atob(tokenPlayload));
    if (!decodePlayload.exp) {
      return false;
    }

    const expiryDate = new Date(decodePlayload.exp * 1000);
    if (!expiryDate) {
      return false;
    }

    return new Date() > expiryDate;
  }

  getUserRoleFromToken(): Observable<string | null> {
    const email = this.getEmailFromToken();
    if (!email) {
      return of(null);
    }
    return this.http
      .get<User[]>(`${this.baseUrl}/users?email=${email}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
      .pipe(map((user) => user[0]?.role ?? null));
  }

  getRole(): Observable<string | null> {
    return this.userRole$;
  }

  getEmailFromToken(): string | null {
    const token = this.token as string;
    const tokenPlayload = JSON.parse(atob(token.split('.')[1]));
    return tokenPlayload.email;
  }

  logout() {
    localStorage.clear();
    this.userRoleSubject.next(null);
  }
}
