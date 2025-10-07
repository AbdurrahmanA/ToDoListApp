using MediatR;
using ToDoApp.Server.Application.Interfaces;
using ToDoApp.Server.Domain;

namespace ToDoApp.Server.Application.CommandHandler.Create
{
    public class CreateToDoCommandHandler : IRequestHandler<CreateToDoCommand, ToDo>
    {
        private readonly IToDoRepository _repository;

        public CreateToDoCommandHandler(IToDoRepository repository)
        {
            _repository = repository;
        }
        //Mediator ile kullanılacak controllerda
        public async Task<ToDo> Handle(CreateToDoCommand request, CancellationToken cancellationToken)
        {
            var toDo = new ToDo { Description= request.Description, Title = request.Title };
            await _repository.Create(toDo);
            return toDo;
        }
    }
}
