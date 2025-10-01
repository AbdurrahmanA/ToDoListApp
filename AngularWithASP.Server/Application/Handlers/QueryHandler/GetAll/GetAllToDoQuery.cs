using AngularWithASP.Server.Application.Domain;
using MediatR;

namespace AngularWithASP.Server.Application.Handlers.QueryHandler.GetAll
{
    public class GetAllToDoQuery : IRequest<List<ToDo>>
    {
    }
}
