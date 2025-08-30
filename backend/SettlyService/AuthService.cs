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
    private readonly IEmailService _emailService;
    private readonly ICreateTokenService _createTokenService;

    public AuthService(
        SettlyDbContext context,
        IUserService userService,
        IVerificationCodeService verificationCodeService,
        IEmailService emailService,
        ICreateTokenService createTokenService)
    {
        _context = context;
        _userService = userService;
        _verificationCodeService = verificationCodeService;
        _emailService = emailService;
        _createTokenService = createTokenService;
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
                    await _emailService.SendAsync(
                        savedUser.Name,
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

    public async Task<LoginOutputDto> LoginAsync(LoginInputDto loginInput)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginInput.Email);
        if (user is null)
        {
            return null;
        }

        if (!BCrypt.Net.BCrypt.Verify(loginInput.Password, user.PasswordHash))
        {
            return null;
        }

        string accessToken = _createTokenService.CreateToken(user);

        LoginOutputDto loginOutputDto = new LoginOutputDto
        {
            UserName = user.Name,
            AccessToken = accessToken,
        };

        return loginOutputDto;
    }

    public async Task<bool> ActivateUserAsync(VerifyCodeDto verifyCodeDto)
    {
        var ok = await _verificationCodeService.VerifyCodeAsync(verifyCodeDto);
        if (!ok) return false;
        var updateDto = new UserUpdateDto
        {
            IsActive = true
        };

        return await _userService.UpdateUserByIdAsync(verifyCodeDto.UserId, updateDto);;
    }
}
