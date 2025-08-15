using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SettlyModels;
using SettlyModels.Dtos;
using SettlyModels.Entities;
using SettlyService;
using Xunit;

public class PropertyRecommendationApiTests
{
    private readonly IMapper _mapper;
    private readonly SettlyDbContext _context;

    public PropertyRecommendationApiTests()
    {
        // AutoMapper 
        var config = new MapperConfiguration(cfg =>
        {
            cfg.CreateMap<Property, PropertyRecommendationDto>(); 
            cfg.CreateMap<Property, PropertyDetailDto>();     
        });
        _mapper = config.CreateMapper();

        // InMemory 
        var options = new DbContextOptionsBuilder<SettlyDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb")
            .EnableSensitiveDataLogging()
            .Options;

        _context = new SettlyDbContext(options);

        // init database
        SeedTestData().Wait();
    }

    private async Task SeedTestData()
    {
        var properties = new List<Property>
        {
            new Property { Id = 1, SuburbId = 10, Price = 500000, Address = "A St", Bedrooms = 3, Bathrooms = 2, PropertyType="House", ImageUrl="url1", CarSpaces=1 },
            new Property { Id = 2, SuburbId = 10, Price = 510000, Address = "B St", Bedrooms = 4, Bathrooms = 2, PropertyType="Apartment", ImageUrl="url2", CarSpaces=2 },
            new Property { Id = 3, SuburbId = 20, Price = 520000, Address = "C St", Bedrooms = 3, Bathrooms = 1, PropertyType="Townhouse", ImageUrl="url3", CarSpaces=1 },
            new Property { Id = 4, SuburbId = 20, Price = 480000, Address = "D St", Bedrooms = 2, Bathrooms = 1, PropertyType="Unit", ImageUrl="url4", CarSpaces=1 },
            new Property { Id = 5, SuburbId = 10, Price = 495000, Address = "E St", Bedrooms = 3, Bathrooms = 2, PropertyType="Villa", ImageUrl="url5", CarSpaces=1 }
        };

        _context.Properties.AddRange(properties);
        await _context.SaveChangesAsync();
    }

    [Fact]
    public async Task GetSimilarPropertiesAsync_ShouldReturnRecommendations()
    {
        // Arrange
        var service = new PropertyService(_context, _mapper);
        int targetPropertyId = 1;
        int take = 3;

        // Act
        var result = await service.GetSimilarPropertiesAsync(targetPropertyId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(take, result.Count); // return count = take
        Assert.All(result, r => Assert.NotEqual(targetPropertyId, r.Id)); // exclud itself
        Assert.Contains(result, r => r.SuburbId == 10); // include suburb
        Assert.All(result, r => Assert.False(string.IsNullOrEmpty(r.ImageUrl))); // image not null
    }
}
