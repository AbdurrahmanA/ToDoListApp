using AngularWithASP.Server.Application.Domain;
using MediatR;

namespace AngularWithASP.Server.Application.Handlers.CommandHandler.Update
{
    public record UpdateToDoCommand(Guid id,string Title,string? Description,bool IsCompleted) : IRequest<ToDo>
    {
    }
}
