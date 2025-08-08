using SettlyModels.Entities;

namespace ISettlyService
{
    public interface ICreateTokenService
    {
        string CreateToken(User user);
    }
}
