using Microsoft.EntityFrameworkCore;
using ToDoApp.Server.Application.Interfaces;
using ToDoApp.Server.Infrastructure.Context;
using ToDoApp.Server.Infrastructure.Repositories;

namespace ToDoApp.Server.API.Extensions
{
    public static class ServiceExtensions
    {
       public static IServiceCollection AddCoreServices(this IServiceCollection services,IConfiguration configuration)
        {
            services.AddControllers();
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();

            services.AddScoped<IToDoRepository, ToDoRepository>();

            services.AddDbContext<ToDoContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            return services;
        }
    }
}
