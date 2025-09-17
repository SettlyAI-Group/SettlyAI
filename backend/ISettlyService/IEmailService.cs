namespace ISettlyService;

public interface IEmailService
{
    Task SendAsync(string username, string to, string subject, string body);
}
