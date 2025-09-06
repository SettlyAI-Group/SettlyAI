using SettlyModels.OAutOptions;

namespace ISettlyService;

public interface IOAuthService
{

    Task<OAuthTokenResult> ExchangeTokenAsync(string provider, string code, CancellationToken ct = default);

    Task<ExternalUser> GetUserAsync(string provider, string accessToken, string? idToken = null,
        CancellationToken ct = default);

}
