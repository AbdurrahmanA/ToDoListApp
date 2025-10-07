using MediatR;
using ToDoApp.Server.Domain;

namespace ToDoApp.Server.Application.CommandHandler.Delete
{
    public record DeleteToDoCommand(Guid id) : IRequest<ToDo>
    {
    }
}
