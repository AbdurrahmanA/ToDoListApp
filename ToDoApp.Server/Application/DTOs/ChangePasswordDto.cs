using System.ComponentModel.DataAnnotations;

namespace ToDoApp.Server.Application.DTOs
{
    public class ChangePasswordDto
    {
        [Required]
        public required string CurrentPassword { get; set; }

        [Required]
        [StringLength(
            100,
            MinimumLength = 6,
            ErrorMessage = "Yeni şifre en az 6 karakter olmalıdır."
        )]
        public required string NewPassword { get; set; }

        [Required]
        [Compare("NewPassword", ErrorMessage = "Yeni şifreler uyuşmuyor.")]
        public required string ConfirmNewPassword { get; set; }
    }
}
