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
            var today = DateTime.Today;
            var allRecurringSources = await _toDoRepository.GetAllRecurringTaskSources();

            // Görevleri başlıklarına ve tekrar kurallarına göre gruplayarak
            // her bir tekrar zincirini ayrı ayrı ele alıyoruz.
            var recurringChains = allRecurringSources.GroupBy(t => new
            {
                t.Title,
                t.RecurrenceRule,
            });

            foreach (var chain in recurringChains)
            {
                // Her bir zincirdeki en son tarihli görevi buluyoruz.
                var latestTask = chain.OrderByDescending(t => t.DueDate).First();

                // Eğer zincirdeki son görev zaten bugün veya gelecek bir tarih içinse,
                // bu zincirle ilgili bir şey yapmaya gerek yok.
                if (latestTask.DueDate.HasValue && latestTask.DueDate.Value.Date >= today)
                {
                    continue;
                }

                // Eğer en son görev geçmişte kaldıysa, o tarihten bugüne kadar olan
                // tüm eksik görevleri oluşturmaya başlıyoruz.
                var nextDueDate = latestTask.DueDate.HasValue
                    ? latestTask.DueDate.Value.Date
                    : today.AddDays(-1);

                while (nextDueDate < today)
                {
                    // Bir sonraki tekrar tarihini hesapla.
                    nextDueDate = GetNextDueDate(nextDueDate, latestTask.RecurrenceRule);

                    // Mükerrer görev oluşturmamak için bu tarihte bir görev var mı diye kontrol et.
                    bool taskExists = await _toDoRepository.TaskExists(
                        latestTask.Title,
                        nextDueDate
                    );
                    if (!taskExists)
                    {
                        // Yeni görevi oluştur ve veritabanına kaydet.
                        var newToDo = new ToDo
                        {
                            Title = latestTask.Title,
                            Description = latestTask.Description,
                            IsCompleted = false,
                            DueDate = nextDueDate,
                            RecurrenceRule = latestTask.RecurrenceRule,
                        };
                        await _toDoRepository.Create(newToDo);
                    }
                }
            }
        }

        private DateTime GetNextDueDate(DateTime currentDate, string? recurrenceRule)
        {
            return recurrenceRule switch
            {
                "daily" => currentDate.AddDays(1),
                "weekly" => currentDate.AddDays(7),
                "monthly" => currentDate.AddMonths(1),
                _ => currentDate.AddDays(999), // Tanımsız kuralda döngüden çıkmak için ileri bir tarih
            };
        }
    }
}
