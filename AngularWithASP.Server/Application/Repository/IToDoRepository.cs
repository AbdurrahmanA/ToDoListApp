using AngularWithASP.Server.Application.Domain;

namespace AngularWithASP.Server.Application.Repository
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
