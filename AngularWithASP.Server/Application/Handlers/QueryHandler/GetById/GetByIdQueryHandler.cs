using AngularWithASP.Server.Application.Domain;
using AngularWithASP.Server.Application.Repository;
using MediatR;

namespace AngularWithASP.Server.Application.Handlers.QueryHandler.GetById
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
