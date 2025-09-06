namespace SettlyModels.Dtos;

public class OAuthLoginRequestDto
{
    public string Provider { get; set; } = null!;
    public string Code { get; set; } = null!;
}
