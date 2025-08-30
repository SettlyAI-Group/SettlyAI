using ISettlyService;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using SettlyModels;

namespace SettlyService;

public class MailKitEmailService : IEmailService
{
    private readonly EmailSettings _settings;

    public MailKitEmailService(IOptions<EmailSettings> options)
    {
        _settings = options.Value;
    }

    public async Task SendAsync(string name,string to, string subject, string body)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Settly App", _settings.Username));
        message.To.Add(new MailboxAddress(name, to));
        message.Subject = subject;

        var builder = new BodyBuilder
        {
            TextBody = body,
            HtmlBody = $"<p>{body}</p>"
        };
        message.Body = builder.ToMessageBody();

        using var client = new SmtpClient();
        var option = Enum.Parse<SecureSocketOptions>(_settings.SecureSocketOption, true);
        await client.ConnectAsync(_settings.SmtpServer, _settings.Port, option);
        await client.AuthenticateAsync(_settings.Username, _settings.Password);
        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }
}
