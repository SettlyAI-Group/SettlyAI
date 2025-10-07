using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ISettlyService;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SettlyModels;

namespace SettlyService
{
    public class CreateTokenService : ICreateTokenService
    {
        private readonly JWTConfig jwtConfig;
        public CreateTokenService(IOptions<JWTConfig> options)
        {
            jwtConfig = options.Value;
        }

        public string CreateRefreshToken(string userName, int userId)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, userName),
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim("tokenType", "refreshToken"),
            };

            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtConfig.SecretKey));
            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new JwtSecurityToken(
                    issuer: jwtConfig.Issuer,
                    audience: jwtConfig.Audience,
                    claims: claims,
                    expires: DateTime.UtcNow.AddDays(jwtConfig.ExpireDays),
                    signingCredentials: cred
                    );

            return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
        }

        public string CreateAccessToken(string userName, int userId)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, userName),
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim("tokenType", "accessToken"),
            };

            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtConfig.SecretKey));
            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new JwtSecurityToken(
                    issuer: jwtConfig.Issuer,
                    audience: jwtConfig.Audience,
                    claims: claims,
                    expires: DateTime.UtcNow.AddMinutes(jwtConfig.ExpireMinutes),
                    signingCredentials: cred
                    );

            return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
        }

        public bool ValidateRefreshToken(string refreshToken, out string? userName, out int userId)
        {
            userName = null;
            userId = 0;
            try
            {
                var handler = new JwtSecurityTokenHandler();
                var principal = handler.ValidateToken(refreshToken, new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = jwtConfig.Issuer,
                    ValidateAudience = true,
                    ValidAudience = jwtConfig.Audience,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtConfig.SecretKey)),
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.FromMinutes(5)
                }, out _);

                // 1) check tokenType must be refreshToken
                var tokenType = principal.FindFirst("tokenType")?.Value;
                if (!string.Equals(tokenType, "refreshToken", StringComparison.OrdinalIgnoreCase))
                    return false;

                // 2) get userId
                var userIdString = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrWhiteSpace(userIdString) || !int.TryParse(userIdString, out userId))
                    return false;

                // 3) get userName
                userName = principal.FindFirst(ClaimTypes.Name)?.Value
                           ?? principal.Identity?.Name;

                return !string.IsNullOrEmpty(userName);

            }
            catch { return false; }
        }
    }
}
