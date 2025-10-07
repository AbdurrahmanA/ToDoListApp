using ToDoApp.Server.Domain;

namespace ToDoApp.Server.Application.Interfaces
{
    public interface IToDoRepository
    {
        Task<List<ToDo>> GetAll();
        Task<ToDo> GetById(Guid id);
        Task Create(ToDo todo);
        Task Update(ToDo todo);
        Task Delete(Guid id);
    }
}
