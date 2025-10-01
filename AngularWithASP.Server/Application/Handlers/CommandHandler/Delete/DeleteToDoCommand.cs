using AngularWithASP.Server.Application.Domain;
using AngularWithASP.Server.Application.Repository;
using MediatR;

namespace AngularWithASP.Server.Application.Handlers.CommandHandler.Delete
{
    public record DeleteToDoCommand(Guid id) : IRequest<ToDo>
    {
    }
}
