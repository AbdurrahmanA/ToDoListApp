using System.Security.Claims;
using MediatR;
using ToDoApp.Server.Application.Interfaces;
using ToDoApp.Server.Domain;

namespace ToDoApp.Server.Application.QueryHandler.GetAll
{
    public class GetAllToDoQueryHandler : IRequestHandler<GetAllToDoQuery, List<ToDo>>
    {
        private readonly IToDoRepository _repository;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public GetAllToDoQueryHandler(
            IToDoRepository repository,
            IHttpContextAccessor httpContextAccessor
        )
        {
            _repository = repository;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<List<ToDo>> Handle(
            GetAllToDoQuery request,
            CancellationToken cancellationToken
        )
        {
            var userId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

            if (string.IsNullOrEmpty(userId))
            {
                return new List<ToDo>();
            }

            var todos = await _repository.GetAll(userId);
            return todos.ToList();
        }
    }
}
