using ISettlyService;
using Microsoft.EntityFrameworkCore;
using SettlyModels;
using SettlyModels.Dtos;
using SettlyModels.Entities;
using SettlyModels.Enums;
using SettlyService.Exceptions;

namespace SettlyService;

public class AuthService : IAuthService
{
    private readonly SettlyDbContext _context;
    private readonly IUserService _userService;
    private readonly IVerificationCodeService _verificationCodeService;
    private readonly IEmailSender _emailSender;

    public AuthService(
        SettlyDbContext context,
        IUserService userService,
        IVerificationCodeService verificationCodeService,
        IEmailSender emailSender)
    {
        _context = context;
        _userService = userService;
        _verificationCodeService = verificationCodeService;
        _emailSender = emailSender;
    }

    public async Task<ResponseUserDto> RegisterAsync(RegisterUserDto registerUser)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var existing = await _context.Users.FirstOrDefaultAsync(u => u.Email == registerUser.Email);
            if (existing is not null && existing.IsActive)
                throw new ArgumentException("Email is already registered.");

            if (existing is not null && !existing.IsActive)
                throw new EmailUnverifiedException("Email is registered but not yet verified.");

            var user = new User
            {
                Name = registerUser.FullName,
                Email = registerUser.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerUser.Password),
                CreatedAt = DateTime.UtcNow
            };

            var savedUser = await _userService.AddUserAsync(user);

            var (code, actualType) = await _verificationCodeService.SaveCodeAsync(savedUser.Id, registerUser.VerificationType);

            switch (actualType)
            {
                case VerificationType.Email:
                    await _emailSender.SendAsync(
                        savedUser.Email,
                        "Email Verification Code",
                        $"Your email verification code is {code}."
                    );
                    break;

                default:
                    throw new ArgumentException($"Unsupported verification type: {registerUser.VerificationType}");
            }

            await transaction.CommitAsync();

            return new ResponseUserDto
            {
                Id = savedUser.Id,
                FullName = savedUser.Name,
                Email = savedUser.Email
            };
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}
