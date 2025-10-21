import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterLink   
  ], 
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetDto = { email: '', token: '', newPassword: '', confirmNewPassword: '' };
  message: string | null = null;
  errorMessage: string | null = null;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      const email = params.get('email');
      const token = params.get('token');

      if (email && token) {
        this.resetDto.email = email;
        this.resetDto.token = token;
        this.isLoading = false;
      } else {
        this.errorMessage = 'Geçersiz şifre sıfırlama linki. Lütfen tekrar deneyin.';
        this.isLoading = false;
      }
    });
  }

  onResetPassword(): void {
    this.message = null;
    this.errorMessage = null;

    if (this.resetDto.newPassword !== this.resetDto.confirmNewPassword) {
      this.errorMessage = 'Yeni şifreler uyuşmuyor.';
      return;
    }

    this.authService.resetPassword(this.resetDto).subscribe({
      next: (response: any) => {
        this.message = response.message || 'Şifreniz başarıyla sıfırlandı. Giriş yapabilirsiniz.';
        setTimeout(() => {
          this.router.navigate(['/login']); 
        }, 3000);
      },
      error: (err: any) => {
        if (err.error && Array.isArray(err.error)) {
          this.errorMessage = err.error.map((e: any) => e.description).join(' ');
        } else {
          this.errorMessage = err.error || 'Şifre sıfırlama başarısız oldu. Lütfen linkin geçerli olduğundan emin olun.';
        }
        console.error('Reset password error:', err);
      }
    });
  }
}