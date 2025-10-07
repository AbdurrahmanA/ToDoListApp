using ToDoApp.Server.Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using ToDoApp.Server.API.Extensions;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCoreServices(builder.Configuration);
builder.Services.AddAppCors();
builder.Services.AddMediatRServices();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(CorsExtensions.MyAllowSpecificOrigins);

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
