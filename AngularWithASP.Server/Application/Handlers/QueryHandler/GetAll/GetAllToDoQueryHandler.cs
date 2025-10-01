using AngularWithASP.Server.Application.Domain;
using AngularWithASP.Server.Application.Repository;
using MediatR;

namespace AngularWithASP.Server.Application.Handlers.QueryHandler.GetAll
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
