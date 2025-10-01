using AngularWithASP.Server.Application.Domain;
using MediatR;

namespace AngularWithASP.Server.Application.Handlers.CommandHandler.Create
{
    public record CreateToDoCommand(string Description,string Title) : IRequest<ToDo>;
}
