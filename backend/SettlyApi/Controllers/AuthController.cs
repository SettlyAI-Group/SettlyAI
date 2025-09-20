using ISettlyService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SettlyModels;
using SettlyModels.Dtos;
using SettlyService;
using Swashbuckle.AspNetCore.Annotations;

namespace SettlyApi.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly SettlyDbContext _context;
    private readonly JWTConfig jwtConfig;
    private readonly ICreateTokenService _createTokenService;

    public AuthController(IAuthService authService, SettlyDbContext context,
        IOptions<JWTConfig> options, ICreateTokenService createTokenService)
    {
        _authService = authService;
        _context = context;
        jwtConfig = options.Value;
        _createTokenService = createTokenService;
    }

    [HttpPost("register")]
    [SwaggerOperation(Summary = "Register a new user")]
    [SwaggerResponse(200, "User registered successfully", typeof(ResponseUserDto))]
    public async Task<ActionResult<ResponseUserDto>> Register([FromBody] RegisterUserDto registerUser)
    {
        var user = await _authService.RegisterAsync(registerUser);
        return Ok(user);
    }

    [HttpPost("activate")]
    [SwaggerOperation(Summary = "activate user by email verification code")]
    public async Task<IActionResult> VerifyCode([FromBody] VerifyCodeDto verifyCodeDto)
    {
        var success = await _authService.ActivateUserAsync(verifyCodeDto);
        if (!success)
        {
            return BadRequest("Invalid or expired verification code");
        }
        return Ok(new { message = "Verification successful, account activated" });
    }

    [HttpPost("send-verification-code")]
    [SwaggerOperation(Summary = "Send verification code to user")]
    [SwaggerResponse(200, "Verification code sent successfully")]
    [SwaggerResponse(400, "User not found or already activated")]
    public async Task<IActionResult> SendVerificationCode([FromBody] ResendVerificationDto resendDto)
    {
        // Find user by userId
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == resendDto.UserId);
        if (user is null || user.IsActive)
        {
            return BadRequest("User not found or already activated");
        }

        await _authService.SendVerificationCodeAsync(user, resendDto.VerificationType);
        return Ok(new { message = "Verification code sent successfully" });
    }


    [HttpPost("login")]
    [EnableRateLimiting("LoginIpFixedWindow")]
    [SwaggerOperation(Summary = "Users use email and password to login")]
    [SwaggerResponse(200, "User logined successfully", typeof(LoginOutputDto))]
    [SwaggerResponse(401, "Invalid username or password")]
    public async Task<ActionResult<LoginOutputDto>> Login(LoginInputDto loginInput)
    {
        LoginOutputDto result = await _authService.LoginAsync(loginInput);

        if (result is null)
        {
            return Unauthorized("Invalid username or password.");
        }

        // Add accessToken into cookies
        AppendCookie("accessToken", result.AccessToken, httpOnly: true, minutes: jwtConfig.ExpireMinutes);

        // Add refreshToken into cookies if refreshToken is available
        if (result.RefreshToken is not null)
        {
            AppendCookie("refreshToken", result.RefreshToken, httpOnly: true, days: jwtConfig.ExpireDays);
        }
        return Ok(result);
    }

    [HttpPost("refresh")]
    public IActionResult Refresh()
    {
        var refresh = Request.Cookies["refreshToken"];
        if (string.IsNullOrEmpty(refresh)) return Unauthorized();

        if (!_createTokenService.ValidateRefreshToken(refresh, out var userName, out var userId))
            return Unauthorized();

        var newAccessToken = _createTokenService.CreateAccessToken(userName, userId);
        AppendCookie("accessToken", newAccessToken, httpOnly: true, minutes: jwtConfig.ExpireMinutes);

        return Ok(true);
    }

    private void AppendCookie(string name, string value, bool httpOnly = true, int? minutes = null, int? days = null)
    {
        var opts = new CookieOptions
        {
            HttpOnly = httpOnly,
            Secure = true,                
            SameSite = SameSiteMode.Lax,  
            Path = "/"
        };
        if (minutes.HasValue) opts.Expires = DateTimeOffset.UtcNow.AddMinutes(minutes.Value);
        if (days.HasValue) opts.Expires = DateTimeOffset.UtcNow.AddDays(days.Value);

        Response.Cookies.Append(name, value, opts);
    }
}
