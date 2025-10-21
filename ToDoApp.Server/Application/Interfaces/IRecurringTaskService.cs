namespace ToDoApp.Server.Application.Interfaces
{
    public interface IRecurringTaskService
    {
        /// <summary>
        /// Tekrar kuralı olan ve zamanı geçmiş görevleri kontrol edip
        /// bugüne kadar olan eksik görevleri oluşturur.
        /// </summary>
        Task GenerateRecurringTasks();
    }
}
