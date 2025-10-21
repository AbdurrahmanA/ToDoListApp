using Hangfire;
using ToDoApp.Server.Application.Interfaces;
using ToDoApp.Server.Infrastructure.Services;

namespace ToDoApp.Server.API.Extensions
{
    public static class HangfireExtension
    {
        public static IServiceCollection AddHangfireConfiguration(
            this IServiceCollection services,
            IConfiguration configuration
        )
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            services.AddHangfire(config => config.UseSqlServerStorage(connectionString));

            services.AddHangfireServer();

            services.AddTransient<IRecurringTaskService, RecurringTaskService>();

            return services;
        }
    }
}
