import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
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

  isTokenExpired(token: string): boolean {
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
}
