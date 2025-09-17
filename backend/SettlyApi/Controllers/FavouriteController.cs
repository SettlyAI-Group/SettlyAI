using Microsoft.AspNetCore.Mvc;
using SettlyModels.Dtos;
using ISettlyService;
using Swashbuckle.AspNetCore.Annotations;
using Microsoft.AspNetCore.Authorization;
using SettlyApi.Filters;

namespace SettlyApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    //Validate the userId extracted from the JWT token.
    [UserIdFilter]
    public class FavouriteController : ControllerBase
    {
        private readonly IFavouriteService _favouriteService;

        public FavouriteController(IFavouriteService favouriteService)
        {
            _favouriteService = favouriteService;
        }
        private int UserId
        {
            get
            {
                if (HttpContext.Items.TryGetValue(UserIdItemKeys.UserId, out var v)&& v is int id)
                {
                    return id;
                }
                throw new UnauthorizedAccessException("UserId missing or invalid.");            }
        }
        [HttpGet]
        [SwaggerOperation(Summary = "Get user favourites")]
        [SwaggerResponse(200, "Successfully retrieved favourites")]
        public async Task<IActionResult> GetFavourites()
        {
            var favourites = await _favouriteService.GetFavourites(UserId);
            return Ok(favourites);
        }
        [HttpPost("toggle")]
        [SwaggerOperation(Summary = "Toggle a favourite item for the user")]
        [SwaggerResponse(200, "Favourite toggled")]
        public async Task<IActionResult> ToggleFavourite([FromBody] AddFavouriteDto dto)
        {
            var isSaved = await _favouriteService.ToggleFavouriteAsync(dto, UserId);
            return Ok(new
            {
                isSaved,
                message = isSaved ? "Favourite added." : "Favourite removed"
            });
        }
        [HttpGet("single")]
        [SwaggerOperation(Summary = "Get single favourite by target type and ID")]
        [SwaggerResponse(200, "Successfully retrieved favourite")]
        public async Task<IActionResult> GetSingleFavourite([FromQuery] string targetType, [FromQuery] int targetId)
        {
            var favourite = await _favouriteService.GetSingleFavouriteAsync(targetType, targetId, UserId);
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
