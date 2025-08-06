namespace SettlyService.Exceptions;

public class EmailUnverifiedException : Exception
{
    public EmailUnverifiedException(string message) : base(message)
    {
    }
}
