using System.ComponentModel;
using System.Linq.Expressions;
using SettlyModels.Entities;
using System.Reflection.Metadata.Ecma335;
using ISettlyService;
using Microsoft.EntityFrameworkCore;
using SettlyModels;
using SettlyModels.Dtos;

namespace SettlyService
{
    public class SuburbOverviewService : ISuburbOverview
    {
        private readonly SettlyDbContext _context;

        public SuburbOverviewService(SettlyDbContext context)
        {
            _context = context;
        }


        public async Task<SuburbOverviewDto> GetSuburbOverviewAsync(MapInputDto input)
        {
            var suburb = await GetSuburbAsyc(input);
            var suburbId = suburb.Id;
        }


        //1-Suburb Section
        //Convert data state from frontend to statecode
        private static readonly Dictionary<string, string> StateCodes =
            new(StringComparer.OrdinalIgnoreCase)
            {
                ["New South Wales"] = "NSW",
                ["Victoria"] = "VIC",
                ["Queensland"] = "QLD",
                ["South Australia"] = "SA",
                ["Western Australia"] = "WA",
                ["Tasmania"] = "TAS",
                ["Northern Territory"] = "NT",
                ["Australian Capital Territory"] = "ACT"
            };

        private static string GetStatecode(string stateName)
        {
            return StateCodes.TryGetValue(stateName, out var code)
            ? code
            : stateName;
        }

        //Getting Suburb data
        private async Task<SuburbOverviewSuburbDto> GetSuburbAsyc(MapInputDto input)
        {
            var postcodeMatch = await PostCodeMatching(input.Postcode);
            if (postcodeMatch != null)
            {
                return postcodeMatch;
            }
            var suburbMatch = await suburbMatching(input.Suburb);
            if (suburbMatch != null)
            {
                return suburbMatch;
            }
            var stateCode = GetStatecode(input.State);
            return await statebMatching(stateCode);
        }
        private async Task<SuburbOverviewSuburbDto?> PostCodeMatching(string postcode)
        {
            return await _context.Suburbs
                 .Where(s => EF.Functions.ILike(s.Postcode, postcode))
                 .Select(ToSuburbDto())
                .FirstOrDefaultAsync();
        }

        private async Task<SuburbOverviewSuburbDto?> suburbMatching(string suburb)
        {
            return await _context.Suburbs
                 .Where(s => EF.Functions.ILike(s.Name, suburb))
                  .Select(ToSuburbDto())
                 .FirstOrDefaultAsync();
        }

        private async Task<SuburbOverviewSuburbDto> statebMatching(string state)
        {
            return await _context.Suburbs
                 .Where(s => EF.Functions.ILike(s.Name, state))
                    .Select(ToSuburbDto())
                 .FirstAsync();
        }

        private static Expression<Func<Suburb, SuburbOverviewSuburbDto>> ToSuburbDto()
        {
            return s => new SuburbOverviewSuburbDto
            {
                Id = s.Id,
                Name = s.Name,
                State = s.State,
                Postcode = s.Postcode
            };
        }

    }
}
