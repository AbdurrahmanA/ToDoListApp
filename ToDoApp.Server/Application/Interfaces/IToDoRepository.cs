using ToDoApp.Server.Domain;

namespace ToDoApp.Server.Application.Interfaces
{
    public interface IToDoRepository
    {
        Task<List<ToDo>> GetAll(string userId);
        Task<ToDo?> GetById(Guid id, string userId);
        Task Create(ToDo todo);
        Task Update(ToDo todo);
        Task<ToDo?> Delete(Guid id, string userId);
        Task<IEnumerable<ToDo>> GetAllRecurringTaskSources();
        Task<bool> TaskExists(string title, DateTime dueDate);
    }
}
