using ISettlyService;
using Microsoft.AspNetCore.Mvc;
using SettlyModels.Dtos;

namespace SettlyApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly ILoginService _loginService;
        public LoginController(ILoginService loginService)
        {
            _loginService = loginService;
        }

        [HttpPost]
        public async Task<ActionResult<LoginOutputDto>> Login(LoginInputDto loginInput)
        {
            LoginOutputDto result = await _loginService.LoginAsync(loginInput);
            if (result is null)
            {
                return BadRequest("Invalid username or password.");
            }

            return Ok(result);
        }
    }
}
