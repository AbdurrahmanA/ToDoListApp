using System.ComponentModel.DataAnnotations;

namespace ToDoApp.Server.Domain
{
    public class ToDo
    {
        [Key]
        public Guid id { get; set; } = Guid.NewGuid();

        [Required(ErrorMessage = "Başlık alanı zorunludur.")]
        [StringLength(100, ErrorMessage = "Başlık 100 karakterden uzun olamaz.")]
        public string Title { get; set; }

        [MaxLength(500)]
        public string? Description { get; set; }

        [Required]
        public bool IsCompleted { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public DateTime? DueDate { get; set; }

        [MaxLength(20)]
        public string? RecurrenceRule { get; set; }
        public string ApplicationUserId { get; set; }
        public ApplicationUser ApplicationUser { get; set; }
    }
}
