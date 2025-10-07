using MediatR;
using ToDoApp.Server.Domain;

namespace ToDoApp.Server.Application.CommandHandler.Update
{
    public record UpdateToDoCommand(Guid id,string Title,string? Description,bool IsCompleted) : IRequest<ToDo>
    {
    }
}
