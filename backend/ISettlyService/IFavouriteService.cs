using SettlyModels.Dtos;
using SettlyModels.Entities;

namespace ISettlyService;

public interface IFavouriteService
{
    //Get all favourite for Favourite page
    Task<List<Favourite>> GetFavouritesByUserAsync(int userId);
    Task<bool> ToggleFavouriteAsync(AddFavouriteDto dto, int userId);
    Task<Favourite?> GetSingleFavouriteAsync(string targetType, int targetId, int userId);
}
