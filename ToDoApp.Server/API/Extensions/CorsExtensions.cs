namespace ToDoApp.Server.API.Extensions
{
    public static class CorsExtensions
    {
        public const string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

        public static IServiceCollection AddAppCors(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy(name: MyAllowSpecificOrigins,
                    policy =>
                    {
                        policy.WithOrigins(
                            "http://localhost:4200",
                            "https://localhost:4200",
                            "https://localhost:50963"
                        )
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                    });
            });

            return services;
        }
    }
}
