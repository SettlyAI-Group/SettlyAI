using ISettlyService;

namespace SettlyService;

public class StubEmailSender : IEmailSender
{
    public Task SendAsync(string to, string subject, string body)
    {
        Console.WriteLine($"[MOCK EMAIL] To: {to}, Subject: {subject}, Body: {body}");
        return Task.CompletedTask;
    }
}
