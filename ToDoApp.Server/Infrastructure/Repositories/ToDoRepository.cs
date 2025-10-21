using Microsoft.EntityFrameworkCore;
using ToDoApp.Server.Application.Interfaces;
using ToDoApp.Server.Domain;
using ToDoApp.Server.Infrastructure.Context;

namespace ToDoApp.Server.Infrastructure.Repositories
{
    public class ToDoRepository : IToDoRepository
    {
        private readonly ToDoContext _context;

        public ToDoRepository(ToDoContext context)
        {
            _context = context;
        }

        public async Task Create(ToDo todo)
        {
            await _context.ToDos.AddAsync(todo);
            await _context.SaveChangesAsync();
        }

        // GÜNCELLENDİ: Artık sadece o kullanıcıya ait görevi arar.
        public async Task<ToDo?> GetById(Guid id, string userId)
        {
            return await _context.ToDos
                .FirstOrDefaultAsync(t => t.id == id && t.ApplicationUserId == userId);
        }

        public async Task<List<ToDo>> GetAll(string userId)
        {
            return await _context.ToDos
                .Where(t => t.ApplicationUserId == userId)
                .ToListAsync();
        }

        public async Task Update(ToDo todo)
        {
            _context.ToDos.Update(todo);
            await _context.SaveChangesAsync();
        }

        // GÜNCELLENDİ: Önce görevin o kullanıcıya ait olup olmadığını kontrol eder, sonra siler.
        public async Task<ToDo?> Delete(Guid id, string userId)
        {
            // Güvenli GetById metodumuzu kullanarak görevi buluyoruz.
            var todoToDelete = await GetById(id, userId);

            if (todoToDelete != null)
            {
                _context.ToDos.Remove(todoToDelete);
                await _context.SaveChangesAsync();
            }

            return todoToDelete; // Silinen (veya null) görevi döndürür.
        }

        public async Task<IEnumerable<ToDo>> GetAllRecurringTaskSources()
        {
            return await _context.ToDos
                .Where(t => t.RecurrenceRule != null && t.RecurrenceRule != "none")
                .ToListAsync();
        }

        public async Task<bool> TaskExists(string title, DateTime dueDate)
        {
            return await _context.ToDos
                .AnyAsync(t => t.Title == title && t.DueDate.HasValue && t.DueDate.Value.Date == dueDate.Date);
        }
    }
}