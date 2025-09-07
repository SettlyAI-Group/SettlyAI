namespace SettlyModels.OAutOptions;

public class OAuthOptions
{
    public Dictionary<string, OAuthProviderOptions> Providers { get; set; } = new();
}
