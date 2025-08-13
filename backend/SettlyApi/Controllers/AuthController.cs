using ISettlyService;
using Microsoft.AspNetCore.Mvc;
using SettlyModels.Dtos;

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
    public async Task<ActionResult<ResponseUserDto>> Register([FromBody] RegisterUserDto registerUser)
    {
        var user = await _authService.RegisterAsync(registerUser);
        return Ok(user);
    }
}
