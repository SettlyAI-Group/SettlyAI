using Xunit;
using SettlyModels.Entities;
using SettlyModels;    
using SettlyModels.Dtos;        
using AutoMapper;
using SettlyService;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore; 
using System.Collections.Generic;

public class PropertyDetailApiTests
{
    private readonly IMapper _mapper;

    public PropertyDetailApiTests()
    {
        var config = new MapperConfiguration(cfg =>
        {
            cfg.CreateMap<Property, PropertyDetailDto>();

        });
        _mapper = config.CreateMapper();
    }

    private SettlyDbContext GetDbContextMock(List<Property> properties)
    {
        var options = new DbContextOptionsBuilder<SettlyDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb")
            .Options;

        var context = new SettlyDbContext(options);
        context.Properties.AddRange(properties);
        context.SaveChanges();

        return context;
    }

    [Fact]
    public async Task GeneratePropertyDetailAsync_ReturnsDto_WhenPropertyExists()
    {

        var property = new Property
        {
            Id = 1,
            Address = "123 Test Street",
            Features = new[] { "Pool", "Garage" },
            Price = 500000,
            PropertyType = "House",
            Bedrooms = 3,
            Bathrooms = 2,
            CarSpaces = 1,
            InternalArea = 120,
            LandSize = 300,
            YearBuilt = 2010,
            Summary = "Nice house",
            ImageUrl = "http://image.jpg",
            SuburbId = 1
        };

        var context = GetDbContextMock(new List<Property> { property });
        var service = new PropertyService(context, _mapper);

        // Act
        var result = await service.GeneratePropertyDetailAsync(1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(property.Id, result.Id);
        Assert.Equal(property.Address, result.Address);
        Assert.Equal(property.Price, result.Price);
        Assert.Equal(property.Features.Length, result.Features.Length);
    }

    [Fact]
    public async Task GeneratePropertyDetailAsync_Throws_WhenPropertyNotFound()
    {
        // Arrange
        var context = GetDbContextMock(new List<Property>());
        var service = new PropertyService(context, _mapper);

        // Act & Assert
        await Assert.ThrowsAsync<KeyNotFoundException>(() => service.GeneratePropertyDetailAsync(999));
    }
}
