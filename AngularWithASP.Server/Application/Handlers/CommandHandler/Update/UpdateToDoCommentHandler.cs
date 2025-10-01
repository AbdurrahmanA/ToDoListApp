using AngularWithASP.Server.Application.Domain;
using AngularWithASP.Server.Application.Repository;
using MediatR;

namespace AngularWithASP.Server.Application.Handlers.CommandHandler.Update
{
    public class UpdateToDoCommentHandler : IRequestHandler<UpdateToDoCommand, ToDo>
    {
        private readonly IToDoRepository _repository;

        public UpdateToDoCommentHandler(IToDoRepository repository)
        {
            _repository = repository;
        }

        public async Task<ToDo> Handle(UpdateToDoCommand request, CancellationToken cancellationToken)
        {
            
            var toDo = await _repository.GetById(request.id);

            if (toDo == null) return null;

            toDo.Title = request.Title;
            toDo.Description = request.Description;
            toDo.IsCompleted = request.IsCompleted;

            await _repository.Update(toDo);

            return toDo;
        }
    }
}
