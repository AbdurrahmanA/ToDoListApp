using System.ComponentModel.DataAnnotations;

namespace ToDoApp.Server.Application.DTOs
{
    public class RegisterDto
    {
        [Required(ErrorMessage = "E-posta alanı zorunludur.")]
        [EmailAddress(ErrorMessage = "Lütfen geçerli bir e-posta adresi girin.")]
        public required string Email { get; set; }

        [Required(ErrorMessage = "Kullanıcı adı alanı zorunludur.")]
        public required string Username { get; set; }

        [Required(ErrorMessage = "Şifre alanı zorunludur.")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Şifre en az 6 karakter olmalıdır.")]
        public required string Password { get; set; }

        [Required(ErrorMessage = "Şifre tekrar alanı zorunludur.")]
        [Compare("Password", ErrorMessage = "Şifreler uyuşmuyor.")]
        public required string ConfirmPassword { get; set; }
    }
}