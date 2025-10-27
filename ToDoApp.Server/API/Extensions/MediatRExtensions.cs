namespace ToDoApp.Server.API.Extensions
{
    public static class MediatRExtensions
    {
        public static IServiceCollection AddMediatRServices(this IServiceCollection services)
        {
            services.AddMediatR(cfg =>
            {
                cfg.RegisterServicesFromAssembly(typeof(Program).Assembly);
            });

            return services;
        }
    }
}
