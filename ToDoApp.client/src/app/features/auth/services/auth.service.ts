import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7261/api/Auth';

  constructor(private http: HttpClient) { }

  confirmEmail(userId: string, token: string): Observable<string> {
    const params = new HttpParams().set('userId', userId).set('token', token);
    return this.http.get(`${this.apiUrl}/confirm-email`, { params, responseType: 'text' });
  }

  register(registerDto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, registerDto);
  }

  login(loginDto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, loginDto);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(resetPasswordDto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, resetPasswordDto);
  }
  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profile`);
  }

  changePassword(changePasswordDto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, changePasswordDto);
  }

  saveToken(token: string): void {
    localStorage.setItem('jwtToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  removeToken(): void {
    localStorage.removeItem('jwtToken');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}