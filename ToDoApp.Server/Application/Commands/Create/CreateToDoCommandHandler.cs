using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Http;
using ToDoApp.Server.Application.Interfaces;
using ToDoApp.Server.Domain;

namespace ToDoApp.Server.Application.CommandHandler.Create
{
    public class CreateToDoCommandHandler : IRequestHandler<CreateToDoCommand, ToDo>
    {
        private readonly IToDoRepository _repository;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CreateToDoCommandHandler(
            IToDoRepository repository,
            IHttpContextAccessor httpContextAccessor
        )
        {
            _repository = repository;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<ToDo> Handle(
            CreateToDoCommand request,
            CancellationToken cancellationToken
        )
        {
            var userClaims = _httpContextAccessor.HttpContext?.User;

            var userId = userClaims?.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                throw new UnauthorizedAccessException("Kullanıcı kimliği bulunamadı.");
            }

            var toDo = new ToDo
            {
                Title = request.Title,
                Description = request.Description,
                IsCompleted = request.IsCompleted,
                DueDate = request.DueDate,
                RecurrenceRule = request.RecurrenceRule,
                ApplicationUserId = userId,
            };

            await _repository.Create(toDo);

            return toDo;
        }
    }
}
