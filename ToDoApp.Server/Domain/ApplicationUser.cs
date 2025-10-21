using Microsoft.AspNetCore.Identity;

namespace ToDoApp.Server.Domain
{
    // IdentityUser sınıfı bize Id, UserName, Email, PasswordHash gibi standart alanları hazır olarak verir.
    public class ApplicationUser : IdentityUser
    {
        // Gelecekte buraya kullanıcıyla ilgili ek alanlar (örneğin profil resmi URL'si) ekleyebilirsiniz.
    }
}
