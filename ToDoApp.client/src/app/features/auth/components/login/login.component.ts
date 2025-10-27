import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@app/features/auth/services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginDto = { email: '', password: '' };
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) { }

  onLogin(): void {
    this.errorMessage = null; 

    this.authService.login(this.loginDto).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        this.router.navigate(['/tasks/all']);
      },
      error: (err) => {
        if (typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = 'Giriş başarısız oldu. Lütfen e-posta ve şifrenizi kontrol edin.';
        }
        console.error('Login error:', err);
      }
    });
  }
}