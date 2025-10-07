using MediatR;
using ToDoApp.Server.Application.Interfaces;
using ToDoApp.Server.Domain;

namespace ToDoApp.Server.Application.CommandHandler.Delete
{
    public class DeleteToDoCommandHandler : IRequestHandler<DeleteToDoCommand, ToDo>
    {
        private readonly IToDoRepository _repository;

        public DeleteToDoCommandHandler(IToDoRepository repository)
        {
            _repository = repository;
        }

        public async Task<ToDo> Handle(DeleteToDoCommand request, CancellationToken cancellationToken)
        {
            var rmv = await _repository.GetById(request.id);
            if (rmv == null) return null;
            await _repository.Delete(rmv.id);
            return rmv;
        }
    }
}
