using System.ComponentModel.DataAnnotations;
using MediatR;
using ToDoApp.Server.Domain;

namespace ToDoApp.Server.Application.CommandHandler.Create
{
    public record CreateToDoCommand(
        string? Description,
        [Required] [MaxLength(100)] string Title,
        DateTime? DueDate,
        string? RecurrenceRule,
        bool IsCompleted
    ) : IRequest<ToDo>;
}
