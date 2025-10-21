using MediatR;
using ToDoApp.Server.Domain;

namespace ToDoApp.Server.Application.QueryHandler.GetById
{
    public class GetByIdQuery : IRequest<ToDo?>
    {
        public Guid Id { get; set; }

        public GetByIdQuery(Guid id)
        {
            Id = id;
        }
    }
}