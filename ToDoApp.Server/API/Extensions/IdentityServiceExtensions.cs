using Microsoft.AspNetCore.Identity;
using ToDoApp.Server.Domain;
using ToDoApp.Server.Infrastructure.Context;
using ToDoApp.Server.Infrastructure.Localization; // YENİ USING

namespace ToDoApp.Server.API.Extensions
{
    public static class IdentityServiceExtensions
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services)
        {
            services
                .AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<ToDoContext>()
                .AddDefaultTokenProviders()
                .AddErrorDescriber<TurkishIdentityErrorDescriber>();
            return services;
        }
    }
}
