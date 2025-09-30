using ISettlyService;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using SettlyModels;
using SettlyModels.Dtos;
using SettlyModels.Entities;
using SettlyModels.Enums;
using SettlyModels.OAutOptions;
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
            {
                if (string.IsNullOrEmpty(existing.PasswordHash))
                {
                    existing.PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerUser.Password);
                    existing.Name = registerUser.FullName;
                    await _context.SaveChangesAsync();
                    
                    return new ResponseUserDto
                    {
                        Id = existing.Id,
                        FullName = existing.Name,
                        Email = existing.Email
                    };
                }
                throw new ArgumentException("Email is already registered.");
            }

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

            await SendVerificationCodeAsync(savedUser, registerUser.VerificationType);

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

        string accessToken = _createTokenService.CreateAccessToken(user.Name, user.Id);
        string refreshToken = null;

        if (loginInput.IsLongLifeLogin)
        {
            refreshToken = _createTokenService.CreateRefreshToken(user.Name, user.Id);
        }
        
        LoginOutputDto loginOutputDto = new LoginOutputDto
        {
            UserName = user.Name,
            AccessToken = accessToken,
            RefreshToken = refreshToken
        };

        return loginOutputDto;
    }

    public async Task<LoginOutputDto> OAuthLoginAsync(ExternalUser externalUser)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            var user = await FindOrCreateOAuthUserAsync(externalUser);

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();

            return GenerateLoginResponse(user);
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    private async Task<User> FindOrCreateOAuthUserAsync(ExternalUser externalUser)
    {
        var existingOAuth = await FindExistingOAuthAccountAsync(externalUser.Provider, externalUser.ProviderUserId);

        if (existingOAuth != null)
        {
            UpdateOAuthAccountInfo(existingOAuth, externalUser);
            return existingOAuth.User;
        }

        var user = await FindOrCreateUserByEmailAsync(externalUser);

        CreateOAuthBinding(user, externalUser);

        return user;
    }

    private async Task<UserOAuth?> FindExistingOAuthAccountAsync(string provider, string providerUserId)
    {
        return await _context.UserOAuths
            .Include(uo => uo.User)
            .FirstOrDefaultAsync(uo =>
                uo.Provider == provider &&
                uo.ProviderUserId == providerUserId);
    }

    private void UpdateOAuthAccountInfo(UserOAuth existingOAuth, ExternalUser externalUser)
    {
        existingOAuth.Email = externalUser.Email;
        existingOAuth.Name = externalUser.Name;
        existingOAuth.AvatarUrl = externalUser.AvatarUrl;
        existingOAuth.UpdatedAt = DateTime.UtcNow;
    }

    private async Task<User> FindOrCreateUserByEmailAsync(ExternalUser externalUser)
    {
        if (!string.IsNullOrEmpty(externalUser.Email))
        {
            var existingUser = await _userService.FindUserByEmailAsync(externalUser.Email);
            if (existingUser != null)
            {
                return existingUser;
            }
        }

        var newUser = new User
        {
            Name = externalUser.Name ?? "OAuth User",
            Email = externalUser.Email ?? "",
            PasswordHash = "",
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };

        return await _userService.AddUserAsync(newUser);
    }

    private void CreateOAuthBinding(User user, ExternalUser externalUser)
    {
        var userOAuth = new UserOAuth
        {
            UserId = user.Id,
            Provider = externalUser.Provider,
            ProviderUserId = externalUser.ProviderUserId,
            Email = externalUser.Email,
            Name = externalUser.Name,
            AvatarUrl = externalUser.AvatarUrl,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.UserOAuths.Add(userOAuth);
    }

    private LoginOutputDto GenerateLoginResponse(User user)
    {
        string accessToken = _createTokenService.CreateToken(user);

        return new LoginOutputDto
        {
            UserName = user.Name,
            AccessToken = accessToken
        };
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

    public async Task SendVerificationCodeAsync(User user, VerificationType verificationType)
    {
        var (code, actualType) = await _verificationCodeService.SaveCodeAsync(user.Id, verificationType);

        switch (actualType)
        {
            case VerificationType.Email:
                await _emailService.SendAsync(
                    user.Name,
                    user.Email,
                    "Email Verification Code",
                    $"Your email verification code is {code}."
                );
                break;

            default:
                throw new ArgumentException($"Unsupported verification type: {verificationType}");
        }
    }
}
