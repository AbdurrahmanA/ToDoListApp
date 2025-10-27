using MailKit.Net.Smtp;
using Microsoft.Extensions.Configuration;
using MimeKit;
using ToDoApp.Server.Application.Interfaces;

namespace ToDoApp.Server.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var emailSettings = _config.GetSection("EmailSettings");
            var email = new MimeMessage();

            email.From.Add(
                new MailboxAddress(emailSettings["SenderName"], emailSettings["SenderEmail"])
            );
            email.To.Add(new MailboxAddress(toEmail, toEmail));
            email.Subject = subject;
            email.Body = new TextPart(MimeKit.Text.TextFormat.Html) { Text = body };

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(
                emailSettings["SmtpServer"],
                int.Parse(emailSettings["Port"]!),
                false
            );

            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }
    }
}
