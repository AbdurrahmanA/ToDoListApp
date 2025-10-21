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

        public CreateToDoCommandHandler(IToDoRepository repository, IHttpContextAccessor httpContextAccessor)
        {
            _repository = repository;
            _httpContextAccessor = httpContextAccessor;
        }
        
        public async Task<ToDo> Handle(CreateToDoCommand request, CancellationToken cancellationToken)
        {
            // O anki HTTP isteğinden, JWT token'ı doğrulanmış kullanıcının kimlik bilgilerini alıyoruz.
            var userClaims = _httpContextAccessor.HttpContext?.User;

            // Kimlik bilgileri içinden kullanıcının benzersiz ID'sini (NameIdentifier) buluyoruz.
            var userId = userClaims?.FindFirstValue(ClaimTypes.NameIdentifier);

            // Eğer bir şekilde kullanıcı ID'si bulunamazsa (ki [Authorize] attribute'u buna izin vermez),
            // bir yetkisiz erişim hatası fırlatıyoruz. Bu bir güvenlik önlemidir.
            if (string.IsNullOrEmpty(userId))
            {
                throw new UnauthorizedAccessException("Kullanıcı kimliği bulunamadı.");
            }

            // Gelen istek (request) ve bulduğumuz kullanıcı ID'si ile yeni bir ToDo nesnesi oluşturuyoruz.
            var toDo = new ToDo 
            { 
                Title = request.Title,
                Description = request.Description,
                IsCompleted = request.IsCompleted,
                DueDate = request.DueDate,
                RecurrenceRule = request.RecurrenceRule,
                ApplicationUserId = userId // Görevi o anki kullanıcıya bağlıyoruz.
            };
            
            // Oluşturulan yeni ToDo nesnesini repository aracılığıyla veritabanına kaydediyoruz.
            await _repository.Create(toDo);
            
            // Kaydedilen nesneyi geri döndürüyoruz.
            return toDo;
        }
    }
}