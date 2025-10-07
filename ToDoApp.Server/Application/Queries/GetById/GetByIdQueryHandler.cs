using MediatR;
using ToDoApp.Server.Application.Interfaces;
using ToDoApp.Server.Domain;

namespace ToDoApp.Server.Application.QueryHandler.GetById
{
    public class GetByIdQueryHandler : IRequestHandler<GetByIdQuery,ToDo>
    {
        private readonly IToDoRepository _repository;

        public GetByIdQueryHandler(IToDoRepository repository)
        {
            _repository = repository;
        }

        public async Task<ToDo> Handle(GetByIdQuery request, CancellationToken cancellationToken)
        {
            return await _repository.GetById(request.id);
        }
    }
}
