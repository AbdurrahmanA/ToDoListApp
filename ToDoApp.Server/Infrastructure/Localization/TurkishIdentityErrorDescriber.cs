using Microsoft.AspNetCore.Identity;

namespace ToDoApp.Server.Infrastructure.Localization
{
    public class TurkishIdentityErrorDescriber : IdentityErrorDescriber
    {
        public override IdentityError DefaultError() =>
            new() { Code = nameof(DefaultError), Description = "Bilinmeyen bir hata oluştu." };

        public override IdentityError ConcurrencyFailure() =>
            new()
            {
                Code = nameof(ConcurrencyFailure),
                Description = "İyimser eşzamanlılık hatası, nesne değiştirildi.",
            };

        public override IdentityError PasswordMismatch() =>
            new() { Code = nameof(PasswordMismatch), Description = "Yanlış şifre." };

        public override IdentityError InvalidToken() =>
            new() { Code = nameof(InvalidToken), Description = "Geçersiz token." };

        public override IdentityError LoginAlreadyAssociated() =>
            new()
            {
                Code = nameof(LoginAlreadyAssociated),
                Description = "Bu kullanıcı adı ile zaten bir giriş yapılmış.",
            };

        public override IdentityError InvalidUserName(string userName) =>
            new()
            {
                Code = nameof(InvalidUserName),
                Description =
                    $"'{userName}' kullanıcı adı geçersiz, sadece harf ve rakam içerebilir.",
            };

        public override IdentityError InvalidEmail(string email) =>
            new()
            {
                Code = nameof(InvalidEmail),
                Description = $"'{email}' e-posta adresi geçersiz.",
            };

        public override IdentityError DuplicateUserName(string userName) =>
            new()
            {
                Code = nameof(DuplicateUserName),
                Description = $"'{userName}' kullanıcı adı zaten alınmış.",
            };

        public override IdentityError DuplicateEmail(string email) =>
            new()
            {
                Code = nameof(DuplicateEmail),
                Description = $"'{email}' e-posta adresi zaten kullanılıyor.",
            };

        public override IdentityError InvalidRoleName(string role) =>
            new() { Code = nameof(InvalidRoleName), Description = $"'{role}' rol adı geçersiz." };

        public override IdentityError DuplicateRoleName(string role) =>
            new()
            {
                Code = nameof(DuplicateRoleName),
                Description = $"'{role}' rol adı zaten kullanılıyor.",
            };

        public override IdentityError UserAlreadyHasPassword() =>
            new()
            {
                Code = nameof(UserAlreadyHasPassword),
                Description = "Kullanıcının zaten bir şifresi var.",
            };

        public override IdentityError UserLockoutNotEnabled() =>
            new()
            {
                Code = nameof(UserLockoutNotEnabled),
                Description = "Bu kullanıcı için kilitleme aktif değil.",
            };

        public override IdentityError UserAlreadyInRole(string role) =>
            new()
            {
                Code = nameof(UserAlreadyInRole),
                Description = $"Kullanıcı zaten '{role}' rolünde.",
            };

        public override IdentityError UserNotInRole(string role) =>
            new()
            {
                Code = nameof(UserNotInRole),
                Description = $"Kullanıcı '{role}' rolünde değil.",
            };

        public override IdentityError PasswordTooShort(int length) =>
            new()
            {
                Code = nameof(PasswordTooShort),
                Description = $"Şifre en az {length} karakter olmalıdır.",
            };

        public override IdentityError PasswordRequiresNonAlphanumeric() =>
            new()
            {
                Code = nameof(PasswordRequiresNonAlphanumeric),
                Description = "Şifre en az bir alfanümerik olmayan karakter içermelidir.",
            };

        public override IdentityError PasswordRequiresDigit() =>
            new()
            {
                Code = nameof(PasswordRequiresDigit),
                Description = "Şifre en az bir rakam ('0'-'9') içermelidir.",
            };

        public override IdentityError PasswordRequiresLower() =>
            new()
            {
                Code = nameof(PasswordRequiresLower),
                Description = "Şifre en az bir küçük harf ('a'-'z') içermelidir.",
            };

        public override IdentityError PasswordRequiresUpper() =>
            new()
            {
                Code = nameof(PasswordRequiresUpper),
                Description = "Şifre en az bir büyük harf ('A'-'Z') içermelidir.",
            };

        public override IdentityError RecoveryCodeRedemptionFailed() =>
            new()
            {
                Code = nameof(RecoveryCodeRedemptionFailed),
                Description = "Kurtarma kodu kullanılamadı.",
            };
    }
}
