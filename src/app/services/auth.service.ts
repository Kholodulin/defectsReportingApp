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
        this.logout();
      } else {
        this.token = localStorage.getItem('accessToken');
        this.getUserRoleFromToken().subscribe((role) =>
          this.userRoleSubject.next(role)
        );
      }
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
    const tokenPayload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(tokenPayload));
    if (!decodedPayload.exp) {
      return false;
    }

    const expiryDate = new Date(decodedPayload.exp * 1000);
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
    if (!this.token) {
      return null;
    }
    const tokenPayload = this.token.split('.')[1];
    const decodedPayload = JSON.parse(atob(tokenPayload));
    return decodedPayload.email;
  }

  logout() {
    localStorage.clear();
    this.userRoleSubject.next(null);
    this.token = null;
  }
}
