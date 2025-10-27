import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@app/features/auth/services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
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
      next: (response: any) => {
        this.message = response.message || 'Kayıt başarılı! Lütfen e-postanızı doğrulayın.';
      },
      error: (err: any) => {
        console.log('Hata detayı:', err);
        console.log('err.error:', err.error);
        console.log('err.error tipi:', typeof err.error);

        if (err.status === 400 && Array.isArray(err.error)) {
          let errorMessagesForToast: string[] = [];
          let foundDuplicateError = false;

          for (const errorItem of err.error) {
            const errorMsg = errorItem.message || errorItem.description || JSON.stringify(errorItem);
            const lowerMsg = errorMsg.toLowerCase();

            if (
              lowerMsg.includes('already') || 
              lowerMsg.includes('exists') || 
              lowerMsg.includes('mevcut') ||
              lowerMsg.includes('taken') ||
              lowerMsg.includes('duplicate') ||
              lowerMsg.includes('kullanılıyor') ||
              lowerMsg.includes('kayıtlı') ||
              lowerMsg.includes('alınmış') ||
              lowerMsg.includes('username') && (lowerMsg.includes('exist') || lowerMsg.includes('taken')) ||
              lowerMsg.includes('email') && (lowerMsg.includes('exist') || lowerMsg.includes('taken'))
            ) {
              foundDuplicateError = true;
              break;
            }

            errorMessagesForToast.push(errorMsg);
          }

          if (foundDuplicateError) {
            this.errorMessage = '❌ Hata: Bu kullanıcı adı veya e-posta adresi zaten kullanılıyor.';
          } else {
            this.errorMessage = `❌ Hata:\n${errorMessagesForToast.join('\n')}`;
          }
        }
        else if (err.status === 400 && err.error?.errors) {
          let errorMessagesForToast: string[] = [];
          let foundDuplicateError = false;

          for (const key in err.error.errors) {
            if (err.error.errors.hasOwnProperty(key)) {
              const messages: string[] = err.error.errors[key];
              const lowerKey = key.toLowerCase();

              for (const message of messages) {
                const lowerMsg = message.toLowerCase();

                if (
                  lowerMsg.includes('already') || 
                  lowerMsg.includes('exists') || 
                  lowerMsg.includes('mevcut') ||
                  lowerMsg.includes('taken') ||
                  lowerMsg.includes('duplicate') ||
                  (lowerKey === 'username' && (lowerMsg.includes('kullanılıyor') || lowerMsg.includes('alınmış'))) ||
                  (lowerKey === 'email' && (lowerMsg.includes('kullanılıyor') || lowerMsg.includes('kayıtlı')))
                ) {
                  foundDuplicateError = true;
                  break;
                }

                errorMessagesForToast.push(message);
              }

              if (foundDuplicateError) break;
            }
          }

          if (foundDuplicateError) {
            this.errorMessage = '❌ Hata: Bu kullanıcı adı veya e-posta adresi zaten kullanılıyor.';
          } else {
            this.errorMessage = `❌ Hata:\n${errorMessagesForToast.join('\n')}`;
          }
        } 
        else if (err.status === 500) {
          const errorMessage = typeof err.error === 'string' ? err.error : '';
          
          if (
            errorMessage.includes('duplicate') || 
            errorMessage.includes('unique') ||
            errorMessage.includes('UNIQUE KEY') ||
            errorMessage.includes('username') ||
            errorMessage.includes('email')
          ) {
            this.errorMessage = '❌ Hata: Bu kullanıcı adı veya e-posta adresi zaten kullanılıyor.';
          } else {
            this.errorMessage = '❌ Hata: Sunucuda beklenmeyen bir hata oluştu.';
          }
        }
        else if (err.error?.title) {
          this.errorMessage = `❌ Hata: ${err.error.title}`;
          console.error('İşlem hatası (Title):', err.error.title, err);
        } 
        else {
          this.errorMessage = '❌ Hata: Bilinmeyen bir sorun oluştu.';
          console.error('İşlem hatası (Unknown):', err);
        }
      }
    });
  }
}