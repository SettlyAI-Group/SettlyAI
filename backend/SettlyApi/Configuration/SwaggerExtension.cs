using Microsoft.OpenApi.Models;

namespace SettlyApi.Configuration
{
    public static class SwaggerExtention
    {

        //register swagger
        public static void AddSwaggerConfig(this IServiceCollection services)
        {
            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("SettlyService", new Microsoft.OpenApi.Models.OpenApiInfo()
                {
                    Title = "SettlyAI",
                    Version = "1.0.0.0",
                    Description = "SettlyAI Web Api",
                    Contact = new OpenApiContact()
                });
                options.EnableAnnotations();

                // Add JWT Authorization
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
                {
                    Description = "please 'Bearer+space+token', For instance: Bearer eyJhbGciOi...",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });
                options.AddSecurityRequirement(new OpenApiSecurityRequirement()
                {
                    {
                        new OpenApiSecurityScheme()
                        {
                            Reference=new OpenApiReference()
                            {
                            Type=ReferenceType.SecurityScheme,
                            Id="Bearer"
                            }
                        },
                        new List<string>()
                    }
                });
            });
        }
        public static void UseSwaggerConfig(this IApplicationBuilder app, IHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(options =>
                {
                    options.SwaggerEndpoint("/swagger/SettlyService/swagger.json", "SettlyService");
                });
            }
        }
    }
}
