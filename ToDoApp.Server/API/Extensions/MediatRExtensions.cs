using ToDoApp.Server.Infrastructure.Context;

namespace ToDoApp.Server.API.Extensions
    {
        public static class MediatRExtensions
        {
            public static IServiceCollection AddMediatRServices(this IServiceCollection services)
            {
                services.AddMediatR(cfg =>
                cfg.RegisterServicesFromAssembly(typeof(ToDoContext).Assembly));

                return services;
            }
        }
    }
