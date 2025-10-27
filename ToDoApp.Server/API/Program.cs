using Hangfire;
using ToDoApp.Server.API.Extensions;
using ToDoApp.Server.Application.Interfaces;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCoreServices(builder.Configuration);

builder.Services.AddAppCors();

builder.Services.AddMediatRServices();

builder.Services.AddHangfireConfiguration(builder.Configuration);

builder.Services.AddIdentityServices();
builder.Services.AddHttpContextAccessor();

builder.Services.AddAuthenticationServices(builder.Configuration);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseHangfireDashboard("/hangfire");

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseRouting();

app.UseCors(CorsExtensions.MyAllowSpecificOrigins);

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

RecurringJob.AddOrUpdate<IRecurringTaskService>(
    "generate-recurring-tasks",
    service => service.GenerateRecurringTasks(),
    "0 3 * * *",
    new RecurringJobOptions { TimeZone = TimeZoneInfo.Local }
);

app.Run();
