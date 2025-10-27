using System.Security.Claims;
using MediatR;
using Microsoft.AspNetCore.Http;
using ToDoApp.Server.Application.Interfaces;
using ToDoApp.Server.Domain;

namespace ToDoApp.Server.Application.CommandHandler.Update
{
    public class UpdateToDoCommentHandler : IRequestHandler<UpdateToDoCommand, ToDo?>
    {
        private readonly IToDoRepository _repository;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UpdateToDoCommentHandler(
            IToDoRepository repository,
            IHttpContextAccessor httpContextAccessor
        )
        {
            _repository = repository;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<ToDo?> Handle(
            UpdateToDoCommand request,
            CancellationToken cancellationToken
        )
        {
            var userId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

            if (string.IsNullOrEmpty(userId))
            {
                throw new UnauthorizedAccessException("Kullanıcı kimliği bulunamadı.");
            }


            var existingToDo = await _repository.GetById(request.id, userId);

            if (existingToDo == null)
            {
                return null;
            }

            existingToDo.Title = request.Title;
            existingToDo.Description = request.Description;
            existingToDo.IsCompleted = request.IsCompleted;
            existingToDo.DueDate = request.DueDate;
            existingToDo.RecurrenceRule = request.RecurrenceRule;

            await _repository.Update(existingToDo);

            return existingToDo;
        }
    }
}
