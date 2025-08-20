using ISettlyService;
using Microsoft.AspNetCore.Mvc;
using SettlyModels.Dtos;
using SettlyService;
using Swashbuckle.AspNetCore.Annotations;

namespace SettlyApi.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    [SwaggerOperation(Summary = "Register a new user")]
    [SwaggerResponse(200, "User registered successfully", typeof(ResponseUserDto))]
    public async Task<ActionResult<ResponseUserDto>> Register([FromBody] RegisterUserDto registerUser)
    {
        var user = await _authService.RegisterAsync(registerUser);
        return Ok(user);
    }

    [HttpPost("login")]
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
