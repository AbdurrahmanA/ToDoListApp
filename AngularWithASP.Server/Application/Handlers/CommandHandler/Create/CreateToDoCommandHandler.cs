using AngularWithASP.Server.Application.Domain;
using AngularWithASP.Server.Application.Repository;
using MediatR;

namespace AngularWithASP.Server.Application.Handlers.CommandHandler.Create
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
