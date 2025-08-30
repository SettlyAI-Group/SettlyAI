using AutoMapper;
using SettlyModels.Dtos;
using SettlyModels.Entities;

public class UserProfile : Profile
{
    public UserProfile()
    {
        CreateMap<UserUpdateDto, User>()
            .ForMember(d => d.Id,                 opt => opt.Ignore())
            .ForMember(d => d.CreatedAt,          opt => opt.Ignore())
            .ForMember(d => d.PasswordHash,       opt => opt.Ignore())
            .ForMember(d => d.EmailVerifications, opt => opt.Ignore())
            .ForMember(d => d.Favourites,         opt => opt.Ignore())
            .ForMember(d => d.InspectionPlans,    opt => opt.Ignore())
            .ForMember(d => d.LoanCalculations,   opt => opt.Ignore())
            .ForMember(d => d.ChatLogs,           opt => opt.Ignore())
            .ForMember(d => d.SuperProjectionInputs, opt => opt.Ignore())
            .ForMember(d => d.UserFundSelections,    opt => opt.Ignore())
            .ForAllMembers(opt => opt.Condition((src, dest, srcMember) => srcMember != null));
    }
}
