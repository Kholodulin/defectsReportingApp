import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, map, of } from 'rxjs';
import { User } from '../auth/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.API_URL;

  constructor(private http: HttpClient) {}

  registerUser(userDetails: User): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, userDetails);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
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

  getUserRole(): Observable<string | null> {
    const email = this.getEmailFromToken();
    if (!email) {
      return of(null);
    }
    return this.http
      .get<User[]>(`${this.baseUrl}/users?email=${email}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .pipe(map((user) => user[0].role));
  }

  getEmailFromToken(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }
    const token = localStorage.getItem('accessToken');
    if (!token) {
      return null;
    }
    const tokenPlayload = JSON.parse(atob(token.split('.')[1]));
    return tokenPlayload.email;
  }
}
