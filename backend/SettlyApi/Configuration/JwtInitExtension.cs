using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using SettlyModels;

namespace SettlyApi.Configuration
{
    public static class JwtInitExtension
    {
        public static void AddJWT(this IServiceCollection services, JWTConfig jWTConfig)
        {
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuer = true,
                    ValidIssuer = jWTConfig.Issuer,
                    ValidateAudience = true,
                    ValidAudience = jWTConfig.Audience,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jWTConfig.SecretKey))
                };
            });
        }
    }
}
