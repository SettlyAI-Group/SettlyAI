using SettlyModels.Dtos;
using SettlyModels.Entities;
namespace ISettlyService;
using SettlyModels.Enums;
public interface IVerificationCodeService
{
    Task<(string code, VerificationType actualType)> SaveCodeAsync(int userId,
        VerificationType verificationType);

    Task<bool> VerifyCodeAsync(VerifyCodeDto verifyCodeDto);
}
