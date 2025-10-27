using ToDoApp.Server.Application.Interfaces;
using ToDoApp.Server.Domain;

namespace ToDoApp.Server.Infrastructure.Services
{
    public class RecurringTaskService : IRecurringTaskService
    {
        private readonly IToDoRepository _toDoRepository;

        public RecurringTaskService(IToDoRepository toDoRepository)
        {
            _toDoRepository = toDoRepository;
        }

        public async Task GenerateRecurringTasks()
        {
            var allRecurringTasks = await _toDoRepository.GetAllRecurringTaskSources();

            var tasksByUser = allRecurringTasks.GroupBy(t => t.ApplicationUserId);

            foreach (var userTasks in tasksByUser)
            {
                var userId = userTasks.Key;
                if (string.IsNullOrEmpty(userId))
                    continue;

                foreach (var sourceTask in userTasks)
                {
                    if (
                        sourceTask.DueDate == null
                        || sourceTask.DueDate.Value.Date >= DateTime.Today
                    )
                    {
                        continue;
                    }

                    DateTime nextDueDate = sourceTask.DueDate.Value;
                    while (nextDueDate.Date < DateTime.Today)
                    {
                        if (sourceTask.RecurrenceRule == "daily")
                        {
                            nextDueDate = nextDueDate.AddDays(1);
                        }
                        else if (sourceTask.RecurrenceRule == "weekly")
                        {
                            nextDueDate = nextDueDate.AddDays(7);
                        }
                        else if (sourceTask.RecurrenceRule == "monthly")
                        {
                            nextDueDate = nextDueDate.AddMonths(1);
                        }
                        else
                        {
                            break;
                        }
                    }

                    bool taskAlreadyExists = await _toDoRepository.TaskExists(
                        sourceTask.Title,
                        nextDueDate,
                        userId
                    );

                    if (!taskAlreadyExists)
                    {
                        var newRecurringTask = new ToDo
                        {
                            Title = sourceTask.Title,
                            Description = sourceTask.Description,
                            IsCompleted = false,
                            CreatedAt = DateTime.Now,
                            DueDate = nextDueDate,
                            RecurrenceRule = sourceTask.RecurrenceRule,
                            ApplicationUserId = userId,
                        };

                        await _toDoRepository.Create(newRecurringTask);
                    }
                }
            }
        }
    }
}
