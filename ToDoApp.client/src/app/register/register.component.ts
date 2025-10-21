import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerDto = { username: '', email: '', password: '', confirmPassword: '' };
  message: string | null = null;
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  onRegister(): void {
    this.message = null;
    this.errorMessage = null;

    if (this.registerDto.password !== this.registerDto.confirmPassword) {
      this.errorMessage = 'Şifreler uyuşmuyor.';
      return;
    }

    this.authService.register(this.registerDto).subscribe({
      next: (response) => {
        this.message = response.message || 'Kayıt başarılı! Lütfen e-postanızı doğrulayın.';
      },
      error: (err) => {
        if (err.error && Array.isArray(err.error)) {
          this.errorMessage = err.error.map((e: any) => e.description).join(' ');
        } else {
          this.errorMessage = err.error || 'Kayıt başarısız oldu. Lütfen bilgilerinizi kontrol edin.';
        }
        console.error('Register error:', err);
      }
    });
  }
}