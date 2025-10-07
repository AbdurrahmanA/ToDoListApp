using MediatR;
using ToDoApp.Server.Application.Interfaces;
using ToDoApp.Server.Domain;

namespace ToDoApp.Server.Application.QueryHandler.GetAll
{
    public class GetAllToDoQueryHandler : IRequestHandler<GetAllToDoQuery, List<ToDo>>
    {
        private readonly IToDoRepository _repository;

        public GetAllToDoQueryHandler(IToDoRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<ToDo>> Handle(GetAllToDoQuery request, CancellationToken cancellationToken)
        {
            return await _repository.GetAll();
        }
    }
}
