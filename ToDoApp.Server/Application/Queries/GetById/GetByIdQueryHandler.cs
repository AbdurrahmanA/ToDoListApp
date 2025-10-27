using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Http;
using ToDoApp.Server.Application.Interfaces;
using ToDoApp.Server.Domain;

namespace ToDoApp.Server.Application.QueryHandler.GetById
{
    public class GetByIdQueryHandler : IRequestHandler<GetByIdQuery, ToDo?>
    {
        private readonly IToDoRepository _repository;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public GetByIdQueryHandler(
            IToDoRepository repository,
            IHttpContextAccessor httpContextAccessor
        )
        {
            _repository = repository;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<ToDo?> Handle(GetByIdQuery request, CancellationToken cancellationToken)
        {
            var userId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

            if (string.IsNullOrEmpty(userId))
            {
                return null;
            }

            var todo = await _repository.GetById(request.Id, userId);

            return todo;
        }
    }
}
