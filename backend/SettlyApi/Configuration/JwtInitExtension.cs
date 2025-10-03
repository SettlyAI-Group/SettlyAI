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

                options.Events = new JwtBearerEvents
                {
                    OnMessageReceived = ctx =>
                    {
                        // get accessToken from HttpOnly Cookie
                        ctx.Token = ctx.Request.Cookies["accessToken"];
                        return Task.CompletedTask;
                    },
                    OnTokenValidated = ctx =>
                    {
                        // Validate that the token is an access token, not a refresh token
                        var tokenType = ctx.Principal?.FindFirst("tokenType")?.Value;
                        if (!string.Equals(tokenType, "accessToken", StringComparison.OrdinalIgnoreCase))
                        {
                            ctx.Fail("Invalid token type. Access token required.");
                        }
                        return Task.CompletedTask;
                    }
                };
            });
        }
    }
}
