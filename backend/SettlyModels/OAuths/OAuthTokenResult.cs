namespace SettlyModels.OAutOptions;

public class OAuthTokenResult
{
    public string AccessToken { get; set; } = null!;
    public string? IdToken { get; set; }
    public DateTimeOffset ExpiresAt { get; set; }
    public string? RefreshToken { get; set; }
}
