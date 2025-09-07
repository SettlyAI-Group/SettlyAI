namespace SettlyModels.OAutOptions;

public class OAuthProviderOptions
{
    public string ClientId { get; set; } = null!;
    public string ClientSecret { get; set; } = null!;
    public string RedirectUri { get; set; } = null!;
    public string TokenEndpoint { get; set; } = null!;
    public string UserInfoEndpoint { get; set; } = null!;
}