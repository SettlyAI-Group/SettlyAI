using Microsoft.AspNetCore.Mvc;
using SettlyModels.Dtos;
using ISettlyService;
using Swashbuckle.AspNetCore.Annotations;

namespace SettlyApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FavouriteController : ControllerBase
    {
        private readonly IFavouriteService _favouriteService;

        public FavouriteController(IFavouriteService favouriteService)
        {
            _favouriteService = favouriteService;
        }
        [HttpGet]
        [SwaggerOperation(Summary = "Get user favourites")]
        [SwaggerResponse(200, "Successfully retrieved favourites")]
        public async Task<IActionResult> GetFavourites([FromQuery] int userId)
        {
            var favourites = await _favouriteService.GetFavourites(userId);
            return Ok(favourites);
        }
        [HttpPost("toggle")]
        [SwaggerOperation(Summary = "Toggle a favourite item for the user")]
        [SwaggerResponse(200, "Favourite toggled")]
        public async Task<IActionResult> ToggleFavourite([FromBody] AddFavouriteDto dto, [FromQuery] int userId)
        {
            var isSaved = await _favouriteService.ToggleFavouriteAsync(dto, userId);
            return Ok(new
            {
                isSaved,
                message = isSaved ? "Favourite added." : "Favourite removed"
            });
        }
        [HttpGet("single")]
        [SwaggerOperation(Summary = "Get single favourite by target type and ID")]
        [SwaggerResponse(200, "Successfully retrieved favourite")]
        public async Task<IActionResult> GetSingleFavourite([FromQuery] string targetType, [FromQuery] int targetId, [FromQuery] int userId)
        {
            var favourite = await _favouriteService.GetSingleFavouriteAsync(targetType, targetId, userId);
            if (favourite == null)
                return Ok(new { isSaved = false });
            return Ok(new
            {
                isSaved = true,
                notes = favourite.Notes,
                priority = favourite.Priority,
                createdAt = favourite.CreatedAt,
            });
        }

    }
}
