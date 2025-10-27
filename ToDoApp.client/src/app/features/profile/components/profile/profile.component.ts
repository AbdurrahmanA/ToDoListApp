import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';

interface UserProfile {
  username: string;
  email: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: UserProfile = { username: '', email: '' };
  changePasswordDto = { currentPassword: '', newPassword: '', confirmNewPassword: '' };
  
  message: string | null = null;
  errorMessage: string | null = null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.authService.getProfile().subscribe({
      next: (profile: UserProfile) => {
        console.log('API\'den gelen profil verisi:', profile);
        this.user = profile;
      },
      error: (err) => {
        this.errorMessage = "Kullanıcı bilgileri yüklenemedi.";
        console.error('Profile load error:', err);
      }
    });
  }

  onChangePassword(): void {
    this.message = null;
    this.errorMessage = null;

    if (this.changePasswordDto.newPassword !== this.changePasswordDto.confirmNewPassword) {
      this.errorMessage = "Yeni şifreler uyuşmuyor.";
      return;
    }

    this.authService.changePassword(this.changePasswordDto).subscribe({
      next: (response: any) => {
        this.message = response.message || "Şifreniz başarıyla güncellendi.";
        this.changePasswordDto = { currentPassword: '', newPassword: '', confirmNewPassword: '' };
      },
      error: (err: any) => {
        if (err.error?.errors && Array.isArray(err.error.errors)) {
          this.errorMessage = err.error.map((e: any) => e.description).join(' ');
        } else if (err.error?.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Şifre güncellenemedi. Lütfen mevcut şifrenizi kontrol edin.';
        }
        console.error('Change password error:', err);
      }
    });
  }
}