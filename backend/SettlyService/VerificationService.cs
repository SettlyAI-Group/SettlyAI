using ISettlyService;
using SettlyModels;
using SettlyModels.Entities;
using SettlyModels.Enums;
using System.Security.Cryptography;

namespace SettlyService;

public class VerificationCodeService : IVerificationCodeService
{
    private readonly SettlyDbContext _context;

    public VerificationCodeService(SettlyDbContext context)
    {
        _context = context;
    }

    public async Task<(string code, VerificationType actualType)> SaveCodeAsync(int userId,
        VerificationType? verificationType)
    {
        var actualType = verificationType ?? VerificationType.Email;
        var code = GenerateSecureRandomCode();
        var expiry = DateTime.UtcNow.AddMinutes(15);

        var verification = new Verification
        {
            UserId = userId,
            Code = code,
            CreatedAt = DateTime.UtcNow,
            VerificationType = actualType,
            Expiry = expiry,
            IsUsed = false
        };

        _context.Verifications.Add(verification);
        await _context.SaveChangesAsync();

        return (code, actualType);
    }

    private static string GenerateSecureRandomCode()
    {
        var code = RandomNumberGenerator.GetInt32(100000, 1000000).ToString();
        return code;
    }
}
