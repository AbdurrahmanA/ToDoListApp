using MediatR;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using ToDoApp.Server.Application.Interfaces;
using ToDoApp.Server.Domain;

namespace ToDoApp.Server.Application.CommandHandler.Delete
{
    public class DeleteToDoCommandHandler : IRequestHandler<DeleteToDoCommand, ToDo?>
    {
        private readonly IToDoRepository _repository;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public DeleteToDoCommandHandler(IToDoRepository repository, IHttpContextAccessor httpContextAccessor)
        {
            _repository = repository;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<ToDo?> Handle(DeleteToDoCommand request, CancellationToken cancellationToken)
        {
            var userId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return null;
            }

            // Repository'deki güvenli Delete metodunu çağırıyoruz.
            // Bu metot, sadece ID'si ve UserId'si eşleşen görevi silecektir.
            var deletedToDo = await _repository.Delete(request.id, userId);

            return deletedToDo;
        }
    }
}