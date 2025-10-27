using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Http;
using ToDoApp.Server.Application.Interfaces;
using ToDoApp.Server.Domain;

namespace ToDoApp.Server.Application.CommandHandler.Delete
{
    public class DeleteToDoCommandHandler : IRequestHandler<DeleteToDoCommand, ToDo?>
    {
        private readonly IToDoRepository _repository;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public DeleteToDoCommandHandler(
            IToDoRepository repository,
            IHttpContextAccessor httpContextAccessor
        )
        {
            _repository = repository;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<ToDo?> Handle(
            DeleteToDoCommand request,
            CancellationToken cancellationToken
        )
        {
            var userId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

            if (string.IsNullOrEmpty(userId))
            {
                return null;
            }

            var deletedToDo = await _repository.Delete(request.id, userId);

            return deletedToDo;
        }
    }
}
