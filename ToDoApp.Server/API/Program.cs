using Hangfire;
using ToDoApp.Server.API.Extensions;
using ToDoApp.Server.Application.Interfaces;

// WebApplication builder'ı oluşturuluyor.
var builder = WebApplication.CreateBuilder(args);

//----------------------------------------------------
// 1. SERVİS YAPILANDIRMASI (Dependency Injection)
//----------------------------------------------------
// Projenizin ihtiyaç duyduğu servisler burada kaydedilir.

// Temel servisleri ekler (Controllers, DbContext, Repository, Swagger'ın temeli vb.)
builder.Services.AddCoreServices(builder.Configuration);

// CORS ayarlarını ekler
builder.Services.AddAppCors();

// MediatR (CQRS) servislerini ekler
builder.Services.AddMediatRServices();

// Hangfire (Arka plan görevleri) servislerini ekler
builder.Services.AddHangfireConfiguration(builder.Configuration);

// ASP.NET Core Identity (Kullanıcı yönetimi) servislerini ekler
builder.Services.AddIdentityServices();
builder.Services.AddHttpContextAccessor();

// JWT Token kimlik doğrulama servislerini ekler
builder.Services.AddAuthenticationServices(builder.Configuration);

// Builder'dan uygulama nesnesi oluşturuluyor.
var app = builder.Build();

//----------------------------------------------------
// 2. UYGULAMA (MIDDLEWARE) YAPILANDIRMASI
//----------------------------------------------------
// Gelen HTTP isteklerinin hangi sırayla işleneceği burada belirlenir. Sıralama çok önemlidir.

// Sadece geliştirme ortamında çalışacak olan Swagger middleware'leri
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// HTTP isteklerini HTTPS'e yönlendirir
app.UseHttpsRedirection();

// Hangfire paneline /hangfire adresinden erişimi sağlar
app.UseHangfireDashboard("/hangfire");

// Angular projesinin statik dosyalarını (index.html, css, js) sunar
app.UseDefaultFiles();
app.UseStaticFiles();

// Endpoint yönlendirmesini aktif hale getirir
app.UseRouting();

// CORS politikasını uygular
app.UseCors(CorsExtensions.MyAllowSpecificOrigins);

// Kimlik doğrulama (Authentication) middleware'ini ekler. "Sen kimsin?" diye sorar.
app.UseAuthentication();

// Yetkilendirme (Authorization) middleware'ini ekler. "Bu işlemi yapmaya yetkin var mı?" diye sorar.
app.UseAuthorization();

// API Controller endpoint'lerini haritalar
app.MapControllers();

// Eşleşen bir API rotası bulunamazsa, isteği Angular'a yönlendirir
app.MapFallbackToFile("/index.html");

// Hangfire'daki tekrarlayan görevi kaydeder ve zamanlar
RecurringJob.AddOrUpdate<IRecurringTaskService>(
    "generate-recurring-tasks",
    service => service.GenerateRecurringTasks(),
    "0 3 * * *",
    new RecurringJobOptions { TimeZone = TimeZoneInfo.Local }
);

// Uygulamayı çalıştırır
app.Run();
