using ToDoApp.Server.Domain;

namespace ToDoApp.Server.Application.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(ApplicationUser user, IList<string> roles);
    }
}
