using Microsoft.EntityFrameworkCore;
using ToDoApp.Server.Domain;

namespace ToDoApp.Server.Infrastructure.Context
{
    public class ToDoContext : DbContext
    {
        public ToDoContext(DbContextOptions<ToDoContext> options)
        : base(options)
        {
        }
        public DbSet<ToDo> ToDos { get; set; }


    }
}
