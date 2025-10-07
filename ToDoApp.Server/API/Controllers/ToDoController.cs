using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ToDoApp.Server.Application.CommandHandler.Create;
using ToDoApp.Server.Application.CommandHandler.Delete;
using ToDoApp.Server.Application.CommandHandler.Update;
using ToDoApp.Server.Application.QueryHandler.GetAll;
using ToDoApp.Server.Application.QueryHandler.GetById;

namespace ToDoApp.Server.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ToDoController : ControllerBase
    {
        private readonly IMediator _mediator;

        public ToDoController(IMediator mediator)
        {
            _mediator = mediator;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var allToDo = await _mediator.Send(new GetAllToDoQuery());
            return Ok(allToDo);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var toDo = await _mediator.Send(new GetByIdQuery(id));
            return Ok(toDo);
        }
        [HttpPost]
        public async Task<IActionResult> Create(CreateToDoCommand createToDoCommand)
        {
            var newToDo = await _mediator.Send(createToDoCommand);
            return Ok(newToDo);
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
             var deleted = await _mediator.Send(new DeleteToDoCommand(id));
            if (deleted == null) return NotFound();
            return Ok(deleted);
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, UpdateToDoCommand updateToDoCommand)
        {
            var updatedToDo = await _mediator.Send(new UpdateToDoCommand(id,updateToDoCommand.Title,updateToDoCommand.Description,updateToDoCommand.IsCompleted));
            return Ok(updatedToDo);
        }
    }
}
