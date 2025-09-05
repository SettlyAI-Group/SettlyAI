using ISettlyService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
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

    public AuthController(IAuthService authService, SettlyDbContext context)
    {
        _authService = authService;
        _context = context;
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
    public async Task<ActionResult<LoginOutputDto>> Login(LoginInputDto loginInput)
    {
        LoginOutputDto result = await _authService.LoginAsync(loginInput);
        if (result is null)
        {
            return BadRequest("Invalid username or password.");
        }

        return Ok(result);
    }
}
