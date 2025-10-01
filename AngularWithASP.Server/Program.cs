using AngularWithASP.Server.Application.Domain;
using AngularWithASP.Server.Application.Repository;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Repository DI
builder.Services.AddScoped<IToDoRepository, ToDoRepository>();

// Database DI++
builder.Services.AddDbContext<ToDoContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// MediatR++
builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssembly(typeof(ToDoContext).Assembly));

// CORS policy++
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
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



var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// CORS middleware++
app.UseCors(MyAllowSpecificOrigins);

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
