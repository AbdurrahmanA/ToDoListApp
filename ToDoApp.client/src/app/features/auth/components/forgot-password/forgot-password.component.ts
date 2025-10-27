import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '@app/features/auth/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  email: string = '';
  message: string | null = null;
  errorMessage: string | null = null;

  constructor(private authService: AuthService) { }

  onRequestReset(): void {
    this.message = null;
    this.errorMessage = null;

    this.authService.forgotPassword(this.email).subscribe({
      next: (response: any) => {
        this.message = response.message || 'E-posta adresiniz sistemde kayıtlıysa, size bir sıfırlama linki gönderilecektir.';
      },
      error: (err: any) => {
        if (err.status === 400 && err.error?.errors) {
          const emailErrors = err.error.errors.Email;
          if (emailErrors && emailErrors.length > 0) {
            this.errorMessage = emailErrors[0]; 
          } else {
            this.errorMessage = 'Lütfen geçerli bir e-posta adresi girin.';
          }
        } else {
          this.errorMessage = 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
        }
        console.error('Forgot password error:', err);
      }
    });
  }
}