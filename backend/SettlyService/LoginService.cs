using ISettlyService;
using Microsoft.EntityFrameworkCore;
using SettlyModels;
using SettlyModels.Dtos;

namespace SettlyService
{
    public class LoginService : ILoginService
    {
        private readonly SettlyDbContext _context;
        private readonly ICreateTokenService _createTokenService;

        public LoginService(SettlyDbContext context, ICreateTokenService createTokenService)
        {
            _context = context;
            _createTokenService = createTokenService;
        }

        public async Task<LoginOutputDto> LoginAsync(LoginInputDto loginInput)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginInput.Email);
            if (user is null)
            {
                return null;
            }
            if (BCrypt.Net.BCrypt.HashPassword(loginInput.Password) != user.PasswordHash)
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

    }


}
