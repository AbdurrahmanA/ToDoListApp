using MediatR;
using ToDoApp.Server.Domain;

namespace ToDoApp.Server.Application.QueryHandler.GetAll
{
    public class GetAllToDoQuery : IRequest<List<ToDo>> { }
}
