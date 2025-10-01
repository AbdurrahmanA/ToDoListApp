using AngularWithASP.Server.Application.Domain;
using Microsoft.EntityFrameworkCore;

namespace AngularWithASP.Server.Application.Repository
{
    public class ToDoRepository : IToDoRepository
    {
        private readonly ToDoContext _context;

        public ToDoRepository(ToDoContext context)
        {
            _context = context;
        }

        public async Task Create(ToDo Todo)
        {
            await _context.ToDos.AddAsync(Todo);
            await _context.SaveChangesAsync();

        }

        public async Task Delete(Guid id)
        {
            var rmv = await _context.ToDos.FindAsync(id);

             _context.ToDos.Remove(rmv);
            await _context.SaveChangesAsync();

        }

        public async Task<List<ToDo>> GetAll()
        {
            return await _context.ToDos.ToListAsync();
             
        }

        public async Task<ToDo> GetById(Guid id)
        {
            return await _context.ToDos.FindAsync(id);
        }

        public async Task Update(ToDo todo)
        {
             _context.ToDos.Update(todo);
            await _context.SaveChangesAsync();

        }
    }
}
