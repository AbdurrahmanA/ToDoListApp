import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true; // Kullanıcı giriş yapmış, sayfaya erişebilir
    } else {
      // Kullanıcı giriş yapmamış, onu login sayfasına yönlendir
      this.router.navigate(['/login']);
      return false; // Sayfaya erişimi engelle
    }
  }
}