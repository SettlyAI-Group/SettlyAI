namespace SettlyModels.OAutOptions;

public class ExternalUser
{
    public string Provider { get; set; } = null!;
    public string ProviderUserId { get; set; } = null!;
    public string? Email { get; set; }
    public string? Name { get; set; }
    public string? AvatarUrl { get; set; }
}
