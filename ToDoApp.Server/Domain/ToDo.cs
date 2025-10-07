using System.ComponentModel.DataAnnotations;

namespace ToDoApp.Server.Domain
{
    public class ToDo
    {
        [Key]
        public Guid id { get; set; } = Guid.NewGuid();
        [Required]
        [MaxLength(100)]
        public string Title { get; set; }

        [MaxLength(500)]
        public string? Description { get; set; }
        [Required]
        public bool IsCompleted { get; set; } = false;
        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
