using AutoMapper;
using Duende.IdentityModel.Client;
using SettlyModels.OAutOptions;

namespace SettlyService.Mappings;

public class OAuthMappingProfile : Profile
{
    public OAuthMappingProfile()
    {
        CreateMap<UserInfoResponse, ExternalUser>()
            .ForMember(dest => dest.ProviderUserId, opt => opt.MapFrom(src => GetClaimValue(src, "sub") ?? GetClaimValue(src, "id")))
            .ForMember(dest => dest.Email, opt => opt.MapFrom(src => GetClaimValue(src, "email")))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => GetClaimValue(src, "name")))
            .ForMember(dest => dest.AvatarUrl, opt => opt.MapFrom(src => GetClaimValue(src, "picture")))
            .ForMember(dest => dest.Provider, opt => opt.Ignore());
    }

    private static string? GetClaimValue(UserInfoResponse response, string claimType)
    {
        return response.Claims.FirstOrDefault(c => c.Type == claimType)?.Value;
    }
}