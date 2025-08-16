using System.Runtime.CompilerServices;
using AutoMapper;
using ISettlyService;
using SettlyModels;
using SettlyModels.Dtos;


namespace SettlyService
{

    public class PropertyDetailService : IPropertyDetailService
    {
        private readonly SettlyDbContext _context;
        private readonly IMapper _mapper;

        public PropertyDetailService(SettlyDbContext context, IMapper mapper)
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

    }

}
