using SettlyModels.Entities;

namespace ISettlyService
{
    public interface ICreateTokenService
    {
        string CreateAccessToken(string userName, int userId);
        string CreateRefreshToken(string userName, int userId);
        bool ValidateRefreshToken(string refreshToken, out string? userName, out int userId);
    }
}
