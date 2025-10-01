using AngularWithASP.Server.Application.Domain;
using MediatR;

namespace AngularWithASP.Server.Application.Handlers.QueryHandler.GetById
{
    public record GetByIdQuery(Guid id) : IRequest<ToDo>
    {
    }
}
