using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ToDoApp.Server.Domain;

namespace ToDoApp.Server.Infrastructure.Context
{
    // DEĞİŞİKLİK: Artık DbContext yerine IdentityDbContext<ApplicationUser>'dan kalıtım alıyor
    public class ToDoContext : IdentityDbContext<ApplicationUser>
    {
        public ToDoContext(DbContextOptions<ToDoContext> options)
            : base(options) { }

        // Mevcut DbSet'iniz burada kalmaya devam ediyor
        public DbSet<ToDo> ToDos { get; set; }

        // NOT: Identity tabloları (Users, Roles vb.) buraya DbSet olarak eklenmez.
        // IdentityDbContext bunu sizin için otomatik olarak yönetir.
    }
}
