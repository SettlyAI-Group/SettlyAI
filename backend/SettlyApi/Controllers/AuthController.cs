using ISettlyService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SettlyModels;
using SettlyModels.Dtos;
using SettlyModels.OAutOptions;
using SettlyService;
using Swashbuckle.AspNetCore.Annotations;

namespace SettlyApi.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly SettlyDbContext _context;
    private readonly IOAuthService _oAuthService;
    private readonly JWTConfig jwtConfig;
    private readonly ICreateTokenService _createTokenService;

    public AuthController(IAuthService authService, SettlyDbContext context, IOAuthService oAuthService,
        IOptions<JWTConfig> options, ICreateTokenService createTokenService)
    {
        _authService = authService;
        _context = context;
        _oAuthService = oAuthService;
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
    [SwaggerResponse(200, "User logined successfully")]
    [SwaggerResponse(401, "Invalid username or password")]
    public async Task<IActionResult> Login(LoginInputDto loginInput)
    {
        LoginOutputDto result = await _authService.LoginAsync(loginInput);

        if (result is null)
        {
            return Unauthorized("Invalid username or password.");
        }

        // Add accessToken into cookies
        AppendCookie("accessToken", result.AccessToken, httpOnly: true, minutes: jwtConfig.ExpireMinutes);

        // Add refreshToken into cookies
        if (loginInput.IsLongLifeLogin && result.RefreshToken is not null)
        {
            AppendCookie("refreshToken", result.RefreshToken, httpOnly: true, days: jwtConfig.ExpireDays);
        }

        return Ok(new { message = "Login successful" });
    }
    [HttpPost("oauth/login")]
    [EnableRateLimiting("LoginIpFixedWindow")]
    [SwaggerOperation(Summary = "OAuth login")]
    [SwaggerResponse(200, "OAuth login successful")]
    public async Task<IActionResult> OAuthLogin([FromBody] OAuthLoginRequestDto authLoginRequest)
    {
        var tokenResult = await _oAuthService.ExchangeTokenAsync(authLoginRequest.Provider, authLoginRequest.Code);

        var externalUser = await _oAuthService.GetUserAsync(
            authLoginRequest.Provider,
            tokenResult.AccessToken,
            tokenResult.IdToken);

        var loginResult = await _authService.OAuthLoginAsync(externalUser);

        // Add accessToken into cookies
        AppendCookie("accessToken", loginResult.AccessToken, httpOnly: true, minutes: jwtConfig.ExpireMinutes);

        // Add refreshToken into cookies
        if (loginResult.RefreshToken is not null)
        {
            AppendCookie("refreshToken", loginResult.RefreshToken, httpOnly: true, days: jwtConfig.ExpireDays);
        }

        return Ok(new { message = "Login successful" });
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

    [HttpGet("me")]
    [SwaggerOperation(Summary = "Get current user information")]
    [SwaggerResponse(200, "User information retrieved successfully", typeof(ResponseUserDto))]
    [SwaggerResponse(401, "Unauthorized")]
    [SwaggerResponse(404, "User not found")]
    public async Task<ActionResult<ResponseUserDto>> GetCurrentUser()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
        {
            return Unauthorized();
        }

        var userInfo = await _authService.GetUserInfoAsync(userId);
        if (userInfo == null)
        {
            return NotFound("User not found");
        }

        return Ok(userInfo);
    }

    private void AppendCookie(string name, string value, bool httpOnly = true, int? minutes = null, int? days = null)
    {
        string path = "/";
        if (name == "refreshToken")
        {
            path = "/api/auth/refresh";
        }
        var opts = new CookieOptions
        {
            HttpOnly = httpOnly,
            Secure = true,
            SameSite = SameSiteMode.Lax,
            Path = path
        };
        if (minutes.HasValue) opts.Expires = DateTimeOffset.UtcNow.AddMinutes(minutes.Value);
        if (days.HasValue) opts.Expires = DateTimeOffset.UtcNow.AddDays(days.Value);

        Response.Cookies.Append(name, value, opts);
    }
}
