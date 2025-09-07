using AutoMapper;
using Duende.IdentityModel.Client;
using ISettlyService;
using Microsoft.Extensions.Options;
using SettlyModels.OAutOptions;

namespace SettlyService;

public class OAuthService : IOAuthService
{
    private readonly IHttpClientFactory _http;
    private readonly OAuthOptions _opt;
    private readonly IMapper _mapper;

    public OAuthService(IHttpClientFactory httpClientFactory, IOptions<OAuthOptions> options, IMapper mapper)
    {
        _http = httpClientFactory;
        _opt = options.Value;
        _mapper = mapper;
    }
    public async Task<OAuthTokenResult> ExchangeTokenAsync(string provider, string code, CancellationToken ct = default)
    {
        var providerKey = provider.ToLowerInvariant();

        if (!_opt.Providers.TryGetValue(providerKey, out var providerConfig))
        {
            throw new ArgumentException($"Unsupported provider: {provider}");
        }

        var client = _http.CreateClient();

        var tokenResponse = await client.RequestAuthorizationCodeTokenAsync(
            new AuthorizationCodeTokenRequest
            {
                Address = providerConfig.TokenEndpoint,
                ClientId = providerConfig.ClientId,
                ClientSecret = providerConfig.ClientSecret,
                Code = code,
                RedirectUri = providerConfig.RedirectUri
            }, ct);

        if (tokenResponse.IsError)
        {
            throw new InvalidOperationException($"[{provider}] token exchange failed: {tokenResponse.Error}");
        }

        return new OAuthTokenResult
        {
            AccessToken  = tokenResponse.AccessToken!,
            IdToken      = tokenResponse.IdentityToken,
            ExpiresAt    = DateTimeOffset.UtcNow.AddSeconds(tokenResponse.ExpiresIn),
            RefreshToken = tokenResponse.RefreshToken
        };
    }

    public async Task<ExternalUser> GetUserAsync(string provider, string accessToken, string? idToken = null, CancellationToken ct = default)
    {
        var providerKey = provider.ToLowerInvariant();

        if (!_opt.Providers.TryGetValue(providerKey, out var providerConfig))
        {
            throw new ArgumentException($"Unsupported provider: {provider}");
        }

        var client = _http.CreateClient();

        var userInfoResponse = await client.GetUserInfoAsync(new UserInfoRequest
        {
            Address = providerConfig.UserInfoEndpoint,
            Token = accessToken
        }, ct);

        if (userInfoResponse.IsError)
        {
            throw new InvalidOperationException($"[{provider}] user info request failed: {userInfoResponse.Error}");
        }

        var externalUser = _mapper.Map<ExternalUser>(userInfoResponse);
        externalUser.Provider = provider;

        if (string.IsNullOrEmpty(externalUser.ProviderUserId))
        {
            throw new InvalidOperationException($"[{provider}] user ID not found in response");
        }

        return externalUser;
    }


}
