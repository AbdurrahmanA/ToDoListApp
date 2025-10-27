using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using ToDoApp.Server.Application.DTOs;
using ToDoApp.Server.Application.Interfaces;
using ToDoApp.Server.Domain;

namespace ToDoApp.Server.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _config;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            ITokenService tokenService,
            IEmailService emailService,
            IConfiguration config
        )
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _emailService = emailService;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto registerDto)
        {
            var existingEmail = await _userManager.FindByEmailAsync(registerDto.Email);
            if (existingEmail != null)
            {
                return BadRequest(new[] { new { message = "Bu e-posta adresi zaten kullanılıyor." } });
            }

            var existingUsername = await _userManager.FindByNameAsync(registerDto.Username);
            if (existingUsername != null)
            {
                return BadRequest(new[] { new { message = "Bu kullanıcı adı zaten kullanılıyor." } });
            }

            var user = new ApplicationUser
            {
                UserName = registerDto.Username,
                Email = registerDto.Email,
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            try
            {
                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
                var confirmationLink =
                    $"{_config["SpaBaseUrl"]}/confirm-email?userId={user.Id}&token={token}";
                await _emailService.SendEmailAsync(
                    user.Email!,
                    "ToDoApp Hesabınızı Doğrulayın",
                    $"Lütfen ToDoApp hesabınızı doğrulamak için aşağıdaki linke tıklayın: <a href='{confirmationLink}'>Hesabımı Doğrula</a>"
                );
            }
            catch (Exception ex)
            {
                Console.WriteLine($"E-posta gönderilemedi: {ex.Message}");
            }

            return Ok(
                new
                {
                    Message = "Kullanıcı başarıyla oluşturuldu. Lütfen e-postanızı kontrol ederek hesabınızı doğrulayın.",
                }
            );
        }
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            if (user == null)
            {
                return Unauthorized("Geçersiz e-posta veya şifre.");
            }

            if (!await _userManager.IsEmailConfirmedAsync(user))
            {
                return Unauthorized("Lütfen giriş yapmadan önce e-posta adresinizi doğrulayın.");
            }

            var result = await _signInManager.CheckPasswordSignInAsync(
                user,
                loginDto.Password,
                false
            );

            if (!result.Succeeded)
            {
                return Unauthorized("Geçersiz e-posta veya şifre.");
            }

            var roles = await _userManager.GetRolesAsync(user);

            return new UserDto
            {
                Username = user.UserName!,
                Token = _tokenService.CreateToken(user, roles),
            };
        }

        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(
            [FromQuery] string userId,
            [FromQuery] string token
        )
        {
            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(token))
                return BadRequest("Geçersiz doğrulama parametreleri.");

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return NotFound("Kullanıcı bulunamadı.");

            try
            {
                token = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(token));
            }
            catch (Exception)
            {
                return BadRequest("Geçersiz token formatı.");
            }

            var result = await _userManager.ConfirmEmailAsync(user, token);

            if (result.Succeeded)
            {
                return Ok("E-posta adresiniz başarıyla doğrulandı. Artık giriş yapabilirsiniz.");
            }

            return BadRequest("E-posta doğrulanamadı.");
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordDto forgotPasswordDto)
        {
            var user = await _userManager.FindByEmailAsync(forgotPasswordDto.Email);
            if (user == null)
            {
                return Ok(
                    new
                    {
                        Message = "Şifre sıfırlama talebiniz alındı. E-posta adresiniz sistemimizde kayıtlıysa, size bir sıfırlama linki göndereceğiz.",
                    }
                );
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

            var resetLink =
                $"{_config["SpaBaseUrl"]}/reset-password?email={user.Email}&token={token}";

            await _emailService.SendEmailAsync(
                user.Email!,
                "ToDoApp Şifre Sıfırlama",
                $"Lütfen şifrenizi sıfırlamak için aşağıdaki linke tıklayın: <a href='{resetLink}'>Şifremi Sıfırla</a>"
            );

            return Ok(
                new
                {
                    Message = "Şifre sıfırlama talebiniz alındı. E-posta adresiniz sistemimizde kayıtlıysa, size bir sıfırlama linki göndereceğiz.",
                }
            );
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto resetPasswordDto)
        {
            var user = await _userManager.FindByEmailAsync(resetPasswordDto.Email);
            if (user == null)
            {
                return BadRequest(
                    new[]
                    {
                        new
                        {
                            code = "InvalidRequest",
                            description = "Şifre sıfırlanamadı. Lütfen tekrar deneyin.",
                        },
                    }
                );
            }

            var isSamePassword = await _userManager.CheckPasswordAsync(
                user,
                resetPasswordDto.NewPassword
            );
            if (isSamePassword)
            {
                return BadRequest(
                    new[]
                    {
                        new
                        {
                            code = "SameAsOldPassword",
                            description = "Yeni şifre, mevcut şifrenizle aynı olamaz.",
                        },
                    }
                );
            }

            try
            {
                var token = Encoding.UTF8.GetString(
                    WebEncoders.Base64UrlDecode(resetPasswordDto.Token)
                );
                var result = await _userManager.ResetPasswordAsync(
                    user,
                    token,
                    resetPasswordDto.NewPassword
                );

                if (result.Succeeded)
                {
                    return Ok(new { Message = "Şifreniz başarıyla sıfırlandı." });
                }

                return BadRequest(result.Errors);
            }
            catch (Exception)
            {
                return BadRequest(
                    new[] { new { code = "InvalidToken", description = "Geçersiz token formatı." } }
                );
            }
        }

        [Authorize]
        [HttpGet("profile")]
        public async Task<ActionResult<UserProfileDto>> GetUserProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return NotFound("Kullanıcı bulunamadı.");

            return new UserProfileDto { Username = user.UserName!, Email = user.Email! };
        }

        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword(ChangePasswordDto changePasswordDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound("Kullanıcı bulunamadı.");
            }

            if (changePasswordDto.CurrentPassword == changePasswordDto.NewPassword)
            {
                return BadRequest(
                    new[]
                    {
                        new
                        {
                            code = "SameAsOldPassword",
                            description = "Yeni şifre, mevcut şifrenizle aynı olamaz.",
                        },
                    }
                );
            }

            var result = await _userManager.ChangePasswordAsync(
                user,
                changePasswordDto.CurrentPassword,
                changePasswordDto.NewPassword
            );

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Ok(new { Message = "Şifreniz başarıyla güncellendi." });
        }
    }
}
