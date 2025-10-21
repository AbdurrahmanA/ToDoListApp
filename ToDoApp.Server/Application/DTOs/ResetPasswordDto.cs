using System.ComponentModel.DataAnnotations;

namespace ToDoApp.Server.Application.DTOs
{
    public class ResetPasswordDto
    {
        [Required]
        [EmailAddress]
        public required string Email { get; set; }

        [Required]
        public required string Token { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Şifre en az 6 karakter olmalıdır")]
        public required string NewPassword { get; set; }

        [Required]
        [Compare("NewPassword", ErrorMessage = "Şifreler uyuşmuyor")]
        public required string ConfirmNewPassword { get; set; }
    }
}
