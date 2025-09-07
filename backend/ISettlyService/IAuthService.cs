using SettlyModels.Dtos;
using SettlyModels.Entities;
using SettlyModels.Enums;
using SettlyModels.OAutOptions;

namespace ISettlyService;

public interface IAuthService
{
    Task<ResponseUserDto> RegisterAsync(RegisterUserDto registerUser);
    Task<LoginOutputDto> LoginAsync(LoginInputDto loginInput);
    Task<LoginOutputDto> OAuthLoginAsync(ExternalUser externalUser);
    Task<bool> ActivateUserAsync(VerifyCodeDto verifyCodeDto);
    Task SendVerificationCodeAsync(User user, VerificationType verificationType);
}
