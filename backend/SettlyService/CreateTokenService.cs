using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ISettlyService;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SettlyModels;
using SettlyModels.Entities;

namespace SettlyService
{
    public class CreateTokenService : ICreateTokenService
    {
        private readonly JWTConfig jwtConfig;
        public CreateTokenService(IOptions<JWTConfig> options)
        {
            jwtConfig = options.Value;
        }

        public string CreateToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtConfig.SecretKey));
            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new JwtSecurityToken(
                    issuer: jwtConfig.Issuer,
                    audience: jwtConfig.Audience,
                    claims: claims,
                    expires: DateTimeOffset.Now.LocalDateTime.AddSeconds(jwtConfig.ExpireSeconds),
                    signingCredentials: cred
                    );

            return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
        }
    }
}
