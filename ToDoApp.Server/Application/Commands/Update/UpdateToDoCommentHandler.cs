using MediatR;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using ToDoApp.Server.Application.Interfaces;
using ToDoApp.Server.Domain;

namespace ToDoApp.Server.Application.CommandHandler.Update
{
    public class UpdateToDoCommentHandler : IRequestHandler<UpdateToDoCommand, ToDo?>
    {
        private readonly IToDoRepository _repository;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UpdateToDoCommentHandler(IToDoRepository repository, IHttpContextAccessor httpContextAccessor)
        {
            _repository = repository;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<ToDo?> Handle(UpdateToDoCommand request, CancellationToken cancellationToken)
        {
            var userId = _httpContextAccessor.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                throw new UnauthorizedAccessException("Kullanıcı kimliği bulunamadı.");
            }

            // 1. ADIM: Görevin mevcut sahibini doğrula
            // GetById metoduna hem görev ID'sini hem de kullanıcı ID'sini gönderiyoruz.
            var existingToDo = await _repository.GetById(request.id, userId);

            // Eğer görev bulunamazsa (ya ID yanlıştır ya da görev bu kullanıcıya ait değildir),
            // null döndürerek işlemi durdur.
            if (existingToDo == null)
            {
                return null;
            }

            // 2. ADIM: Görev bu kullanıcıya aitse, güncelleme işlemlerini yap.
            existingToDo.Title = request.Title;
            existingToDo.Description = request.Description;
            existingToDo.IsCompleted = request.IsCompleted;
            existingToDo.DueDate = request.DueDate;
            existingToDo.RecurrenceRule = request.RecurrenceRule;
            // existingToDo.Priority = request.Priority; // (Sizde bu yoktu)

            // 3. ADIM: Güncellenmiş nesneyi kaydet.
            await _repository.Update(existingToDo);

            return existingToDo;
        }
    }
}