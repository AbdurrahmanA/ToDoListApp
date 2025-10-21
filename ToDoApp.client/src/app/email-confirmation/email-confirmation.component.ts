import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-email-confirmation',
  standalone: true, 
  imports: [CommonModule, RouterLink],
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.scss']
})
export class EmailConfirmationComponent implements OnInit {
  message: string = 'E-postanız doğrulanıyor, lütfen bekleyin...';
  isSuccess: boolean | null = null;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    const userId = this.route.snapshot.queryParamMap.get('userId');
    const token = this.route.snapshot.queryParamMap.get('token');

    if (userId && token) {
      this.authService.confirmEmail(userId, token).subscribe({
        next: (response: any) => {
          this.message = response;
          this.isSuccess = true;
        },
        error: (err: any) => {
          this.message = 'E-posta doğrulaması sırasında bir hata oluştu. Lütfen tekrar deneyin.';
          this.isSuccess = false;
          console.error(err);
        }
      });
    } else {
      this.message = 'Geçersiz doğrulama linki.';
      this.isSuccess = false;
    }
  }
}