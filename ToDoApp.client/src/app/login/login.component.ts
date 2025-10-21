import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink,Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports : [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginDto = { email: '',password:''};
  errorMessage : string | null = null;

  constructor(private authService : AuthService, private router: Router){}

  onLogin(): void{
    this.errorMessage = null;

    this.authService.login(this.loginDto).subscribe(
      {
        next: (response) => {
          this.authService.saveToken(response.token);
          this.router.navigate(['/tasks']);
        },
        error : (err) =>{
        this.errorMessage = err.error || 'Giriş başarısız oldu. Lütfen e-posta ve şifrenizi kontrol edin.';          
        console.error('Login error',err);
      }
      }
    )
  }
}
