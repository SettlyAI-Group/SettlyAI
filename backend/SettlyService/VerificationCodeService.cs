using ISettlyService;
using SettlyModels;
using SettlyModels.Entities;
using SettlyModels.Enums;
using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using SettlyModels.Dtos;

namespace SettlyService;

public class VerificationCodeService : IVerificationCodeService
{
    private readonly SettlyDbContext _context;

    public VerificationCodeService(SettlyDbContext context)
    {
        _context = context;
    }

    public async Task<(string code, VerificationType actualType)> SaveCodeAsync(int userId,
        VerificationType verificationType)
    {
        await ConsumeAllVerificationsByUserAsync(userId, verificationType);
        var code = GenerateSecureRandomCode();
        var expiry = DateTime.UtcNow.AddMinutes(15);

        var verification = new Verification
        {
            UserId = userId,
            Code = code,
            CreatedAt = DateTime.UtcNow,
            VerificationType = verificationType,
            Expiry = expiry,
            IsUsed = false
        };

        _context.Verifications.Add(verification);
        await _context.SaveChangesAsync();

        return (code, verificationType);
    }

    public async Task<bool> VerifyCodeAsync(VerifyCodeDto verifyCodeDto)
    {
        var entity = await _context.Verifications
            .FirstOrDefaultAsync(v => v.UserId == verifyCodeDto.UserId
                                      && v.VerificationType == verifyCodeDto.VerificationType
                                      && v.Code == verifyCodeDto.Code
                                      && !v.IsUsed
                                      && v.Expiry > DateTime.UtcNow);
        if (entity is null) return false;
        entity.IsUsed = true;
        await _context.SaveChangesAsync();
        return true;
    }

    private async Task ConsumeAllVerificationsByUserAsync(int userId, VerificationType type)
    {
        var valids = await GetActiveVerification(userId, type).ToListAsync();
        foreach (var v in valids) v.IsUsed = true;

        await _context.SaveChangesAsync();
    }


    private IQueryable<Verification> GetActiveVerification(int userId, VerificationType type)
    {
        var now = DateTime.UtcNow;
        return _context.Verifications
            .Where(v => v.UserId == userId
                        && v.VerificationType == type
                        && v.Expiry > now
                        && !v.IsUsed)
            .OrderByDescending(v => v.CreatedAt);
    }


    private static string GenerateSecureRandomCode()
    {
        var code = RandomNumberGenerator.GetInt32(100000, 1000000).ToString();
        return code;
    }
}
