using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using ToDoApp.Server.Application.Interfaces;
using ToDoApp.Server.Infrastructure.Context;
using ToDoApp.Server.Infrastructure.Repositories;
using ToDoApp.Server.Infrastructure.Services;

namespace ToDoApp.Server.API.Extensions
{
    public static class ServiceExtensions
    {
        public static IServiceCollection AddCoreServices(
            this IServiceCollection services,
            IConfiguration configuration
        )
        {
            services.AddControllers();
            services.AddEndpointsApiExplorer();

            services.AddSwaggerGen(options =>
            {
                options.AddSecurityDefinition(
                    "Bearer",
                    new OpenApiSecurityScheme
                    {
                        In = ParameterLocation.Header,
                        Description =
                            "Lütfen 'Bearer ' yazdıktan sonra bir boşluk bırakıp JWT'nizi girin.",
                        Name = "Authorization",
                        Type = SecuritySchemeType.ApiKey,
                        Scheme = "Bearer",
                    }
                );
                options.AddSecurityRequirement(
                    new OpenApiSecurityRequirement
                    {
                        {
                            new OpenApiSecurityScheme
                            {
                                Reference = new OpenApiReference
                                {
                                    Type = ReferenceType.SecurityScheme,
                                    Id = "Bearer",
                                },
                            },
                            new string[] { }
                        },
                    }
                );
            });

            services.AddScoped<IToDoRepository, ToDoRepository>();
            services.AddScoped<IEmailService, EmailService>();


            services.AddDbContext<ToDoContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection"))
            );

            return services;
        }
    }
}
