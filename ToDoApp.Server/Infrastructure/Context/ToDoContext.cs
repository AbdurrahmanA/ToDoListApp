using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ToDoApp.Server.Domain;

namespace ToDoApp.Server.Infrastructure.Context
{
    public class ToDoContext : IdentityDbContext<ApplicationUser>
    {
        public ToDoContext(DbContextOptions<ToDoContext> options)
            : base(options) { }

        public DbSet<ToDo> ToDos { get; set; }
    }
}
