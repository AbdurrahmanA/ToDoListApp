using MediatR;
using ToDoApp.Server.Domain;

namespace ToDoApp.Server.Application.QueryHandler.GetById
{
    public record GetByIdQuery(Guid id) : IRequest<ToDo>
    {
    }
}
