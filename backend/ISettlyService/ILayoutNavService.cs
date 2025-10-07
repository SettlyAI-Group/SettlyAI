using SettlyModels.Dtos;

namespace ISettlyService
{
    public interface ILayoutNavService
    {
        Task<IReadOnlyList<LayoutNavDto>> GetNavbarAsync();
    }
}
