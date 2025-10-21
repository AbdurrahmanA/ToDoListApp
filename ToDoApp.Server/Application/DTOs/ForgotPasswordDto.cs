using System.ComponentModel.DataAnnotations;

namespace ToDoApp.Server.Application.DTOs
{
    public class ForgotPasswordDto
    {
        [Required(ErrorMessage = "E-posta adresi gereklidir.")]
        [EmailAddress(ErrorMessage = "Lütfen geçerli bir e-posta adresi girin.")]
        public required string Email { get; set; }
    }
}
