using Xunit;
using SettlyModels.Entities;
using SettlyModels;
using SettlyModels.Dtos;
using AutoMapper;
using SettlyService;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
public class SuburbServiceTests
{
    private SettlyDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<SettlyDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new SettlyDbContext(options);
    }

    [Fact]
    public async Task GetSnapshotAsync_ShouldReturnValues_WhenHousingMarketExists()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var suburb = new Suburb { Id = 1, Name = "Sydney", State = "NSW", Postcode = "2000" };
        var housing = new HousingMarket { Id = 1, SuburbId = 1, MedianPrice = 800000, VacancyRate = 2.5m, SnapshotDate = DateTime.UtcNow };

        context.Suburbs.Add(suburb);
        context.HousingMarkets.Add(housing);
        await context.SaveChangesAsync();

        var service = new SuburbService(context, null!);

        // Act
        var snapshot = await service.GetSnapshotAsync(1);

        // Assert
        Assert.Equal("Sydney", snapshot.SuburbName);
        Assert.Equal(800000, snapshot.MedianPrice);
        Assert.Equal(2.5m, snapshot.VacancyRatePct);
    }

    [Fact]
    public async Task GetSnapshotAsync_ShouldReturnNullValues_WhenNoHousingMarket()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var suburb = new Suburb { Id = 2, Name = "Melbourne", State = "VIC", Postcode = "3000" };

        context.Suburbs.Add(suburb);
        await context.SaveChangesAsync();

        var service = new SuburbService(context, null!);

        // Act
        var snapshot = await service.GetSnapshotAsync(2);

        // Assert
        Assert.Equal("Melbourne", snapshot.SuburbName);
        Assert.Null(snapshot.MedianPrice);
        Assert.Null(snapshot.VacancyRatePct);
    }

    [Fact]
    public async Task GetSnapshotAsync_ShouldThrow_WhenSuburbNotFound()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var service = new SuburbService(context, null!);

        // Act + Assert
        await Assert.ThrowsAsync<NotImplementedException>(() => service.GetSnapshotAsync(999));
    }
}
