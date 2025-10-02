using SettlyModels;

namespace SettlyService.Exceptions;

public class EmailUnverifiedException : AppException
{
    public EmailUnverifiedException(string message) : base(message, statusCode: 400)
    {
    }
}
