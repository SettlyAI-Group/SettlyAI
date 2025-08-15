using System.Collections.Generic;
using System.Runtime.CompilerServices;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using ISettlyService;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using SettlyModels;
using SettlyModels.Dtos;


namespace SettlyService
{

    public class PropertyService : IPropertyService
    {
        private readonly SettlyDbContext _context;
        private readonly IMapper _mapper;

        public PropertyService(SettlyDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }


        public async Task<PropertyDetailDto> GeneratePropertyDetailAsync(int propertyId)
        {

            var property = await _context.Properties.FindAsync(propertyId);
            if (property == null)
                throw new KeyNotFoundException($"No property found for property id {propertyId}.");

            var propertyDto = _mapper.Map<PropertyDetailDto>(property);
            return propertyDto;
        }

        public async Task<List<PropertyRecommendationDto>> GetSimilarPropertiesAsync(int propertyId)
        {

            var take = 3;
            var currentProperty = await GetCurrentPropertyInfo(propertyId);
            if (currentProperty == null)
                throw new KeyNotFoundException($"No property found for property id {propertyId}.");

            //1. from same suburb
            var sameSuburbRecommendations = await GetSameSuburbRecommendations(currentProperty.Value, propertyId, take);


            //2. if can't find enough from suburb
            if (sameSuburbRecommendations.Count < take)
            {
                var remainingCount = take - sameSuburbRecommendations.Count;
                var otherRecommendations = await GetOtherSuburbRecommendations(
                    currentProperty.Value,
                    propertyId,
                    sameSuburbRecommendations.Select(r => r.Id).ToHashSet(),
                    remainingCount
                );

                sameSuburbRecommendations.AddRange(otherRecommendations);
            }

            return sameSuburbRecommendations;
        }

        private async Task<(int SuburbId, int Price)?> GetCurrentPropertyInfo(int propertyId)
        {
            return await _context.Properties
                .Where(p => p.Id == propertyId)
                .Select(p => new { p.SuburbId, p.Price })
                .FirstOrDefaultAsync()
                is { } result
                ? (result.SuburbId, result.Price)
                : null;
        }

        private async Task<List<PropertyRecommendationDto>> GetSameSuburbRecommendations(
            (int SuburbId, int Price) currentProperty,
            int propertyId,
            int take)
        {
            return await _context.Properties
                .Where(p => p.Id != propertyId && p.SuburbId == currentProperty.SuburbId)
                .OrderBy(p => Math.Abs(p.Price - currentProperty.Price))
                .ProjectTo<PropertyRecommendationDto>(_mapper.ConfigurationProvider)
                .Take(take)
                .ToListAsync();
        }

        private async Task<List<PropertyRecommendationDto>> GetOtherSuburbRecommendations(
            (int SuburbId, int Price) currentProperty,
            int propertyId,
            HashSet<int> excludedIds,
            int take)
        {
            return await _context.Properties
                .Where(p => p.Id != propertyId && p.SuburbId != currentProperty.SuburbId && !excludedIds.Contains(p.Id))
                .OrderBy(p => Math.Abs(p.Price - currentProperty.Price))
                .ProjectTo<PropertyRecommendationDto>(_mapper.ConfigurationProvider)
                .Take(take)
                .ToListAsync();
        }

    }

}
