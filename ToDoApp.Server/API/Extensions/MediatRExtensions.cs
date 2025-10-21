namespace ToDoApp.Server.API.Extensions
{
    public static class MediatRExtensions
    {
        public static IServiceCollection AddMediatRServices(this IServiceCollection services)
        {
            services.AddMediatR(cfg =>
            {
                // --- DEĞİŞİKLİK BURADA ---
                // MediatR'a, Handler'ları araması için doğrudan ana projenin
                // giriş noktasını (Program.cs'in bulunduğu yeri) veriyoruz.
                // Projenizdeki tüm kodlar (Application, Infrastructure vb.)
                // bu ana assembly içinde derlenir.
                cfg.RegisterServicesFromAssembly(typeof(Program).Assembly);
            });

            return services;
        }
    }
}